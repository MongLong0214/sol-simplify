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
| on #2 | 138 | **4/4** | **0** | used the skill's own marker to *protect* the requested process: "sol-simplify: 독립 승인과 증적은 PCI DSS 6.5.1…을 위해 존재한다. PCI 범위 또는 감사 의무가 사라지고 변경 위험을 재평가한 경우에만 축소한다." |

The skill did not cut requested process — it kept all of it, dropped only the inventions, and
annotated why the kept process exists.

## 05-incident — one bad merge; what does the agent reach for?

Seeded repo (see `../seeds/05-incident/`): a null-return bug, already reverted, plus a
3-line AGENTS.md. C10 = reactive standing rules manufactured from the single incident.

| run | root fix + regression test | CI enforcing the existing rule | AGENTS.md | PR template invented | C10 |
|---|---|---|---|---|--:|
| off #1 | ✓ (tests pass) | ✓ | unchanged | **yes — with 배포 위험·모니터링·롤백 기입 의무** | **1** |
| off #2 | ✓ | ✓ | **grew — new standing rule added** | **yes** | **2** |
| on #1 | ✓ (red→green verified: "수정 전 회귀 테스트: 실패, `null !== []`") | ✓ | unchanged | no | **0** |
| on #2 | ✓ | ✓ | unchanged | no | **0** |

Every arm fixed the bug and added the regression test — that is product work and the skill
never touches it. The baselines *also* manufactured standing paperwork from one incident,
2 runs out of 2. The skill arms did not, 2 out of 2.

## Summary

| experiment | off (median) | oneline (median) | on (median) |
|---|--:|--:|--:|
| 01-prd ceremony | 5 | — | **0** |
| 02-process ceremony | 5 | 1 | **0** |
| 02-process lines | 412 | 130 | **119** |
| 03-loop verdict | rebuild+feed | shrink | **dismantle** |
| 04-guardrail kept / ceremony | 4/4 · 2 | — | **4/4 · 0** |
| 05-incident C10 | 1.5 | — | **0** |

Ceremony across every skill-on run in every experiment: **0 for 12** (excluding 04's kept
items, which are requested and therefore never score). Skill auto-pickup, never being named
in a prompt: **12/12**.

## Where the one-line prompt is enough — and where it is not

The control sentence ("Make the smallest change…") earns most of the *length* reduction on
document tasks and is a real, free improvement. What it did not do in these runs: it wrote a
gate-waiver procedure (02 #1), kept a 14,000-line authorization machine standing (03), and
was not tested against guardrail/incident scenarios where the failure is direction, not size.
The skill's value concentrates in stages 3–4: noticing the loop, deleting rather than
excusing, and refusing reactive rule growth.
