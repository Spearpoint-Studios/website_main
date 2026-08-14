#!/usr/bin/env bash
# Switch back to the previous release. For use under pressure, so it takes
# no arguments and explains itself.
set -euo pipefail

ROOT=/var/www/spearpoint
CURRENT=$(readlink -f "$ROOT/current")
PREVIOUS=$(ls -1dt "$ROOT"/releases/*/ | grep -v "^$CURRENT/$" | head -1 || true)

if [ -z "$PREVIOUS" ]; then
  echo "no previous release to roll back to" >&2
  exit 1
fi

echo "rolling back from $(basename "$CURRENT") to $(basename "$PREVIOUS")"
ln -sfn "${PREVIOUS%/}" "$ROOT/current"
sudo /usr/bin/systemctl restart spearpoint-web
echo "done"
