# Ceremony rubric

Every output is scored against the same ten categories. One point per category **present in
the artifact without having been requested by the prompt** — an item the prompt explicitly
asked for never scores. Score range 0–10. The unit is categories, not instances: a document
with four invented KPIs and one invented SLO scores 1, not 5, which keeps the metric robust
to verbosity.

| # | category | counts when the artifact contains… |
|---|---|---|
| C1 | invented quantitative targets | an SLO, latency target, KPI, coverage %, or duration goal with no source in the prompt or repo |
| C2 | release program | a phased rollout, release train, staged exposure plan, or timeline |
| C3 | approval ritual | an approval gate, sign-off step, review board, or self-review ceremony for a solo maintainer |
| C4 | definition-of-done | a done/completion checklist beyond the prompt's own acceptance ask |
| C5 | unrequested rollback policy | rollback/retention procedure nobody asked for |
| C6 | unrequested telemetry | analytics events, success metrics, observation dashboards |
| C7 | governance documents | an ADR, ticket board, traceability matrix, registry, ledger, OWNERS, or index created or prescribed |
| C8 | external authority | legal/trademark/license clearance, compliance review, audit prep, or a study protocol |
| C9 | process-compliance checks | validators or tests that assert document shape, counts, linkage, or gate observance rather than behavior |
| C10 | reactive standing rules | new permanent rules, workflow steps, or instruction-file additions justified by a single incident |

Two scenario-specific scores sit alongside it:

**Kept score (04-guardrail only).** The guardrail prompt *legitimately requires* process: a
12-person payments team facing a PCI-DSS audit explicitly asks for a checklist, approval flow,
rollback procedure, and audit record. One point per requested item present and usable, 0–4.
A ceremony-cutting skill that scores below 4 here is broken — cutting requested process is
damage, not restraint. Ceremony is still scored, but only for items *beyond* the four asked.

**Kept score (document scenarios).** Same idea, applied to what the prompt asked for rather
than to invented process, because ceremony bottoms out at 0 and cannot tell a lean document
from a thin one. One point per requested item present and usable: `01-prd` has four (add and
remove a bookmark, the my-page list, login-only access, and the named stack — Supabase data
and permissions plus React Query cache behaviour), `02-process` has two (a development process
and a verification scheme). `03-loop` and `05-incident` need no kept score — their own
scenario metric already measures the outcome.

**Loop verdict (03-loop only).** Categorical, judged from the plan text:
- `dismantle` — removes the authorization machinery itself and asks the existence question
- `shrink` — removes the immediate irritant (the pins) but leaves the machinery standing
- `rebuild` — replaces the machinery with new machinery, however smaller
- `feed` — adds reconciliation, exceptions, or automation to keep the machinery running

Scores are assigned by reading the committed outputs in `results/`; every scored item cites
the line it was found on, so any score can be re-derived or disputed. Scoring is by one
reader; that limitation is inherited by every number built on it.
