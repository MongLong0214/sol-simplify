#!/usr/bin/env bash
# Reproduce the sol-simplify benchmark: same prompt, four arms.
#
#   ./run.sh 01-prd
#   ./run.sh 02-process
#   ./run.sh 03-loop | 04-guardrail | 05-incident
#
# Requires an authenticated `codex` CLI. Outputs land in results/<prompt>-<arm>/.
set -euo pipefail

P="${1:?usage: run.sh <prompt-name>}"
MODEL="${SOLSIMPLIFY_MODEL:-gpt-5.6-sol}"
EFFORT="${SOLSIMPLIFY_EFFORT:-xhigh}"
HERE="$(cd "$(dirname "$0")" && pwd)"
REAL_HOME="${CODEX_HOME:-$HOME/.codex}"

# Arms that must not see the skill run against a throwaway CODEX_HOME holding only
# credentials. Moving ~/.codex/skills/sol-simplify aside is NOT enough: Codex's shared
# app-server daemon caches discovered skills, and a parked skill can still reach the
# model. That contamination is silent — the run looks clean and is not.
CLEAN="$(mktemp -d)"
trap 'rm -rf "$CLEAN"' EXIT
cp "$REAL_HOME/auth.json" "$CLEAN/" 2>/dev/null || {
  echo "no auth.json in $REAL_HOME — run 'codex login' first" >&2; exit 1; }
printf 'model = "%s"\napproval_policy = "never"\nsandbox_mode = "workspace-write"\nmodel_reasoning_effort = "%s"\n' \
  "$MODEL" "$EFFORT" > "$CLEAN/config.toml"

run() { # $1 = arm, $2 = codex home, $3 = extra instruction (optional)
  local out="$HERE/results/$P-$1"
  mkdir -p "$out"
  [ -d "$HERE/seeds/$P" ] && cp -R "$HERE/seeds/$P/." "$out/"
  cp "$HERE/prompts/$P.md" "$out/req.md"
  [ -n "${3:-}" ] && printf '\n%s\n' "$3" >> "$out/req.md"
  ( cd "$out" && CODEX_HOME="$2" codex exec -m "$MODEL" -c model_reasoning_effort="$EFFORT" \
      --sandbox workspace-write --skip-git-repo-check - < req.md > run.log 2>&1 )
  local n; n=$(cat "$out"/*.md 2>/dev/null | grep -vc '^$' || echo 0)
  local leak; leak=$(grep -rl 'sol-simplify:' "$out" 2>/dev/null | grep -v req.md | wc -l | tr -d ' ')
  printf '%-11s %5s lines' "$1" "$n"
  [ "$1" != on ] && [ "$leak" != 0 ] && printf '   ⚠ CONTAMINATED — skill reached a control arm'
  echo
}

ONELINE_KO='불필요한 절차·문서·게이트를 만들지 마라. 요청한 것만 만들어라.'
ONELINE_EN='Make the smallest change that fully solves the task. Do not add abstractions, fallbacks, defensive guards, refactors, or features unless they are strictly required.'

run off        "$CLEAN"
run oneline    "$CLEAN" "$ONELINE_KO"
run oneline-en "$CLEAN" "$ONELINE_EN"
run on         "$REAL_HOME"
