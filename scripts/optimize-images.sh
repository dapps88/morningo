#!/bin/bash
# Resizes and converts source images into fast-loading WebP files for the site.
#
# Drop new source images (PNG or JPEG) into assets/web images/, then run this
# script. It detects each image's orientation and resizes it to the site's
# locked dimensions before converting to WebP:
#   - Landscape sources (Hero / Problem / Product, 4:3) -> 1600x1200
#   - Portrait sources (Why It Works / Social Proof cards, 4:5) -> 1080x1350
#
# Output goes to assets/web-optimized/ as <same-filename>.webp. Source files
# are never modified. Re-running is safe -- it just re-processes everything.
#
# Requires: cwebp (installed via `brew install webp`)

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
SRC_DIR="$SCRIPT_DIR/../assets/web images"
OUT_DIR="$SCRIPT_DIR/../assets/web-optimized"
QUALITY=82

if ! command -v cwebp >/dev/null 2>&1; then
  echo "cwebp not found. Install it with: brew install webp" >&2
  exit 1
fi

mkdir -p "$OUT_DIR"

shopt -s nullglob nocaseglob
files=("$SRC_DIR"/*.png "$SRC_DIR"/*.jpg "$SRC_DIR"/*.jpeg)
shopt -u nocaseglob

if [ ${#files[@]} -eq 0 ]; then
  echo "No PNG/JPEG files found in: $SRC_DIR"
  exit 0
fi

total_before=0
total_after=0

for f in "${files[@]}"; do
  name=$(basename "$f")
  base="${name%.*}"

  width=$(sips -g pixelWidth "$f" | awk '/pixelWidth/{print $2}')
  height=$(sips -g pixelHeight "$f" | awk '/pixelHeight/{print $2}')

  if [ "$width" -lt "$height" ]; then
    target_w=1080; target_h=1350; orientation="portrait 4:5"
  else
    target_w=1600; target_h=1200; orientation="landscape 4:3"
  fi

  tmp_resized="/tmp/morningo-resize-${base}.png"
  sips -z "$target_h" "$target_w" "$f" --out "$tmp_resized" >/dev/null 2>&1

  cwebp -quiet -q "$QUALITY" "$tmp_resized" -o "$OUT_DIR/${base}.webp"
  rm -f "$tmp_resized"

  before_kb=$(( $(stat -f%z "$f") / 1024 ))
  after_kb=$(( $(stat -f%z "$OUT_DIR/${base}.webp") / 1024 ))
  total_before=$((total_before + before_kb))
  total_after=$((total_after + after_kb))

  printf "%-24s %5dx%-5d %s  ->  %4dKB -> %4dKB\n" "$name" "$width" "$height" "$orientation" "$before_kb" "$after_kb"
done

echo "---"
echo "Total: ${total_before}KB -> ${total_after}KB"
echo "Output: $OUT_DIR"
