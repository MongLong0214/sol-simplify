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

```bash
./routing.sh           # does the agent reach for the skill when it should, and only then?
```

`run.sh` measures what the skill does once loaded. `routing.sh` measures whether it gets loaded
at all — the axis ACES ([arXiv:2608.20614](https://arxiv.org/abs/2608.20614)) reports that no
document scan can observe. It runs eight probes: four the skill must fire on, and four it must
stay out of because its own *Never cut these* section puts them off limits (unit tests, fixing
an injection, accessibility, a data migration). Each runs twice — once with the skill alone
(`isolation`), once with four competing neighbour skills installed alongside it (`group`, the
realistic install). Activation is read off the transcript rather than judged: Codex opens a
skill by reading its `SKILL.md`, so the path lands in `run.log`. Results and the two known
two sweeps — before and after the
description fix the first sweep prompted — are in
[`results/SCORES.md`](results/SCORES.md#discovery-and-routing), with raw outputs under
`results/routing/` and `results/routing-v1-predesc/`.

Requires an authenticated `codex` CLI. Override the model with `SOLSIMPLIFY_MODEL` and the
reasoning effort with `SOLSIMPLIFY_EFFORT`. Outputs land in `results/<prompt>-<arm>/` and
`results/routing/<probe>-<mode>/`.

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

## Known limitations of the committed results

Read these before quoting any number.

- **The committed runs were not environmentally symmetric.** Control arms ran in a throwaway
  `CODEX_HOME`; the skill arms ran in the author's real `~/.codex`, which also held other
  skills and settings. `run.sh` now builds *both* bases from credentials alone and adds only
  the skill to the treatment base, so a fresh reproduction is symmetric — but the numbers in
  `results/` predate that fix and cannot fully attribute their effect to this skill alone.
  A symmetric spot check of `02-process` is recorded in `results/`.
- **Single scorer, no blinding.** One person scored every run against the rubric, knowing
  which arm produced it. Re-scoring by someone else is the obvious next step; every score
  cites a line so disagreement can be specific.
- **Loop-commit counts are a subject-line heuristic.** `measure.sh` labels them *candidate*
  loop commits for that reason. Confirm with diffs before saying a commit shipped nothing.
- **Only `05-incident` preserves a full work tree** (source, tests, workflow, `run.log`). The
  document scenarios preserve the produced document alone: they were run before `run.sh`
  captured `run.log`, so their transcripts are gone and cannot be reconstructed. Re-running
  any of them with the current `run.sh` writes `run.log` alongside the document.

## Honesty

- **n=1–3 per cell.** `01-prd` and `02-process` have three runs per arm and report medians;
  `03-loop` has one; `04-guardrail` and `05-incident` have one or two, and every run is listed
  rather than collapsed. Treat all of it as a demonstration of a reproducible effect, not as
  statistics — the sample is far too small for a confidence interval, and quoting one here
  would be exactly the invented precision this project scores against.
- **One model.** Measured on `gpt-5.6-sol` at `xhigh` effort — the configuration the skill was
  written for. It is untested elsewhere, and the failure mode it targets may be weaker or
  absent on other models.
- **No per-repo savings claims.** The lean version of your project was never written, so there
  is no baseline to subtract from. The only real numbers are the ones in `results/`.
