# Design decision

Your hypothesis is directionally right: round 1 must freeze a complete semantic inventory, and round 2 must verify that inventory rather than conduct another unconstrained review.

The proposed exception is wrong, though. Round 2 cannot limit new findings to newly introduced security holes. A remediation can introduce data loss, incorrect output, fail-open behavior, or another contract violation. Any blocking defect causally introduced by the remediation diff must be reportable.

A blocker that already existed at the round-1 head but was omitted from the inventory is different: it is a `ROUND1-ESCAPE`. It blocks the merge and invalidates the claimed two-round convergence; it does not quietly become another ordinary round-2 finding.

Thus the honest guarantee is:

> At most two review rounds when round 1 is complete, the PR is within the stated envelope, required platforms/tools are available, the remediation remains a descendant of the reviewed head, and the implementer closes the inventory without unrelated changes.

Outside those conditions, the protocol detects and declares the exception rather than pretending to converge.

# 1. Diagnosis

Both of your guesses hold, with one qualification: the reviewer had a bounded file list, but not a bounded semantic inventory.

## The implementer repeatedly fixed examples, not classes

The publication-boundary sequence in PR 608 is the clearest evidence:

- Round 1 found that the “canonical public result admits and preserves raw secrets and private paths.” [rv-608-r1.md](/tmp/review-design/verdicts/rv-608-r1.md:41)
- Round 4 found the same class through `//` paths, UNC paths, and credential-bearing URLs. [rv-608-r4.md](/tmp/review-design/verdicts/rv-608-r4.md:50)
- Round 10 found it again for `/`, non-ASCII paths, and a one-character password. [rv-608-r10.md](/tmp/review-design/verdicts/rv-608-r10.md:17)

Those are not unrelated discoveries. They are one incomplete publication-boundary fix repeatedly extended with another example. The “through any door” tests also kept testing only the last doors named by the reviewer.

The same pattern appears in PR 609’s fail-closed gate:

- Round 2: missing issuance evidence defaulted to `null`, while only an explicit negative blocked. [rv-609-r2.md](/tmp/review-design/verdicts/rv-609-r2.md:21)
- Round 8: changing a declarative `official` label to false caused required evidence to stop being required, yet the derived result became official. [rv-609-r8.md](/tmp/review-design/verdicts/rv-609-r8.md:49)
- Round 10: omitted, `null`, and `undefined` boundaries all issued. [rv-609-r10.md](/tmp/review-design/verdicts/rv-609-r10.md:52)
- Round 11: missing confinement still left Process and Outcome numbers issued. [rv-609-r11.md](/tmp/review-design/verdicts/rv-609-r11.md:55)

Again, this is one class—absence is treated differently at several layers—not four independent bugs.

## The reviewer bounded files, not obligations or site families

The harness required every changed file to be read, but asked for only a list of findings and an unstructured “Could-not-refute” section. [current-review-script.sh](/tmp/review-design/current-review-script.sh:33) It never required:

- One stable item per acceptance condition.
- One status per recurring defect class.
- Every parser, builder, verifier, stored-reader, renderer, platform implementation, and error path affected by an item.
- A class-wide search after the first reproduction.
- A durable ID and closure condition that the implementer had to answer.

Consequently, reading every listed file did not exhaust the behavior graph. A renderer might be read in round 1 without its equivalence to the other renderers becoming a frozen obligation.

The late incremental mode reduced reading cost but did not create closure. It also omitted the master specification after round 1 without carrying forward a structured interpretation of it. [current-review-script.sh](/tmp/review-design/current-review-script.sh:14)

## What the two guesses miss

Four additional causes matter.

First, some fixes introduced new defects. PR 607 gives an unusually clean chain:

- Round 5 found that `identity_status` was excluded from the digest, allowing `UNTRUSTED` to become `VERIFIED` without changing identity. [rv-607-r5.md](/tmp/review-design/verdicts/rv-607-r5.md:41)
- Round 7 found that the fix added `identity_status` to the digest without changing the v1 schema, invalidating previously persisted v1 records. [rv-607-r7.md](/tmp/review-design/verdicts/rv-607-r7.md:41)

That is not fresh exploration of the original PR; it is a non-security remediation regression. Round 2 must be allowed to report it.

Second, one required property was architecturally unresolved. PR 609’s detached-descendant problem appeared in round 1 and was still explicitly accepted in round 11:

- Round 1: the “admitted double-fork blind spot” could leave a live descendant while cleanup passed. [rv-609-r1.md](/tmp/review-design/verdicts/rv-609-r1.md:35)
- Round 6: the feasibility document admitted the residual, while the issue still required leaked descendants to block issuance. [rv-609-r6.md](/tmp/review-design/verdicts/rv-609-r6.md:50)
- Round 11: the official lane “knowingly allows an undetected descendant to survive.” [rv-609-r11.md](/tmp/review-design/verdicts/rv-609-r11.md:79)

This should have been one architectural inventory item in round 1 with three possible closures: change the mechanism, withhold the lane, or change the requirement. Repeated scanner patches could not close it.

Third, tests frequently asserted names rather than discriminating behavior. In round 11, the test named “publishes no number” actually required two profile numbers to remain issued. [rv-609-r11.md](/tmp/review-design/verdicts/rv-609-r11.md:67) PR 611 shows the same acceptance gap across all three rounds: D1–D3 were first “not connected to assessment or scoring,” then “not implemented in the scoring path,” and finally “bookkeeping, not scored Process evidence.” [r1](/tmp/review-design/verdicts/rv-611-r1.md), [r2](/tmp/review-design/verdicts/rv-611-r2.md), [r3](/tmp/review-design/verdicts/rv-611-r3.md)

Fourth, unavailable evidence was described but not represented as a blocking review status. In PR 609 round 1, filesystem and real-lane tests could not run, and the authenticated runtime test was skipped to avoid quota. [rv-609-r1.md](/tmp/review-design/verdicts/rv-609-r1.md:52) Later rounds found defects precisely in those surfaces. Round 1 needed `UNVERIFIED`, which would have suspended the two-round claim.

The `KNOWN AND ALREADY ROUTED` section solved a real budget problem, but it also changed the visible finding count without fixing those defects. Routing must therefore be exact-signature suppression, not evidence of convergence.

I agree that the findings were real. The failure was recall and closure, not precision.

# 2–4. Deliverable skill, including both prompts and the implementer obligation

Proposed path: `skills/sol-simplify-review/SKILL.md`.

The two prompt blocks below are the verbatim round prompts. The skill is longer than `sol-simplify-audit` because it contains two independently executable prompts and a cross-process handoff contract. It still produces only one disposable artifact per PR.

````markdown
---
name: sol-simplify-review
description: Converges a large or high-risk merge-gate review by exhaustively inventorying the reviewed head once, then verifying only closure and remediation regressions. Use when the user explicitly asks for a two-round review, review closure, or help with repeated real findings across review rounds. Do not use for an ordinary small one-pass code review.
metadata:
  author: MongLong0214 <MongLong0214@users.noreply.github.com>

---

# sol-simplify review

Review the product once. Freeze what must be true. Verify the repair once.

A sequence of valid findings is still a failed review process when each pass selects another
surface from the same finite change. Round 1 must enumerate that surface. Round 2 must close it,
not rediscover it.

`sol-simplify: the inventory prevents repeated class-local fixes; remove it when the change is
merged or abandoned.`

## Why this is not a registry

The inventory is one reviewer-owned artifact for one PR head. It is not committed to the product
repository, updated after every merge, or used by CI to authorize work. It expires with the PR.

Every item names product behavior, a security boundary, or an explicit requirement. Tests and
reproductions decide whether it closes. There is no validator for the inventory's shape, no status
database, no approval graph, and no permanent count to keep synchronized.

The seal script protects the handoff between two processes. It does not decide whether the product
passes.

## Host contract

Round 1 needs:

- An exact base commit and head commit.
- Their diff and changed-file list.
- A checkout of the head, with permission to read changed files and directly affected code.
- Permission to run focused tests or an explicit record of which tests and platforms are unavailable.
- Any issue, specification, acceptance conditions, forbidden implementations, security model, or
  definition of done that the review is expected to enforce.
- The status of the repository's ordinary full test run, when that suite is too large for the
  reviewer to run.
- Exact descriptions of known routed defects, if any. A broad category is not an exclusion.

A diff is the minimum contract. With only a diff, the reviewer can assess language/runtime
correctness, security boundaries visible in the code, regression risk, internal consistency, and
claims made by changed tests or documentation. It cannot certify unstated product intent or
completeness. The inventory must say `basis: DIFF_ONLY`.

The two-round claim applies only when the round-1 checkout and required evidence fit the reviewing
model's context and tool budget. If relevant code, tests, platforms, or requirements cannot be
examined, round 1 is `INCOMPLETE`, not approximately complete.

## Portable defect classes

Use these as questions, not assumptions:

1. **Self-asserted authority.** Does a subject-supplied label, flag, status, expected value, or
   identity decide the claim being made about that subject?
2. **Absence as success.** Can missing, null, empty, unknown, skipped, deferred, malformed, or
   exceptional input become success or a usable default?
3. **Equivalent paths diverge.** Are parallel implementations, platforms, renderers, lifecycle
   paths, nested/top-level forms, or read/write sides governed differently?
4. **Claim stronger than test.** Would the named guarantee remain green if its subject were broken?
   Include skips, early returns, fixtures, mocks, and mutation witnesses when the project uses them.
5. **Shape mistaken for provenance.** Is syntax, a prefix, a digest-shaped string, or an identifier
   treated as proof of who produced or verified it?
6. **Private input reaches a public sink.** Can credentials, private paths, raw errors, transcripts,
   environment values, or untrusted strings reach stored, rendered, logged, or committed output?
7. **Second authority.** Is a formula, mapping, expectation, support table, policy, or grouping
   restated outside its declared authority?
8. **Stored artifact authorizes itself.** Can persisted output declare its own validity, coverage,
   claim stage, row set, boundary result, or issuance state without recomputation from evidence?
9. **Record identity changed silently.** Did the bytes or fields covered by a digest, schema,
   cache key, cohort key, or stored record change without a version or migration?

Classes 1, 2, 3, 4, 6, 7, and 8 are portable default questions, although they may be `N/A`.
Class 5 applies only where provenance or trusted identity matters. Class 9 applies only where
versioned or persisted identity exists.

Project-specific measurement semantics, contract filenames, renderer lists, isolation backends,
and mutation systems are not portable defaults.

## Project catalog

A project does not need a catalog before its first review. Seed from:

1. Explicit requirements and trust boundaries for the current change.
2. The portable classes above.
3. Any existing incident or review history the maintainer deliberately supplies.

An existing project catalog is an input to round 1. Round 1 may output a `catalog candidate`, but
must not edit or create a permanent catalog.

A project-specific class earns a standing entry when it is backed by a continuing product contract
or recurs in two independent changes or components. One isolated mistake earns a regression test,
not a standing rule. Retire the entry when the governed interface or contract is removed, or a
structural change makes the failure class impossible. Do not retain it merely because it once
caught something, and do not use a quiet-period tally as a retirement rule.

## Round 1 prompt

```text
You are the final merge-gate reviewer. This is ROUND 1: exhaustive inventory, not an ordinary
finding sampler.

Repository: {{REPOSITORY}}
Base commit: {{BASE_SHA}}
Reviewed head: {{ROUND1_HEAD_SHA}}
Requirement sources: {{REQUIREMENT_SOURCES_OR_NONE}}
Known and already routed exact defects: {{KNOWN_ROUTED_OR_NONE}}
Project-specific review classes: {{PROJECT_CLASS_CATALOG_OR_NONE}}
Ordinary full-suite status: {{FULL_SUITE_STATUS_OR_UNKNOWN}}
Tool or platform notes: {{TOOL_NOTES_OR_NONE}}

DIFF.patch is the complete Base..Reviewed-head diff. CHANGED.txt lists its files. The checkout must
be exactly Reviewed head.

Do not emit progress, provisional findings, or placeholders. Read and investigate first; emit the
inventory once at the end.

Purpose

Produce a bounded, immutable inventory of everything this head must satisfy. A competent
implementer must be able to close every failing item in one remediation pass without guessing
which sibling site you did not inspect.

Scope

1. Verify the checkout commit. Read DIFF.patch, CHANGED.txt, every changed file, and the directly
   affected behavior cone: callers or consumers whose behavior changes, canonical authorities,
   validators, persistence readers/writers, public sinks, equivalent implementations, and tests.
2. Do not audit unrelated repository code. If the behavior cone cannot fit the available review
   budget, mark the review INCOMPLETE.
3. Extract one obligation for every explicit acceptance condition, forbidden implementation,
   security boundary, compatibility promise, and changed public claim. If there is no written
   requirement, label the basis DIFF_ONLY and do not invent product intent.
4. Instantiate every portable class below and every supplied project class as an inventory item.
   N/A is allowed only with a concrete reason.
5. Before probing local examples, test whether any central claim is architecturally impossible
   under the chosen mechanism. One structural counterexample should become one inventory item,
   not a succession of symptoms.
6. For every failure, search the whole review scope for the class. Enumerate:
   - every applicable site in the changed diff;
   - directly affected unchanged consumers or authorities;
   - parallel platform, renderer, lifecycle, nested/top-level, success/error, and read/write sites;
   - the tests that claim to guard those sites.
   Do not stop after the first reproduction.
7. Run focused reproductions. Inspect test bodies, not their names. A skip, early return, fixture,
   mock, or mutation witness is evidence only for the path it actually distinguishes.
8. Treat unavailable tools, unsupported platforms, ambiguous requirements, and incomplete site
   sweeps as UNVERIFIED. They make the review INCOMPLETE.
9. Known-routed exclusions suppress only their exact stated failure signature. Report a new variant
   when its authority, source, sink, or consequence is materially different.

Portable classes

G1 self-asserted authority.
G2 absence as success.
G3 equivalent paths diverge.
G4 claim stronger than test.
G5 shape mistaken for provenance.
G6 private input reaches a public sink.
G7 second authority.
G8 stored artifact authorizes itself.
G9 record identity changed silently.

Status meanings

PASS       Direct inspection or a probe supports the item at every applicable site in scope.
FAIL       At least one failure is reproduced and the class-wide site sweep is complete.
N/A        The item cannot occur in this change, with a stated reason.
UNVERIFIED The reviewer cannot reach a conclusion or cannot complete the site sweep.

FAIL is not valid when only the first failing site was examined. Use UNVERIFIED and list the
confirmed sites if the sweep is incomplete.

Severity meanings

BLOCKER Wrong behavior, security exposure, data loss, fail-open behavior, compatibility break,
        unmet requirement, or a test/guard whose false claim is relied on for acceptance.
NIT     Wording, naming, style, or non-behavioral drift that does not make the product unsafe or
        violate an acceptance condition.

Output exactly this Markdown structure:

# Round 1 review inventory

## Binding
- repository:
- base_sha:
- head_sha:
- basis: SPECIFIED | DIFF_ONLY
- scope: COMPLETE | INCOMPLETE
- full_suite:
- required_platforms:
- unavailable_evidence:

## File accounting
One line per changed file:
- <path> — READ | NOT_READ — <role in the change or reason not read>

Then list directly affected unchanged files that were inspected.

## Inventory

Use stable IDs: O-01... for sourced obligations, G-01...G-09 for portable classes, and P-01...
for project classes. Every explicit obligation and every supplied/default class gets an item.

### <ID> — <short assertion>
- kind: obligation | portable-class | project-class
- source: <requirement location, changed claim, class name, or inferred DIFF_ONLY invariant>
- impact: BLOCKER | NIT
- must_hold: <one falsifiable behavior>
- applies_to: <bounded behavior/surface family>
- status: PASS | FAIL | N/A | UNVERIFIED
- applicable_sites: <all sites in scope, grouped when equivalent; include file:symbol or file:line>
- failing_sites: <every failing site, or none>
- evidence: <inspection, command, result, and expected/actual behavior>
- reproduction: <minimal reproduction, or not applicable>
- class_sweep: <symbols, searches, counterparts, and platform/lifecycle variants examined>
- closure: <observable condition that would close the item, including the needed regression test>
- catalog_candidate: <none, or a concise candidate justified by recurrence/standing contract>

Do not replace applicable_sites with “see diff,” “elsewhere,” or one representative example.
For a failing class, distinguish applicable sites that already pass from every site that fails.

## Routed exclusions encountered
- <exact routed defect and where encountered>, or none

## Verdict
PASS | BLOCK | INCOMPLETE

PASS requires every item PASS or N/A and no blocker.
BLOCK requires at least one BLOCKER/FAIL and a COMPLETE inventory.
INCOMPLETE is mandatory if any item is UNVERIFIED, any changed file is NOT_READ, the head does not
match, required evidence is unavailable, or the site sweep cannot be completed.

Do not promise two-round convergence from an INCOMPLETE inventory.
```

## Between rounds

The implementer does not edit the inventory. They produce a separate response:

```text
# Remediation response
- inventory_sha256:
- round1_head_sha:
- remediation_head_sha:

## <each FAIL item ID>
- disposition: FIXED | DISPUTED
- changed_sites:
- applicable_siblings_checked:
- implementation:
- tests_added_or_changed:
- commands_and_results:
- remaining_limitations:

## Touched PASS/N/A items
- <item ID and why the remediation touched it>, or none

## Remediation hunk accounting
- <file and hunk/symbol> — <inventory item ID or explicit unrelated-change explanation>

## New interfaces or behavior
- <anything introduced by the remediation that was not present at round 1>, or none
```

A dispute must answer the reproduction with evidence. “The test passes” is insufficient when the
inventory showed that the test did not distinguish the behavior.

Every remediation hunk must be explained. Unrelated feature work should be removed or causes a new
round-1 inventory.

## Round 2 prompt

```text
You are the final merge-gate reviewer. This is ROUND 2: closure and remediation regression only.

Repository: {{REPOSITORY}}
Base commit: {{BASE_SHA}}
Round-1 head: {{ROUND1_HEAD_SHA}}
Remediation head: {{ROUND2_HEAD_SHA}}
Trusted inventory SHA-256: {{TRUSTED_INVENTORY_SHA256}}
Inventory integrity result: {{INVENTORY_INTEGRITY_RESULT}}
Ordinary full-suite status: {{FULL_SUITE_STATUS_OR_UNKNOWN}}
Tool or platform notes: {{TOOL_NOTES_OR_NONE}}

ROUND1_INVENTORY.md is the exact reviewer-authored round-1 artifact.
IMPLEMENTER_RESPONSE.md is the implementer's separate response.
REMEDIATION.patch is Round-1-head..Remediation-head.
REMEDIATION_CHANGED.txt lists that patch's files.

The expected inventory digest and round-1 head come from a reviewer-owned channel, not from the
implementation branch. The host must verify the digest and ancestry before invoking you.

If inventory integrity is not VERIFIED, the checkout is not Remediation head, Round-1 head is not
an ancestor of Remediation head, or the round-1 inventory says INCOMPLETE, stop with
PROTOCOL_ERROR or RESTART_ROUND_1. Do not approximate closure.

Do not perform another full review of the original PR. Do not deliberately seek new categories in
unchanged round-1 code.

Work

1. Account for every round-1 FAIL item and every implementer disposition.
2. At every listed failing site, rerun the reproduction or an equally direct check.
3. Check the listed applicable sibling sites so that a repair of one example does not leave the
   class open elsewhere.
4. Inspect changed test bodies and run the relevant tests. Do not accept names, fixture labels,
   self-declared statuses, or the implementer's response as proof.
5. Account for every remediation hunk. Recheck a round-1 PASS or N/A item only when the remediation
   touches its implementation or a dependency that can change its result.
6. Review REMEDIATION.patch and the behavior directly reached by it for regressions. This is the
   only ordinary new attack surface in round 2.

What may open in round 2

- OPEN: a round-1 item was not closed, was closed at only some listed sites, or the implementer's
  response is false.
- REMEDIATION-REGRESSION: any blocking correctness, security, privacy, data-loss, compatibility,
  fail-open, or contract defect causally introduced by Round-1-head..Remediation-head. Security is
  not the only allowed category.
- SCOPE-CHANGE: unrelated functionality, a rebase/base change, or a replacement implementation
  makes the round-1 inventory no longer bound the change. This requires RESTART_ROUND_1.
- ROUND1-ESCAPE: a blocking defect present at the round-1 head but absent from the inventory is
  encountered incidentally. Confirm it against Round-1 head, block the merge, and mark the
  two-round protocol as escaped. Do not disguise it as normal closure and do not ignore it.
- INTEGRITY: the inventory, commit binding, or trusted digest does not match.

What may not open in round 2

- A new nit, preferred design, hypothetical hardening idea, or expanded attack against unchanged
  round-1 code.
- Re-litigation of a PASS or N/A item not affected by the remediation.
- A broader version of an exact known-routed defect without a materially different source,
  authority, sink, or consequence.
- A new category merely because round 2 has remaining review budget.

If a real blocker in unchanged round-1 code is noticed, ROUND1-ESCAPE takes precedence over this
restriction. Safety is not traded for the appearance of convergence.

Output exactly:

# Round 2 closure review

## Binding
- inventory_sha256:
- integrity: VERIFIED | FAILED
- round1_head_sha:
- remediation_head_sha:
- ancestry: VERIFIED | FAILED
- round1_scope: COMPLETE | INCOMPLETE

## Response and hunk accounting
- response_items_missing:
- remediation_hunks_unexplained:
- touched_PASS_or_NA_items:

## Closure

One entry for every round-1 FAIL:

### <ID> — CLOSED | OPEN | UNVERIFIABLE
- sites_verified:
- reproduction_result:
- tests:
- response_assessment:
- remaining_failure:

## Remediation regressions
- <R-01, causal remediation hunk, reproduction, impact, and closure>, or none

## Protocol escapes
- <ROUND1-ESCAPE, SCOPE-CHANGE, or INTEGRITY with evidence>, or none

## Verdict
PASS | PASS WITH NITS | BLOCK | RESTART_ROUND_1 | PROTOCOL_ERROR

PASS requires every round-1 BLOCKER/FAIL to be CLOSED, no remediation regression, no protocol
escape, every remediation hunk accounted for, and required tests available and passing.
PASS WITH NITS may retain only round-1 nits.
BLOCK means closure failed or the remediation introduced a blocker; this sequence did not converge
in two rounds.
RESTART_ROUND_1 means the frozen scope is no longer valid or round 1 escaped.
PROTOCOL_ERROR means integrity, ancestry, or required input could not be verified.
```

## Model and tool boundary

The protocol assumes a repository-capable reviewing model that can follow cross-file authority,
reason about adversarial states, retain a 15–40-file inventory, and use tools. Record the model and
effort in benchmarks, but do not hard-code either into the protocol.

A weaker model usually loses site recall first: it finds a valid example but misses equivalent
renderers, platforms, error paths, or stored readers. Prompt wording cannot repair that reliably.

Prompt-shaped work:

- Stable item statuses and IDs.
- Class-wide enumeration.
- Frozen round-2 scope.
- Implementer response requirements.
- Regression versus escape classification.

Tool-shaped work:

- Commit and ancestry verification.
- Reading full files and affected dependencies.
- Repository search.
- Running tests and direct reproductions.
- Comparing Round-1-head..Remediation-head.
- Sealing and verifying the inventory bytes.

Without file access and executable tests, this is a structured opinion, not a P0 merge gate.

## Limits

Do not claim two-round convergence when:

- Round 1 contains UNVERIFIED items.
- The change or its behavior cone exceeds the review context.
- A required platform or integration cannot be exercised.
- The remediation is rebased, replaces the design, or adds unrelated functionality.
- The implementer does not answer every failing item and changed hunk.
- The requirement itself is incompatible with the chosen architecture.

In those cases, say which condition failed. Do not create another ledger or exception process.
````

# 5. Minimal integrity harness

Proposed path: `skills/sol-simplify-review/scripts/review-seal.sh`.

This is the only justified runtime component. It does not invoke a model, parse Markdown, validate process compliance, or retain state.

```sh
#!/bin/sh
set -eu

usage() {
  echo "usage:" >&2
  echo "  review-seal.sh seal INVENTORY BASE_SHA ROUND1_HEAD_SHA" >&2
  echo "  review-seal.sh verify INVENTORY EXPECTED_SHA256 ROUND1_HEAD_SHA [ROUND2_HEAD_SHA]" >&2
  exit 2
}

sha256_file() {
  if command -v sha256sum >/dev/null 2>&1; then
    sha256sum "$1" | awk '{print $1}'
  elif command -v shasum >/dev/null 2>&1; then
    shasum -a 256 "$1" | awk '{print $1}'
  elif command -v openssl >/dev/null 2>&1; then
    openssl dgst -sha256 "$1" | awk '{print $NF}'
  else
    echo "no SHA-256 implementation found" >&2
    exit 2
  fi
}

case "${1-}" in
  seal)
    [ "$#" -eq 4 ] || usage
    inventory=$2
    base=$(git rev-parse "$3^{commit}")
    round1=$(git rev-parse "$4^{commit}")
    checkout=$(git rev-parse HEAD)

    [ -f "$inventory" ] || {
      echo "inventory not found: $inventory" >&2
      exit 1
    }
    [ "$checkout" = "$round1" ] || {
      echo "checkout is not ROUND1_HEAD_SHA" >&2
      exit 1
    }
    git merge-base --is-ancestor "$base" "$round1" || {
      echo "BASE_SHA is not an ancestor of ROUND1_HEAD_SHA" >&2
      exit 1
    }

    echo "review_protocol=sol-simplify-review-v1"
    echo "inventory_sha256=$(sha256_file "$inventory")"
    echo "base_sha=$base"
    echo "round1_head_sha=$round1"
    ;;

  verify)
    [ "$#" -eq 4 ] || [ "$#" -eq 5 ] || usage
    inventory=$2
    expected=$3
    round1=$(git rev-parse "$4^{commit}")
    round2=$(git rev-parse "${5:-HEAD}^{commit}")
    checkout=$(git rev-parse HEAD)

    [ -f "$inventory" ] || {
      echo "inventory not found: $inventory" >&2
      exit 1
    }
    [ "$(sha256_file "$inventory")" = "$expected" ] || {
      echo "inventory digest mismatch" >&2
      exit 1
    }
    [ "$checkout" = "$round2" ] || {
      echo "checkout is not ROUND2_HEAD_SHA" >&2
      exit 1
    }
    git merge-base --is-ancestor "$round1" "$round2" || {
      echo "ROUND1_HEAD_SHA is not an ancestor of ROUND2_HEAD_SHA" >&2
      exit 1
    }

    echo "inventory_integrity=VERIFIED"
    echo "inventory_sha256=$expected"
    echo "round1_head_sha=$round1"
    echo "round2_head_sha=$round2"
    ;;

  *)
    usage
    ;;
esac
```

The inventory’s raw bytes and the `seal` output belong in a reviewer-owned PR check, review comment, or CI artifact that the implementer cannot edit. Storing both only on the implementation branch provides no integrity.

For a non-hosted repository, the reviewer must transmit the expected digest through a channel separate from the implementer-controlled checkout. If no such trusted channel exists, the protocol cannot honestly claim tamper evidence.

The implementer’s response needs no seal: it is an assertion that round 2 distrusts and verifies.

# 6–9. Portability and operating conditions

The protocol itself contains no project-specific class. The existing nine classes become generic questions; project-specific details remain requirements instantiated in a particular inventory.

The catalog is both:

- An optional input when a project already has earned recurring classes.
- A non-mutating output when round 1 suggests a candidate.

It is never automatically written back. There is no fixed “first N reviews” bootstrapping phase. The portable defaults apply immediately; history earns a standing project entry only through a continuing contract or recurrence.

A project with only a diff still gets useful security, correctness, test-strength, authority, and consistency review. It cannot get certification that an unstated feature was fully implemented.

The reviewing model is replaceable. The command that invokes it belongs to the host harness. The protocol depends on capability and tools, not a specific CLI or reasoning-effort string. Before adopting a weaker model, benchmark its class-wide site recall; fluent inventory formatting is not evidence that it found every site.

# Benchmark design

Use the host’s existing “same prompt, same model, skill can lose” style.

## Arms

1. `plain` — an ordinary merge-gate prompt, repeated on the current head.
2. `enumerate-line` — plain plus one sentence asking for all instances of each discovered class.
3. `frozen-security-only` — the proposed hypothesis exactly: frozen round-1 inventory, with only newly introduced security findings allowed in round 2.
4. `skill` — the complete protocol, implementer response, and sealed inventory.

The third arm matters: it tests whether the attractive security-only restriction causes unsafe passes when remediation introduces a non-security blocker.

## Scenarios

- `01-publication-fanout` — several public sinks, path/credential boundary spellings, and a test covering one example.
- `02-fail-closed` — missing, null, unknown, empty, and explicit-negative states split across builder, reader, verifier, and renderer.
- `03-authority-and-migration` — subject-supplied status, digest-shaped provenance, duplicate mapping, and a remediation that changes digest coverage without migration.
- `04-parallel-backends` — two platform implementations plus cleanup/error paths and a skipped “real lane” witness.
- `05-fix-regression` — closing the known finding creates a non-security compatibility or data-loss regression.
- `06-adversarial-handoff` — edited inventory copy, false response, unexplained hunk, and a test whose name overclaims.
- `07-guardrail` — an oversized behavior cone or unavailable required platform; the correct result is `INCOMPLETE`, not a two-round PASS.
- `08-diff-only` — no written requirements; the output must limit its claim to what the diff establishes.

Seeds should have hidden oracle tests covering every seeded site and every scripted remediation regression. Reviewer and implementer must not see those tests. Preserve prompts, model configuration, tool logs, artifacts, patches, responses, and final worktrees.

## Headline metric

A run achieves `safe two-round closure` only when:

- Round 1 passes immediately, or round 2 returns PASS after one remediation.
- Hidden oracle tests report zero remaining blocking defects.
- There was no `ROUND1-ESCAPE`.
- No post-round-2 repair is allowed.

Report:

```text
safe two-round closure: X of N eligible runs
unsafe PASS:             X of N
round-1 escapes:         X of N
correct guardrail stop:  X of M
```

Finding-count reduction is not the metric. A 5 → 1 sequence that leaves one blocker did not converge.

Following the host’s small-sample style, three runs per arm and five eligible scenarios would produce 15 treatment sequences. A result such as:

```text
safe two-round closure: 15 of 15
unsafe PASS:              0 of 15
round-1 escapes:          0 of 15
correct guardrail stop:   9 of 9
```

would honestly support only:

> “All 15 eligible benchmark runs converged safely by the second review; all nine adversarial or out-of-envelope runs stopped.”

It would not establish reliability in every repository or on every model. The README should report the raw counts and limitations exactly as the existing benchmark does.

# Failure modes and cheapest detectors

| Failure | How it breaks | Cheapest detector |
|---|---|---|
| Careless implementer fixes one reproduction | Sibling renderer/platform/error path stays defective | Re-run every listed site and require the response to account for applicable siblings |
| Careless implementer changes unrelated code | Round-1 scope no longer bounds the head | Compare remediation hunks with response IDs; unexplained functionality becomes `SCOPE-CHANGE` |
| Implementer claims a test proves closure | A green test still does not distinguish the defect | Inspect the body and rerun the original direct reproduction |
| Implementer edits the inventory | Round 2 verifies a weakened artifact | Verify SHA-256 against the reviewer-owned seal before invoking the model |
| Adversarial implementer makes stored output internally consistent but false | Derived rows agree with one another while disagreeing with source evidence | Recompute from the original authority/evidence; do not trust stored status or the response |
| Remediation introduces a non-security blocker | Security-only round-2 rules would merge it | Permit `REMEDIATION-REGRESSION` for every blocking product category |
| Round 1 misses an original-head blocker | Frozen closure could produce a false PASS | Classify any incidentally found blocker against the old head as `ROUND1-ESCAPE`; benchmark hidden-oracle recall |
| Reviewer model produces a fluent but incomplete inventory | Sites are silently absent without `UNVERIFIED` | Qualify the model on seeded site-fanout scenarios; there is no cheap production proof of completeness |
| Required platform/tool cannot run | A critical lane is treated as exhausted | Any required skip, early return, permission failure, or unavailable integration makes the item `UNVERIFIED` |
| Requirement is infeasible under the architecture | Successive patches decorate an unavoidable counterexample | Round 1 must try the central counterexample and create one architectural FAIL requiring redesign, withholding, or requirement change |
| PR exceeds the envelope | Context pressure restores finding sampling | Preflight the diff/file count and behavior cone; over roughly the stated 40-file envelope, declare `INCOMPLETE` unless review capacity is explicitly enlarged |
| Branch was rebased or replaced | The sealed inventory describes a different history | The ancestry check fails and requires a new round 1 |
| Project catalog becomes bureaucracy | Stale classes create permanent review tax | Keep it optional; remove entries when their source boundary disappears or a structural fix makes them impossible |
| Reviewer and implementer share the trusted seal channel | An adversary can replace both artifact and expected digest | Separate channel ownership; without it, make no tamper-evidence claim |

The host’s `sol-simplify` constraint materially shaped the form: one disposable review artifact, one small integrity script, no repo registry, no document-shape validator, and no permanent gate state.