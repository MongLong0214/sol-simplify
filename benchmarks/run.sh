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
# Re-runs write to results/<prompt>-<arm>-<tag> so they never overwrite a committed result:
# SCORES.md cites line numbers inside those files, and clobbering them silently breaks
# every citation.  SOLSIMPLIFY_TAG=symmetric ./run.sh 03-loop
REAL_HOME="${CODEX_HOME:-$HOME/.codex}"
TAG="${SOLSIMPLIFY_TAG:-}"

# Every arm runs against a throwaway CODEX_HOME built from your credentials alone, so the
# control base and the skill base differ by exactly one file: the skill. Using your real
# ~/.codex for the skill arm would let your other skills, plugins, and AGENTS.md into the
# result and make the effect unattributable. Moving ~/.codex/skills/sol-simplify aside is
# also NOT enough for control arms: Codex's shared app-server daemon caches discovered
# skills, and a parked skill can still reach the model — silently.
CLEAN="$(mktemp -d)"
ON_HOME="$(mktemp -d)"
trap 'rm -rf "$CLEAN" "$ON_HOME"' EXIT
[ -f "$REAL_HOME/auth.json" ] || {
  echo "no auth.json in $REAL_HOME — run 'codex login' first" >&2; exit 1; }
for H in "$CLEAN" "$ON_HOME"; do
  cp "$REAL_HOME/auth.json" "$H/"
  printf 'model = "%s"\napproval_policy = "never"\nsandbox_mode = "workspace-write"\nmodel_reasoning_effort = "%s"\n' \
    "$MODEL" "$EFFORT" > "$H/config.toml"
done
# The only difference between the control base and the skill base is the skill.
mkdir -p "$ON_HOME/skills"
cp -R "$HERE/../skills/sol-simplify" "$ON_HOME/skills/"

run() { # $1 = arm, $2 = codex home, $3 = extra instruction (optional)
  local out="$HERE/results/$P-$1${TAG:+-$TAG}"
  rm -rf "$out"; mkdir -p "$out"
  if [ -d "$HERE/seeds/$P" ]; then cp -R "$HERE/seeds/$P/." "$out/"; fi
  cp "$HERE/prompts/$P.md" "$out/req.md"
  if [ -n "${3:-}" ]; then printf '\n%s\n' "$3" >> "$out/req.md"; fi
  ( cd "$out" && CODEX_HOME="$2" codex exec -m "$MODEL" -c model_reasoning_effort="$EFFORT" \
      --sandbox workspace-write --skip-git-repo-check - < req.md > run.log 2>&1 )
  # Count the produced document the way SCORES.md records it: wc -l of what the agent wrote.
  # req.md is the prompt and AGENTS.md is seeded, so neither is output — folding them in
  # inflates the number and makes a reproduction disagree with the committed table.
  local n; n=$(find "$out" -maxdepth 1 -type f -name '*.md' \
    ! -name req.md ! -name AGENTS.md -exec cat {} + 2>/dev/null | wc -l | tr -d ' ')
  local leak; leak=$(grep -rl 'sol-simplify:' "$out" 2>/dev/null | grep -cv req.md || true)
  printf '%-11s %5s lines' "$1" "$n"
  if [ "$1" != on ] && [ "$leak" != 0 ]; then
    printf '   ⚠ CONTAMINATED — skill reached a control arm'
  fi
  echo
}

ONELINE_KO='불필요한 절차·문서·게이트를 만들지 마라. 요청한 것만 만들어라.'
ONELINE_EN='Make the smallest change that fully solves the task. Do not add abstractions, fallbacks, defensive guards, refactors, or features unless they are strictly required.'

run off        "$CLEAN"
run oneline    "$CLEAN" "$ONELINE_KO"
run oneline-en "$CLEAN" "$ONELINE_EN"
run on         "$ON_HOME"
