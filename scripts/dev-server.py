#!/usr/bin/env python3
"""Local dev server with HTTP Range support and optional bandwidth throttling.

Python's built-in http.server ignores Range requests, which Safari needs to play
video and every browser uses to seek. Real hosts (Netlify, Vercel, Cloudflare)
support them, so this keeps local behaviour honest.

Usage: dev-server.py PORT DIRECTORY [KB_PER_SEC [CUT_VIDEO_AT_BYTES]]

KB_PER_SEC (optional) caps total bandwidth across all connections, to simulate a
slow phone connection (e.g. 400 is roughly a weak 4G signal).

CUT_VIDEO_AT_BYTES (optional, test hook) drops any .mp4 connection once that many bytes
have been sent, to simulate a connection dying mid-download. Use 0 for KB_PER_SEC to skip throttling.
"""
import os
import re
import socket
import sys
import threading
import time
from functools import partial
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer

CHUNK = 32 * 1024

_pipe_lock = threading.Lock()
_pipe_free_at = 0.0


def throttle(nbytes, kb_per_sec):
    # One shared "pipe": each chunk books its slot, so parallel downloads split the bandwidth.
    global _pipe_free_at
    if not kb_per_sec:
        return
    with _pipe_lock:
        now = time.monotonic()
        start = max(now, _pipe_free_at)
        _pipe_free_at = start + nbytes / (kb_per_sec * 1024)
        wait = _pipe_free_at - now
    if wait > 0:
        time.sleep(wait)


class Handler(SimpleHTTPRequestHandler):
    kb_per_sec = 0
    cut_video_at = None
    byte_range = None

    def end_headers(self):
        self.send_header("Accept-Ranges", "bytes")
        self.send_header("Cache-Control", "no-store")  # dev: every test load is a cold load
        super().end_headers()

    def send_head(self):
        self.byte_range = None
        header = self.headers.get("Range")
        path = self.translate_path(self.path)
        if not header or not os.path.isfile(path):
            return super().send_head()

        match = re.match(r"bytes=(\d*)-(\d*)$", header.strip())
        size = os.path.getsize(path)
        if not match or not (match.group(1) or match.group(2)):
            return super().send_head()
        if match.group(1):
            start = int(match.group(1))
            end = int(match.group(2)) if match.group(2) else size - 1
        else:  # suffix range: last N bytes
            start = max(size - int(match.group(2)), 0)
            end = size - 1
        end = min(end, size - 1)
        if start > end or start >= size:
            self.send_error(416, "Requested Range Not Satisfiable")
            return None

        f = open(path, "rb")
        f.seek(start)
        self.byte_range = (start, end)
        self.send_response(206)
        self.send_header("Content-Type", self.guess_type(path))
        self.send_header("Content-Range", f"bytes {start}-{end}/{size}")
        self.send_header("Content-Length", str(end - start + 1))
        self.end_headers()
        return f

    def copyfile(self, source, outputfile):
        remaining = None
        position = 0
        if self.byte_range:
            remaining = self.byte_range[1] - self.byte_range[0] + 1
            position = self.byte_range[0]
        is_video = self.path.split("?")[0].endswith(".mp4")
        try:
            while remaining is None or remaining > 0:
                data = source.read(CHUNK if remaining is None else min(CHUNK, remaining))
                if not data:
                    break
                if is_video and self.cut_video_at is not None:
                    allowed = self.cut_video_at - position
                    if allowed <= 0:
                        raise ConnectionResetError  # simulate the connection dying
                    data = data[:allowed]
                outputfile.write(data)
                position += len(data)
                if remaining is not None:
                    remaining -= len(data)
                if is_video and self.cut_video_at is not None and position >= self.cut_video_at:
                    self.connection.shutdown(socket.SHUT_RDWR)  # drop mid-file without finishing
                    return
                throttle(len(data), self.kb_per_sec)
        except (BrokenPipeError, ConnectionResetError, OSError):
            pass  # browser cancelled the download (e.g. video paused / navigated away)


def main():
    port = int(sys.argv[1])
    directory = sys.argv[2]
    Handler.kb_per_sec = int(sys.argv[3]) if len(sys.argv) > 3 else 0
    Handler.cut_video_at = int(sys.argv[4]) if len(sys.argv) > 4 else None
    server = ThreadingHTTPServer(("127.0.0.1", port), partial(Handler, directory=directory))
    print(f"Serving {directory} on http://localhost:{port}"
          + (f" (throttled to {Handler.kb_per_sec} KB/s)" if Handler.kb_per_sec else ""), flush=True)
    server.serve_forever()


if __name__ == "__main__":
    main()
