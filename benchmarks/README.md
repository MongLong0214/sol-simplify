# Benchmark

Same prompt, same model, four arms (see [`prompts/_arms.md`](prompts/_arms.md)): nothing, two
one-line instructions, and the full skill. Built so the skill can lose.

## Reproduce

```bash
./run.sh 01-prd        # PRD for one small feature — document inflation
./run.sh 02-process    # dev process for a 0-line solo project — process invention
./run.sh 03-loop       # a repo already trapped in its own gates — loop escape
./run.sh 04-guardrail  # process is legitimately required — the skill must NOT cut it
./run.sh 05-incident   # one bad merge — reactive rule inflation vs a regression test
```

`04-guardrail` and `05-incident` test the skill's failure modes, not the model's. A
ceremony-cutting skill that strips a PCI-DSS release checklist a 12-person payments team
explicitly asked for is broken, and `04-guardrail` exists to catch that. `05-incident` seeds a
small repo (see `seeds/`) and measures what the agent reaches for after one bad merge: a
regression test for the actual bug, or new standing rules bolted onto AGENTS.md.

`03-loop` is the discriminating one. It describes a repository whose verification machinery has
outgrown its product and whose gate has stopped passing anything, then asks for a plan. An
instruction to "make the smallest change" points straight at repairing the pin-reconciliation
script — the smallest change that keeps the loop running. Escaping requires naming the
machinery as the problem and deleting it, which is what stages 3 and 4 of the skill are for.

Requires an authenticated `codex` CLI. Override the model with `SOLSIMPLIFY_MODEL` and the
reasoning effort with `SOLSIMPLIFY_EFFORT`. Outputs land in `results/<prompt>-<arm>/`.

Control arms run against a throwaway `CODEX_HOME` containing only your credentials. Moving
`~/.codex/skills/sol-simplify` aside is **not** sufficient: Codex's shared app-server daemon caches
discovered skills, and a parked skill still reached the model in one of our runs — the output
carried `sol-simplify:` markers that a bare one-line prompt could never produce. The contamination is
silent, so `run.sh` greps every control arm for skill artifacts and prints a warning if any
appear. If you reproduce this benchmark by hand, check for that leak before believing a control.

## What is measured

**Ceremony count** is the headline, scored 0–10 against the fixed rubric in
[`RUBRIC.md`](RUBRIC.md) — one point per category invented without being asked, categories not
instances, requested items never scored, every point cited to a line in the committed output:

Line count is reported alongside, but it is a **crude proxy and can mislead**. A run that spends
its extra lines specifying four API endpoints is longer and *better*; a run that spends them on
a rollout plan is longer and worse. One observed pair: 116 lines vs 164 lines, both with a
ceremony count of zero — the longer one simply wrote the API contract out in full. Judge the
ceremony column, then read the outputs.

**Not measured, deliberately:** correctness. A shorter document is not automatically a better
one. Outputs are committed in `results/` so the reduction can be judged rather than taken on
faith.

## Honesty

- **n=1 per cell.** These are single runs, not medians. Treat them as demonstrations of a
  reproducible effect, not as statistics. Multi-run medians are the obvious next step.
- **One model.** Measured on `gpt-5.6-sol` at `xhigh` effort — the configuration the skill was
  written for. It is untested elsewhere, and the failure mode it targets may be weaker or
  absent on other models.
- **No per-repo savings claims.** The lean version of your project was never written, so there
  is no baseline to subtract from. The only real numbers are the ones in `results/`.
