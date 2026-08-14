#!/usr/bin/env bash
# Build a new release and switch to it only if the build succeeds.
# A failing build leaves the running site completely untouched.
set -euo pipefail

ROOT=/var/www/spearpoint
REPO="$ROOT/repo"
RELEASES="$ROOT/releases"
KEEP=3

cd "$REPO"
git fetch --quiet origin main
SHA=$(git rev-parse --short origin/main)
TARGET="$RELEASES/$SHA"

if [ "$(readlink -f "$ROOT/current" || true)" = "$(readlink -f "$TARGET" || true)" ]; then
  echo "up to date at $SHA"
  exit 0
fi

echo "building $SHA"
rm -rf "$TARGET"
mkdir -p "$TARGET"
git archive origin/main | tar -x -C "$TARGET"
ln -sfn "$ROOT/shared/.env" "$TARGET/.env.production.local"

cd "$TARGET"

# --- Load-bearing safety guards ---------------------------------------------
# These two "if ! ...; then rm -rf; exit 1; fi" blocks are the entire safety
# property of this script: the "ln -sfn ... current" line below, which
# repoints the live symlink, is unreachable unless BOTH npm ci and
# npm run build exited 0. Do not refactor this into "run both, then check
# after", and do not drop either guard to simplify the script -- that is
# exactly the change that would let a broken commit take the site down.
if ! npm ci --no-audit --no-fund; then
  echo "npm ci failed, discarding $SHA" >&2
  rm -rf "$TARGET"
  exit 1
fi

if ! npm run build; then
  echo "build failed, discarding $SHA" >&2
  rm -rf "$TARGET"
  exit 1
fi
# --- End load-bearing safety guards ------------------------------------------

ln -sfn "$TARGET" "$ROOT/current"
sudo /usr/bin/systemctl restart spearpoint-web
echo "deployed $SHA"

# Prune old releases, but never delete the one "current" points at.
#
# The naive rule ("keep the newest three by mtime") is unsafe here: after a
# rollback, "current" points at an OLDER release than whatever the timer
# builds next. Two subsequent successful deploys then push that live,
# rolled-back-to release down to fourth-newest, and a bare
# "tail -n +4 | xargs rm -rf" would delete the directory the running
# service is serving out of -- out from under it, while it is still live.
#
# So: resolve what "current" actually points at first, exclude that path
# from deletion unconditionally regardless of its age, and only then keep
# the newest KEEP of whatever remains. Written as explicit loops rather than
# a clever pipeline, on purpose -- this runs unattended every minute and
# needs to stay easy to reason about.
cd "$RELEASES"
LIVE=$(readlink -f "$ROOT/current" || true)

# All release directories, newest first, trailing slash stripped.
mapfile -t all_releases < <(ls -1dt */ 2>/dev/null | sed 's#/$##')

# Every release except the live one, still newest first.
candidates=()
for dir in "${all_releases[@]}"; do
  if [ "$(readlink -f "$RELEASES/$dir" || true)" != "$LIVE" ]; then
    candidates+=("$dir")
  fi
done

# Keep the newest KEEP of the non-live releases; delete anything older.
# The live release was excluded above, so it can never appear in this list.
if [ "${#candidates[@]}" -gt "$KEEP" ]; then
  for dir in "${candidates[@]:$KEEP}"; do
    echo "pruning $dir"
    rm -rf "${RELEASES:?}/$dir"
  done
fi
