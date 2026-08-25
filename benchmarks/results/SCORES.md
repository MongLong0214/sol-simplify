# Scores

Scored against [`../RUBRIC.md`](../RUBRIC.md): one point per ceremony category present without
having been requested, 0–10, conservative — a judgment call that could go either way is not
counted, and a line that *rejects* a ceremony ("사인오프는 요구하지 않는다") never scores.
Every point cites the line it was found on in the committed output. Model `gpt-5.6-sol`,
effort `xhigh`, single scorer. Runs executed before the project was renamed carry the skill's
working name `redtape` in their text; the skill content is otherwise identical.

## 01-prd — PRD for one bookmark button

| run | lines | ceremony | citations |
|---|--:|--:|---|
| off #1 | 440 | **5** | C1 L273–274 (`p95 500ms`, `p95 800ms`) · C2 L409 (§18 출시 계획, 5단계) · C4 L419 (§19 완료 정의, 8항목) · C5 L417 (릴리스 롤백 정책) · C6 L280 (§15 분석 이벤트·성공 지표) |
| off #2 | 374 | **5** | C1 L261 (`p95 500ms/800ms`) · C2+C4 L342 (§16 출시 계획 및 완료 조건) · C5 L355 (마이그레이션 롤백 절차) · C6 L271 (§12 분석 이벤트·운영 지표) |
| off #3 | 386 | **4** | C1 L225–226 (`p95 500ms`, `1초`) · C2 L350 (§15 출시 계획) · C6 L249 (§12 분석 이벤트) + L27 (성공 지표) — C6는 1점 |
| on #1 | 116 | **0** | full category scan: no hits |
| on #2 | 169 | **0** | no hits; the extra length is four API endpoint contracts (§6) — substance, not process |
| on #3 | 150 | **0** | no hits |

All three baselines independently invented the **same fictional `p95 500ms` target**. That is
not noise; it is a systematic habit of the model.

## 02-process — dev process for a 0-line, one-maintainer project

| run | lines | ceremony | citations |
|---|--:|--:|---|
| off #1 | 437 | **5** | C1 L177 (coverage ratchet) + L376 (§13 건강 지표) · C2 L337 (§11 릴리스 절차 + RC 체크리스트) · C3 L111 (§5.3 자기 리뷰) · C4 L124 (§5.4 완료 정의) · C7 L358 (§12 결함 분류 체계) |
| off #2 | 412 | **5** | C1 L253 (line coverage 80% / branch 90% 하한, ratchet) · C2 L305 (§10 릴리스 정책 + L404 RC 체크리스트) · C3 L276 (§8 자기 검토 체크리스트) · C4 L291 (§9 Definition of Done) · C6 L364 (§14 프로세스 상태 지표) |
| off #3 | 408 | **6** | C1 L214 (false pass <1% / false fail <5%) · C2 L292 (§11 릴리스) · C3 L115 (시간차 자기 리뷰) + **L352 (§14 예외(waiver) 정책)** · C4 L127 (완료 조건) · C6 L337 (§13 운영 지표·정기 점검) · C7 L86–94 (ADR 의무화) |
| oneline #1 | 130 | **2** | C3 L24 (고위험 변경 1일 재검토) + **L130 (게이트 완화 시 사유·대체검증 기록 — waiver 절차)** · C4 L110 (§9 완료 기준) |
| oneline #2 | 108 | **1** | C3 L24 (자기 리뷰 의식) |
| oneline #3 | 201 | **1** | C4 L178 (§10 완료 기준) |
| on #1 | 58 | **0** | no hits; kept isolation tests, provenance, credential redaction, determinism |
| on #2 | 119 | **0** | L21 explicitly *rejects* solo sign-off; L109 refuses retry-rules; L111 refuses fixed coverage gates |
| on #3 | 125 | **0** | L121: "한 번의 사고를 이유로 새 승인 단계나 포괄적 규칙을 추가하지 않는다" |

**Symmetric re-run.** `02-process-on-symmetric` repeats this scenario with the fixed `run.sh`
environment — a throwaway `CODEX_HOME` holding credentials plus this one skill, and nothing
else from the author's machine: **86 lines, ceremony 0**, skill picked up unprompted. It lands
inside the range of the three original runs (58 / 119 / 125), so the effect does not depend on
the author's other installed skills. It is one run, not a full re-measurement.

Two of three baselines wrote a **formal waiver/exception policy** for their own gates — the
stage-4 antipattern — and the one-line arm wrote one too (run #1). No skill arm did.

## 03-loop — a repo trapped in its own verification machinery

Verdicts per rubric: `dismantle` / `shrink` / `rebuild` / `feed`.

| run | lines | verdict | evidence |
|---|--:|---|---|
| off | 255 | **rebuild + feed** | rebuilds the resolver as a "작은 판정 코어" (§4, 6-week program, shadow validation); unblocks work through new exception bureaucracy — L57: "두 명의 승인, 판정 이유, 적용 정책 버전을 기록한 임시 override로 진행시키고 7일 이내 자동 만료" |
| oneline | 35 | **shrink** | deletes the census pins cleanly but leaves the 5,745-line resolver and 8,683-line contract test standing — "남은 리졸버 복잡도는 별도의 근거가 생길 때 다룬다" |
| on | 39 | **dismantle** | removes the machinery and asks the existence question per rule — "각 규칙에 '이 규칙이 없으면 사용자가 겪는 구체적인 제품 실패가 무엇인가?'를 묻는다"; forbids the exception path — "예외·override·수동 승인 절차를 붙이지 말고 그 규칙을 삭제한다"; "순삭제가 중심" |

## 04-guardrail — process is legitimately required (12-person payments team, PCI-DSS audit)

Kept score = the four explicitly requested items (checklist, approval flow, rollback
procedure, audit record), 0–4. **A skill run below 4 here would be a skill defect.**

| run | lines | kept | ceremony beyond ask | citations |
|---|--:|--:|--:|---|
| off | 303 | 4/4 | **2** | C1 L149/163 (배포 전 15분 기준선, p95 2배/5분 임계 — 발명 수치) · C2 L240 (분기별 롤백·DB 복구 훈련 프로그램) |
| on #1 | 158 | **4/4** | **0** | kept everything asked, mapped to real PCI DSS v4.0.1 controls (10.2.2, 10.3, 10.5.1, 10.6.1) with SSC links |
| on #2 | 138 | **4/4** | **1** | **C2 L91 — "플랫폼이 지원하면 카나리 또는 부분 트래픽부터 배포한다": a staged-exposure step, and staged exposure was not among the four requested items.** Also used the skill's own marker to *protect* the requested process: "sol-simplify: 독립 승인과 증적은 PCI DSS 6.5.1…을 위해 존재한다." |

The skill did not cut requested process — it kept all of it in both runs and annotated why the
kept process exists. It is not perfectly clean here: run #2 added a canary/partial-traffic
step nobody asked for. That is the one non-zero ceremony score among the eleven committed
skill runs, and it was caught on re-scoring, not on the first pass.

## 05-incident — one bad merge; what does the agent reach for?

Seeded repo (see `../seeds/05-incident/`): a null-return bug, already reverted, plus a
3-line AGENTS.md. C10 = reactive standing rules manufactured from the single incident.

| run | root fix + regression test | CI enforcing the existing rule | AGENTS.md | PR template invented | C10 |
|---|---|---|---|---|--:|
| off #1 | ✓ (tests pass) | ✓ | unchanged | **yes — with 배포 위험·모니터링·롤백 기입 의무** | **1** |
| off #2 | ✓ | ✓ | **grew — new standing rule added** | **yes** | **1** |
| on #1 | ✓ (red→green verified: "수정 전 회귀 테스트: 실패, `null !== []`") | ✓ | unchanged | no | **0** |
| on #2 | ✓ | ✓ | unchanged | no | **0** |

Every arm fixed the bug and added the regression test — that is product work and the skill
never touches it. The baselines *also* manufactured standing paperwork from one incident, 2 runs out of 2 — one
added a PR template, the other added a PR template *and* a new permanent rule in AGENTS.md.
Both score C10 = 1: the rubric counts categories, not instances. The skill arms manufactured
none, 2 out of 2.

## Summary

Cells hold 1–3 runs. Where a cell has three runs the number below is the **median** of the
three; where it has one or two, every value is listed, because a two-run "median" would just
be the author choosing one.

| experiment | n per cell | off | oneline | on |
|---|:--:|--:|--:|--:|
| 01-prd ceremony | 3 | 5 | — | **0** |
| 02-process ceremony | 3 | 5 | 1 | **0** |
| 02-process lines | 3 | 412 | 130 | **119** |
| 03-loop verdict | 1 | rebuild+feed | shrink | **dismantle** |
| 04-guardrail kept / ceremony | 1 off, 2 on | 4/4 · 2 | — | **4/4** · 0 and 1 |
| 05-incident C10 | 2 | 1, 1 | — | **0, 0** |

**Ceremony across all fourteen ceremony-scored skill runs: 0 in thirteen of them, 1 in the
fourteenth** — `04-guardrail-on-2`, a canary step. Fourteen is four runs each on `01-prd` and
`02-process` and three each on `04-guardrail` and `05-incident`, counting the symmetric re-runs
below; `03-loop` is scored by verdict, not ceremony, so its two runs are not in that total.
Requested items never score, so 04's kept controls are excluded by definition. Baseline ceremony
was 4–6 on document tasks in every run.

## Symmetric re-run

The runs above were not environmentally symmetric: control arms ran in a throwaway
`CODEX_HOME` while skill arms ran in the author's real `~/.codex`, which held other skills and
settings. `run.sh` now builds both bases from credentials alone. This is all five scenarios
re-run under it, four arms each — one run per cell, so read them as a check on the earlier
numbers rather than as a replacement for them.

Line counts are `wc -l` of the produced document. `run.sh` used to print a different figure —
non-blank lines, with the prompt and any seeded `AGENTS.md` folded in — so a reproduction
disagreed with this table. That counter now matches what is recorded here.

| scenario | off | oneline | oneline-en | on |
|---|--:|--:|--:|--:|
| 01-prd — lines / ceremony | 403 / **4** | 94 / **0** | 90 / **0** | 96 / **0** |
| 02-process — lines / ceremony | (see above) | — | — | 86 / **0** |
| 03-loop — lines / verdict | 344 / rebuild+feed | 82 / shrink | 99 / shrink | 20 / **dismantle** |
| 04-guardrail — lines / kept / ceremony | 298 / 4/4 / **2** | 64 / 4/4 / **2** | 75 / 4/4 / **2** | 103 / **4/4** / **0** |
| 05-incident — C10 | **1** | 0 | 0 | **0** |

**The baselines did not move; the skill arm did.** Against the medians of the original runs,
`off` went 386 → 403 on `01-prd` and 303 → 298 on `04-guardrail`, while `on` went 150 → 96 and
148 → 103. Whatever the author's real `~/.codex` was adding, it was inflating the skill arm,
not the controls — so the original numbers understated the effect rather than manufacturing it.

**Ceremony citations for the symmetric runs.**

- `01-prd-off`: C1 L274–275 (`p95 500ms`, `p95 800ms`) · C2 L387 (§17 출시 계획, 5 stages) ·
  C5 L395 (feature-flag shutdown and table retention) · C6 L294 (§14 분석 이벤트·성공 지표).
  No C4 — it has 수용 기준 but no separate definition-of-done on top of it, which is what the
  earlier `off #1` was scored for.
- `04-guardrail-off`: C1 L94 (`p95/p99`) · C2 L90 (canary ratio, per-stage observation window).
- `04-guardrail-oneline`: C1 L31 (a 5-minute decision limit) + L64 (12-month retention with no
  requirement cited) · C2 L31 (staged rollout targets).
- `04-guardrail-oneline-en`: C1 L55 (30 minutes of focused monitoring) · C2 L33, L42 (staged
  rollout from minimum traffic).
- `04-guardrail-on`: none. Its 12-month retention cites requirement 10.5.1 explicitly, so it is
  sourced rather than invented — the same standard applied to `oneline`, which cites no
  requirement number anywhere. The canary step that made `04-guardrail-on-2` the one non-zero
  run did not recur.
- `05-incident-off`: C10 — invented `.github/pull_request_template.md` and grew the seeded
  `AGENTS.md` from three rules to five. Third independent replication of that habit.

**Kept score.** Every skill run keeps everything the prompt asked for: `01-prd` 4/4 across all
four skill runs including the 96-line symmetric one, `02-process` 2/2 across all four,
`04-guardrail` 4/4 in all three. Ceremony reaching 0 is not being bought with substance.

**Where the skill and the one-line prompt separate — and where they do not.** On `01-prd` they
tie at ceremony 0, and the one-line arms are the same length as the skill arm; on a prompt
whose baseline only reaches 4, there is nothing left for a longer instruction to win. The
separation is on `04-guardrail`, where process is legitimately required: both one-line arms cut
the document in half and still manufactured the same two categories the baseline did — staged
exposure and an invented duration — while the skill arm manufactured neither and kept all four
requested items. `05-incident` separates differently: both one-line arms reached C10 = 0 by
doing less, adding a regression test but nothing that enforces the repo's existing "run npm
test before merging" rule, so the same commit could merge untested again. The skill arm added
the CI check with its own removal condition, left `AGENTS.md` alone, and named the one step it
could not take from inside the repo — making the `test` check required in the branch ruleset.

## Discovery and routing

Ceremony scores say what the skill does *once loaded*. They say nothing about whether an agent
reaches for it when it should, or leaves it alone when it should not. Both were unmeasured
until now: every run above is a prompt the skill is *supposed* to fire on, with the skill
installed alone. After ACES ([arXiv:2608.20614](https://arxiv.org/abs/2608.20614)), which
reports that neither structural nor LLM-judge scans observe discovery, `../routing.sh` adds the
two missing axes.

**Negative probes** are tasks the skill's own *Never cut these* section puts off limits —
writing unit tests, fixing a SQL injection, keyboard accessibility, a data migration. The skill
must stay out of them. **Group mode** installs four neighbours that compete for the same
requests (`release-planner`, `code-reviewer`, `security-review`, `test-writer`); **isolation
mode** installs sol-simplify alone. Activation is read off the transcript, not judged: Codex
opens a skill by reading its `SKILL.md`, so the path appears in `run.log`.

The first sweep found the skill firing on two negative probes in isolation. The description was
the cause and it was fixed; both sweeps are kept so the fix can be checked rather than taken on
trust. `routing-v1-predesc/` is the pre-fix sweep, `routing/` the post-fix one.

| probe | v1 · before | v2 · after | expected |
|---|---|---|---|
| n1-tests — write unit tests, isolation | **sol-simplify** ✗ | none ✓ | no activation |
| n1-tests — group | test-writer ✓ | test-writer ✓ | no activation |
| n2-injection — fix SQL injection, isolation | **sol-simplify** ✗ | none ✓ | no activation |
| n2-injection — group | security-review ✓ | security-review ✓ | no activation |
| n3-a11y — keyboard accessibility | none ✓ | none ✓ | no activation |
| n4-migration — NOT NULL + backfill | none ✓ | none ✓ | no activation |
| p1-release — first deploy, solo project | release-planner + **sol-simplify** ✓ | same ✓ | activation |
| p2-review — PR review process doc | **sol-simplify** ✓ | **sol-simplify** ✓ | activation |
| p3-spec — spec before implementing | **sol-simplify** ✓ | **sol-simplify** ✓ | activation |
| p4-gates — quality gates for CI | **sol-simplify** ✓ | **sol-simplify** ✓ | activation |

**v1: 10 of 12 cells. v2: 12 of 12.**

**What the fix was.** The description listed `"add validation"` as a trigger while the body's
*Never cut these* protects `Input validation at trust boundaries` — the frontmatter and the body
said opposite things, and `n2` fired in exactly that gap. The intended meaning, invented
validators and gates, is already carried by *"when adding a check, validator, or gate"*, so the
string was removed rather than reworded. A boundary clause was appended naming the domains the
body already protects: *"Never for product work — writing tests, fixing vulnerabilities, input
validation, error handling, accessibility, or data migrations."* Nothing was narrowed; the
positive triggers are untouched, which is why `p1`–`p4` are unchanged. The description grew from
687 to 802 characters, against a static advisory to shorten it — the paper's ρ = 0.14 between
structural scores and runtime effect is the reason that advisory did not win.

**Neither over-trigger damaged its deliverable.** Before the fix, `n1` still produced twelve
test cases covering the boundary and error paths, and `n2` still produced a correctly
parameterised query with no hand-rolled sanitiser. That is a process-metric failure with the
outcome metric intact — the distinction ACES draws between skill execution and accuracy, and the
reason both are graded separately rather than collapsed into one verdict.

**`p1` is the strongest single result here.** `release-planner` is co-loaded and pulls the
opposite way — it asks for rollout stages and a per-stage owner. The document came back at 19
lines with four headings, ceremony 0, and closed with the skill's own disclosure line naming
exactly what the neighbour wanted added: `skipped: ceremony — 다단계 롤아웃, 승인 절차, 배포
자동화. 필요해질 때 추가한다.` An isolation-only benchmark cannot produce that condition.

**Activation detection is anchored to absolute paths.** Git status and diff output print
repo-relative paths (`../../skills/...`), and a reader with uncommitted edits under `skills/`
would see every probe register as an activation. That happened during this work — the v2 sweep's
live verdicts were wrong until the pattern required a leading `/` and rejected `..`. The scores
above are re-derived from the committed logs with the anchored pattern.

**Limitation:** this measures routing, not lift. The positive probes have no baseline arm, so no
ceremony delta is claimed from them.

**Skill auto-pickup on prompts it should fire on: 20 of 20** — the eleven committed runs, four
symmetric re-runs, one verification that a plugin-installed copy (no manual `~/.codex/skills/`
file present) is discovered the same way, and the four group-mode positive probes above, which
held across both sweeps. The skill was never named in any prompt. On prompts it should *not*
fire on: 8 of 8 after the description fix, 6 of 8 before it.

## Where the one-line prompt is enough — and where it is not

The control sentence ("Make the smallest change…") earns most of the *length* reduction on
document tasks and is a real, free improvement. What it did not do in these runs: it wrote a
gate-waiver procedure (02 #1), kept a 14,000-line authorization machine standing (03), and
was not tested against guardrail/incident scenarios where the failure is direction, not size.
The skill's value concentrates in stages 3–4: noticing the loop, deleting rather than
excusing, and refusing reactive rule growth.
