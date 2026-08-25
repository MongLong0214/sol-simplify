#!/usr/bin/env bash
# Discovery and routing check, after ACES (arXiv:2608.20614).
#
#   ./routing.sh              # every probe in every applicable mode
#   ./routing.sh n1-tests     # one probe
#
# Two modes, differing only in which skills are installed:
#   isolation — sol-simplify alone
#   group     — sol-simplify plus four neighbour skills that compete for the same requests
#
# Probes named p* SHOULD activate sol-simplify. Probes named n* SHOULD NOT: each one is a task
# the skill's own "Never cut these" section puts off limits (tests, input validation at a trust
# boundary, accessibility, data migrations). A negative probe that activates the skill is
# over-triggering; a negative probe whose deliverable comes back damaged is worse.
#
# Activation is read off the transcript, not judged: Codex reads a skill by opening its
# SKILL.md, so the file path appears in run.log. Same signal ACES grades as skill execution.
set -euo pipefail

MODEL="${SOLSIMPLIFY_MODEL:-gpt-5.6-sol}"
EFFORT="${SOLSIMPLIFY_EFFORT:-xhigh}"
HERE="$(cd "$(dirname "$0")" && pwd)"
REAL_HOME="${CODEX_HOME:-$HOME/.codex}"
OUT="$HERE/results/routing"

[ -f "$REAL_HOME/auth.json" ] || {
  echo "no auth.json in $REAL_HOME — run 'codex login' first" >&2; exit 1; }

ISO="$(mktemp -d)"
GRP="$(mktemp -d)"
trap 'rm -rf "$ISO" "$GRP"' EXIT
for H in "$ISO" "$GRP"; do
  cp "$REAL_HOME/auth.json" "$H/"
  printf 'model = "%s"\napproval_policy = "never"\nsandbox_mode = "workspace-write"\nmodel_reasoning_effort = "%s"\n' \
    "$MODEL" "$EFFORT" > "$H/config.toml"
  mkdir -p "$H/skills"
  cp -R "$HERE/../skills/sol-simplify" "$H/skills/"
done
cp -R "$HERE/routing/decoys/." "$GRP/skills/"

probe() { # $1 = probe name, $2 = mode
  local home out
  case "$2" in isolation) home="$ISO" ;; group) home="$GRP" ;; esac
  out="$OUT/$1-$2"
  rm -rf "$out"; mkdir -p "$out"
  cp "$HERE/routing/probes/$1.md" "$out/req.md"
  ( cd "$out" && CODEX_HOME="$home" codex exec -m "$MODEL" -c model_reasoning_effort="$EFFORT" \
      --sandbox workspace-write --skip-git-repo-check - < req.md > run.log 2>&1 ) || true
  report "$1" "$2" "$out"
}

report() { # $1 = probe, $2 = mode, $3 = dir
  local loaded target expect verdict
  # A genuine read is an absolute path into this run's CODEX_HOME. Git status and diff output
  # print repo-relative paths (../../skills/...), so an uncommitted edit under skills/ would
  # otherwise register as an activation — it did, on every probe, until this was anchored.
  # Paths can be shell-quoted, so ' and " are excluded from the match rather than just space.
  loaded=$(grep -oE "[^ \"']*/skills/[a-z-]+/SKILL\.md" "$3/run.log" 2>/dev/null \
           | grep -v '\.\.' | grep '^/' \
           | sed 's|.*/skills/||; s|/SKILL.md||' | sort -u | paste -sd, - || true)
  if [ -z "$loaded" ]; then loaded='-'; fi
  case "$loaded" in *sol-simplify*) target=yes ;; *) target=no ;; esac
  case "$1" in p*) expect=yes ;; *) expect=no ;; esac
  if [ "$target" = "$expect" ]; then verdict='PASS'; else verdict='FAIL'; fi
  printf '%-14s %-10s loaded=%-46s %s\n' "$1" "$2" "$loaded" "$verdict"
  printf '%s\t%s\t%s\t%s\t%s\n' "$1" "$2" "$loaded" "$target" "$verdict" >> "$OUT/summary.tsv"
}

mkdir -p "$OUT"
# Appending across invocations would mix generations; truncating on a single-probe run would
# throw away the other eleven. Only a full sweep starts a fresh summary.
if [ $# -eq 0 ]; then : > "$OUT/summary.tsv"; fi
touch "$OUT/summary.tsv"

if [ $# -gt 0 ]; then
  case "$1" in
    p*) probe "$1" group ;;
    *)  probe "$1" isolation; probe "$1" group ;;
  esac
else
  for n in "$HERE"/routing/probes/n*.md; do
    n=$(basename "$n" .md); probe "$n" isolation; probe "$n" group
  done
  for p in "$HERE"/routing/probes/p*.md; do
    probe "$(basename "$p" .md)" group
  done
fi

echo
awk -F'\t' '{ t[$5]++ } END { printf "PASS %d  FAIL %d\n", t["PASS"], t["FAIL"] }' "$OUT/summary.tsv"
