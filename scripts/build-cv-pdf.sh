#!/usr/bin/env bash
# Regenerate src/public/resume.pdf from the live /cv page.
# Run while `docker compose up` is up so http://localhost:3002/cv is reachable.
#
# Usage: ./scripts/build-cv-pdf.sh

set -euo pipefail

URL="${CV_URL:-http://localhost:3002/cv}"
OUT="src/public/resume.pdf"

CHROME=$(command -v google-chrome-stable || command -v google-chrome || command -v chromium || command -v chromium-browser || true)

if [[ -z "$CHROME" ]]; then
  echo "ERR: chrome/chromium not found on PATH" >&2
  exit 1
fi

"$CHROME" \
  --headless=new \
  --disable-gpu \
  --no-sandbox \
  --no-pdf-header-footer \
  --virtual-time-budget=5000 \
  --print-to-pdf="$OUT" \
  "$URL"

echo "✓ wrote $OUT"
