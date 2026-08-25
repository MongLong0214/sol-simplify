<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg?v=3">
    <img src="assets/logo.svg?v=3" width="480" alt="sol-simplify — scissors snipping, beside the wordmark">
  </picture>
</p>

<p align="center">
  <em>It built the gate. Then the gate stopped letting it work.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
  <img src="https://img.shields.io/badge/install-one%20file-111111?style=flat-square" alt="One file">
  <img src="https://img.shields.io/badge/works%20with-Codex%20%C2%B7%20Claude%20Code%20%C2%B7%20Cursor-111111?style=flat-square" alt="Works with">
  <img src="https://img.shields.io/badge/measured%20on-gpt--5.6--sol-111111?style=flat-square" alt="Measured on gpt-5.6-sol">
</p>

<p align="center">
  <strong>ceremony scored 0 in 13 of 14 skill runs &middot; 437 invented lines &rarr; 58 &middot; one markdown file</strong><br>
  <sub><a href="benchmarks/results/SCORES.md">scores</a> &middot; <a href="benchmarks/">reproduce it</a></sub>
</p>

<p align="center">
  <sub><strong>English</strong> &middot; <a href="README.ko.md">한국어</a></sub>
</p>

---

Coding agents do not only over-engineer code. They build **bureaucracy around their own work** — gates, registries, traceability matrices, validators for the validators — and then spend the project maintaining it. Eventually the machinery outgrows the product and starts refusing to let work through.

sol-simplify is one markdown file that stops it. No plugin, no hooks, no install script.

## Install

Pick whichever fits your agent. Then just work — the agent loads the skill on its own when a task calls for it. Nothing to invoke.

**Codex** — as a plugin, versioned and updatable:

```bash
codex plugin marketplace add MongLong0214/sol-simplify
codex plugin add sol-simplify@sol-simplify
```

**Claude Code:**

```
/plugin marketplace add MongLong0214/sol-simplify
/plugin install sol-simplify@sol-simplify
```

**Or just copy the file** — into `~/.codex/skills/`, `~/.claude/skills/`, or any tool's rules directory (Cursor, Windsurf, Cline, Copilot). It is plain markdown with standard frontmatter.

```bash
mkdir -p ~/.codex/skills/sol-simplify
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify/SKILL.md \
  -o ~/.codex/skills/sol-simplify/SKILL.md
```

To uninstall, delete the file.

## What it does

Asked to design a development process for a project with **no code yet and one maintainer**:

**Without** — 437 lines, 35 sections: risk-based quality gates, six test tiers, a CI operating model, a release-candidate checklist, a defect taxonomy, project health metrics, and a section on maintaining the document itself.

**With sol-simplify** — 58 lines, 6 sections. And it says why:

> No ceremonial self-approval PRs when working alone.
>
> No new documents or global rules because of a single mistake.
>
> When a check fails for reasons unrelated to product behavior, fix or delete the check
> instead of building an exception procedure around it.

The skill was never mentioned in the prompt. Codex found it and applied it on its own.

Process it decides to keep, it marks with a removal condition — so it can be audited later instead of becoming permanent:

```
sol-simplify: <why this exists>, remove when <condition>
```

## What it never cuts

Correctness. Tests that exercise real behavior. Input validation at trust boundaries. Error handling that prevents data loss. Security. Accessibility. Data migrations. Anything you explicitly asked for.

Restraint applies to process the agent invented, never to the product's real obligations. On the scenario where a payments team facing a PCI-DSS audit explicitly asks for a checklist, approval flow, rollback procedure, and audit records, the skill kept all four — every run, mapped to real PCI DSS v4.0.1 controls.

## Audit a repo that already has the disease

A second skill diagnoses an existing repository instead of preventing a new one. Install it the same way, then say *"audit this repo for ceremony"*.

```bash
mkdir -p ~/.codex/skills/sol-simplify-audit
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify-audit/SKILL.md \
  -o ~/.codex/skills/sol-simplify-audit/SKILL.md
```

It measures the machinery-to-product ratio, finds maintenance commits that shipped nothing, ranks what to delete, and reports only — it changes no files.

## Why this exists

<p align="center">
  <img src="assets/hero.svg?v=3" width="900" alt="Line chart from the audited repository's git history: the verification-machinery line leads the product line for all 20 days, reaching 13,090 lines by day 6 while the product has 3,561; a day-17 marker notes the agent's own rule refusing all work; final values are machinery 20,280 lines, product 17,964.">
</p>

Measured across the full git history of one repository an agent built over 20 days: **20,280 lines of verification machinery against 17,964 lines of product**, 33% of commits maintaining the machinery, and on day 17 the agent's own rule blocked all work — in its own words:

```
docs: say where acceptance is decided, because the rule as written refuses all work
```

Every individual file there is defensible. Code-level advice — *use the stdlib, keep the diff small* — would not have prevented any of it, because the failure is not in the code.

```
1  Pre-emptive governance   gates, ADRs, traceability, registries — before any product exists
2  Check proliferation      every artifact gets a validator; every validator a contract test
3  Self-amplification       pins break on every merge → re-sync commits → repeat
4  Self-refusal             the process the agent authored refuses to let the agent work
```

Stages 3 and 4 are what nothing else addresses, and the reason a one-line prompt is not enough.

## Numbers

Five scenarios, four arms (nothing / two one-line instructions / the skill), every score cited to the line it was found on, every raw output committed.

| scenario | off | one-line prompt | **sol-simplify** |
|---|---|---|---|
| **01-prd** — PRD for one bookmark button | ceremony 4–5 | ceremony 0 | **ceremony 0** |
| **02-process** — dev process, 0-line solo project | ceremony 5–6 | ceremony 1–2 | **ceremony 0** |
| **03-loop** — repo trapped in its own gates | **rebuild + feed** | **shrink** | **dismantle** |
| **04-guardrail** — process legitimately required | kept 4/4 · ceremony 2 | kept 4/4 · ceremony 2 | **kept 4/4 · ceremony 0** |
| **05-incident** — one bad merge | invents PR templates, grows AGENTS.md | regression test, nothing enforcing it | **regression test + CI, rules untouched** |

The skill is picked up automatically on tasks it should fire on and stays out of tasks it should not, with competing skills installed alongside it. Full per-run citations, the scoring rubric, discovery and routing results, and the known limits: [`benchmarks/`](benchmarks/).

## FAQ

**How is this different from code-minimalism skills like Ponytail?**
Different layer. Those ask *"can this be one line?"* about code; sol-simplify asks *"should this check exist at all?"* about process. They compose — run both if you want both.

**Will this make the agent skip tests?**
Measured: no. Every skill run on the incident scenario fixed the root cause and added the regression test. Tests that exercise behavior are in the never-cut list; if you see it cut a real one, that is a bug worth an issue.

**Does it work on other models?**
Unknown. It was written for and measured on `gpt-5.6-sol`, whose ambition tuning is what produces this failure mode. Results elsewhere are welcome.

**Why no hooks, installer, or runtime code?**
A tool against manufactured process should not manufacture process. The payload is one markdown file that agents pick up on their own; the only additions are static JSON manifests so `codex plugin add` and `/plugin install` work, and they run nothing.

## License

MIT
