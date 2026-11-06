# v1 website (archive)

These five pages are the Morningo site as it was live from 2026-10-26 to the v2 website release: product page, waitlist ("Reserve my place") page, survey, thank-you page and privacy policy. They are kept for reference only and are NOT published (Netlify publishes `concepts/`).

They are byte-identical to the git tag `v1-website` (commit 0f81d8e). Their pictures and scripts are not in this folder, so to see the v1 website working, open a copy of that tag:

    git worktree add ../morningo-v1 v1-website
    python3 scripts/dev-server.py 8745 ../morningo-v1/concepts

The exact version that was live is also still reachable on Netlify at https://6adf4b026013fd262c2676da--morningo.netlify.app/home (its tracking only logs to the browser console on that address).
