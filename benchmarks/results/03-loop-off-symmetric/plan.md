<style>
:root {
  --background: oklch(0.97 0.005 260);
  --foreground: oklch(0.18 0.02 260);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.18 0.02 260);
  --primary: oklch(0.50 0.25 280);
  --primary-foreground: oklch(1 0 0);
  --secondary: oklch(0.50 0.18 180);
  --secondary-foreground: oklch(1 0 0);
  --muted: oklch(0.92 0.01 260);
  --muted-foreground: oklch(0.40 0.02 260);
  --accent: oklch(0.60 0.22 50);
  --accent-foreground: oklch(0.18 0.02 260);
  --destructive: oklch(0.50 0.25 25);
  --destructive-foreground: oklch(1 0 0);
  --success: oklch(0.45 0.20 150);
  --success-foreground: oklch(1 0 0);
  --warning: oklch(0.55 0.18 85);
  --warning-foreground: oklch(0.18 0.02 260);
  --border: oklch(0.88 0.01 260);
  --code-bg: oklch(0.92 0.01 260);
  --font-sans: Inter, system-ui, -apple-system, sans-serif;
  --font-mono: "JetBrains Mono", "Fira Code", ui-monospace, monospace;
  --font-display: ui-serif, Georgia, "Times New Roman", serif;
  --radius: 0.625rem;
}
.plan-header h1, .plan-section h2, .plan-section h3 { font-family: var(--font-display); font-weight: 500; }
.eyebrow, .prompt-label, .stat-label, .phase, .decision-owner {
  font-family: var(--font-mono); text-transform: uppercase; letter-spacing: .06em;
}
.eyebrow { color: var(--muted-foreground); font-size: .72rem; }
.prompt-box { background: var(--muted); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px 24px; }
.prompt-label { display: block; color: var(--muted-foreground); font-size: .7rem; font-weight: 600; margin-bottom: 4px; }
.summary-strip { display: grid; grid-template-columns: repeat(auto-fit,minmax(140px,1fr)); gap: 16px; margin: 32px 0; }
.stat-card { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); padding: 16px; text-align: center; }
.stat-value { display: block; font-family: var(--font-display); font-size: 1.8rem; }
.stat-label { color: var(--muted-foreground); display: block; font-size: .68rem; margin-top: 4px; }
.plan-section { margin-top: 56px; }
.section-heading { align-items: baseline; border-bottom: 1.5px solid var(--border); display: flex; gap: 16px; margin-bottom: 24px; padding-bottom: 8px; }
.section-heading span { color: var(--primary); font-family: var(--font-mono); font-size: .75rem; font-weight: 600; }
.section-heading h2 { margin: 0; }
.decision { background: var(--card); border-left: 3px solid var(--primary); border-radius: 0 var(--radius) var(--radius) 0; padding: 16px 24px; }
.diagram-panel { background: var(--card); border: 1.5px solid var(--border); border-radius: var(--radius); margin: 24px 0; padding: 24px; }
.diagram-caption { color: var(--muted-foreground); display: block; font-family: var(--font-mono); font-size: .72rem; margin-top: 8px; text-align: center; }
.milestones { display: flex; flex-direction: column; }
.milestone { display: grid; grid-template-columns: 86px 28px 1fr; gap: 0 18px; }
.phase { color: var(--muted-foreground); font-size: .72rem; padding-top: 3px; text-align: right; }
.dot-col { align-items: center; display: flex; flex-direction: column; }
.dot { background: var(--card); border: 3px solid var(--primary); border-radius: 50%; flex-shrink: 0; height: 14px; width: 14px; }
.line { background: var(--border); flex: 1; margin: 4px 0; width: 2px; }
.milestone:last-child .line { display: none; }
.milestone-body { padding-bottom: 34px; }
.milestone-body h3 { margin: 0 0 6px; }
.exit { background: color-mix(in oklab, var(--success) 8%, transparent); border-radius: var(--radius); color: var(--success); padding: 8px 12px; }
.risk-high, .risk-med, .risk-low { border-radius: calc(var(--radius) - 4px); font-family: var(--font-mono); font-size: .68rem; font-weight: 600; padding: 2px 8px; }
.risk-high { background: color-mix(in oklab, var(--destructive) 15%, transparent); color: var(--destructive); }
.risk-med { background: color-mix(in oklab, var(--warning) 15%, transparent); color: var(--warning); }
.risk-low { background: color-mix(in oklab, var(--success) 15%, transparent); color: var(--success); }
.open-question { background: var(--card); border-left: 3px solid var(--primary); border-radius: 0 var(--radius) var(--radius) 0; margin: 16px 0; padding: 16px 24px; }
.decision-owner { color: var(--primary); display: block; font-size: .7rem; margin-top: 8px; }
@media (max-width: 720px) { .milestone { grid-template-columns: 64px 20px 1fr; gap: 0 10px; } }
</style>

<header class="plan-header">
  <span class="eyebrow">Implementation plan · Ticket eligibility gate</span>
  <h1>전역 개수 검증을 없애고, 설명 가능한 티켓 판정기로 전환한다</h1>
  <div class="prompt-box">
    <span class="prompt-label">Brief</span>
    <p>5,745줄 리졸버와 8,683줄 계약 테스트, 머지마다 흔들리는 census pin, 월 25건의 재측정 커밋, 동시 브랜치 충돌, 그리고 유효 티켓 4개를 모두 멈춘 게이트 장애를 해소한다.</p>
  </div>
</header>

<div class="summary-strip">
  <div class="stat-card"><span class="stat-value">14,428</span><span class="stat-label">Resolver + contract test LOC</span></div>
  <div class="stat-card"><span class="stat-value">113%</span><span class="stat-label">Validation / product LOC</span></div>
  <div class="stat-card"><span class="stat-value">25</span><span class="stat-label">Pin-only commits last month</span></div>
  <div class="stat-card"><span class="stat-value">0 / 4</span><span class="stat-label">Eligible work passed yesterday</span></div>
</div>

> **결론:** 세 작업을 순서대로 진행한다. 먼저 마지막 정상 규칙으로 되돌려 4개 티켓을 재판정한다. 다음으로 저장소 전체의 정확한 개수를 요구하는 census pin을 차단 조건에서 제거한다. 마지막으로 기존 리졸버를 한 번에 다시 쓰지 않고, 정규화 계층·순수 정책 평가기·판정 추적기로 감싸서 shadow 비교 후 교체한다.

<section class="plan-section">
<div class="section-heading"><span>01</span><h2>목표와 경계</h2></div>

### 성공 상태

- 티켓 판정은 `ALLOW`, `DENY`, `INDETERMINATE` 중 하나와 **규칙 ID, 규칙 버전, 근거, 입력 스냅샷 식별자**를 반환한다.
- 저장소 파일 수와 전체 티켓 수는 대시보드용 텔레메트리일 뿐, CI 통과 조건이 아니다.
- 병렬 브랜치가 서로의 전역 count 상수를 수정하지 않는다.
- 알려진 적격 canary는 항상 통과하고, 알려진 부적격 canary는 항상 거부된다. 입력/시스템 오류는 `DENY`로 위장되지 않고 `INDETERMINATE`로 드러난다.
- 새 평가기는 기존 평가기와 shadow 비교를 통과한 뒤 점진적으로 권한을 넘겨받고, 안정화 후 기존 5,745줄 파일과 그 구현 결합형 테스트를 제거한다.

### 하지 않을 일

- 장애 해소를 이유로 모든 티켓을 무조건 통과시키지 않는다.
- 5,745줄 리졸버를 사양 없이 한 번에 재작성하지 않는다.
- 현재 8,683줄 테스트를 새 구조의 설계 문서로 취급하지 않는다. 테스트가 보존한 **의도된 계약**과 우연히 고정한 **구현 세부사항**을 분리한다.
- LOC 감소 자체를 성공 기준으로 삼지 않는다. 검증 코드 20,280줄은 경고 신호지만, 삭제는 행위 동등성 증거와 함께 수행한다.

> **자료 한계:** 현재 작업 디렉터리에는 실제 제품 소스가 없고 문제 설명과 실행 로그만 있다. 아래 Phase 1의 첫 산출물에서 실제 파일, CI job, 규칙 소유자를 매핑하며, 여기서는 제공된 수치를 기준선으로 사용한다.
</section>

<section class="plan-section">
<div class="section-heading"><span>02</span><h2>현재 악순환과 목표 구조</h2></div>

<div class="diagram-panel">
<svg viewBox="0 0 900 330" xmlns="http://www.w3.org/2000/svg" style="width:100%;max-width:900px">
  <style>
    .box{fill:var(--card);stroke:var(--border);stroke-width:1.5}.bad{fill:color-mix(in oklab,var(--destructive) 8%,transparent);stroke:var(--destructive);stroke-width:1.5}.good{fill:color-mix(in oklab,var(--success) 8%,transparent);stroke:var(--success);stroke-width:1.5}.label{font-family:var(--font-sans);font-size:13px;font-weight:600;fill:var(--foreground)}.sub{font-family:var(--font-mono);font-size:10px;fill:var(--muted-foreground)}.edge{fill:none;stroke:var(--muted-foreground);stroke-width:1.5}.edge-bad{fill:none;stroke:var(--destructive);stroke-width:1.5}.edge-good{fill:none;stroke:var(--success);stroke-width:1.5}
  </style>
  <defs>
    <marker id="arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--muted-foreground)"/></marker>
    <marker id="arrow-bad" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--destructive)"/></marker>
    <marker id="arrow-good" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0,0 L10,5 L0,10 z" fill="var(--success)"/></marker>
  </defs>
  <text x="18" y="24" class="sub">BEFORE · GLOBAL MUTABLE STATE</text>
  <rect x="18" y="52" width="130" height="52" rx="9" class="box"/><text x="83" y="75" text-anchor="middle" class="label">브랜치 A / B</text><text x="83" y="91" text-anchor="middle" class="sub">파일·티켓 추가</text>
  <line x1="148" y1="78" x2="206" y2="78" class="edge-bad" marker-end="url(#arrow-bad)"/>
  <rect x="206" y="52" width="150" height="52" rx="9" class="bad"/><text x="281" y="75" text-anchor="middle" class="label">Census pin</text><text x="281" y="91" text-anchor="middle" class="sub">전역 exact count</text>
  <line x1="356" y1="78" x2="414" y2="78" class="edge-bad" marker-end="url(#arrow-bad)"/>
  <rect x="414" y="52" width="150" height="52" rx="9" class="bad"/><text x="489" y="75" text-anchor="middle" class="label">재측정 / 충돌</text><text x="489" y="91" text-anchor="middle" class="sub">월 25 commits</text>
  <path d="M489 104 C489 148 281 148 281 108" class="edge-bad" marker-end="url(#arrow-bad)"/>
  <line x1="564" y1="78" x2="622" y2="78" class="edge-bad" marker-end="url(#arrow-bad)"/>
  <rect x="622" y="52" width="178" height="52" rx="9" class="bad"/><text x="711" y="75" text-anchor="middle" class="label">불투명한 거대 게이트</text><text x="711" y="91" text-anchor="middle" class="sub">0 pass → 작업 중단</text>

  <text x="18" y="188" class="sub">AFTER · LOCAL SEMANTIC INVARIANTS</text>
  <rect x="18" y="216" width="130" height="56" rx="9" class="box"/><text x="83" y="240" text-anchor="middle" class="label">Ticket input</text><text x="83" y="256" text-anchor="middle" class="sub">schema + context</text>
  <line x1="148" y1="244" x2="206" y2="244" class="edge-good" marker-end="url(#arrow-good)"/>
  <rect x="206" y="216" width="150" height="56" rx="9" class="good"/><text x="281" y="240" text-anchor="middle" class="label">Pure policy engine</text><text x="281" y="256" text-anchor="middle" class="sub">versioned rules</text>
  <line x1="356" y1="244" x2="414" y2="244" class="edge-good" marker-end="url(#arrow-good)"/>
  <rect x="414" y="216" width="170" height="56" rx="9" class="good"/><text x="499" y="240" text-anchor="middle" class="label">Decision + trace</text><text x="499" y="256" text-anchor="middle" class="sub">allow / deny / indeterminate</text>
  <line x1="584" y1="244" x2="642" y2="244" class="edge-good" marker-end="url(#arrow-good)"/>
  <rect x="642" y="216" width="158" height="56" rx="9" class="box"/><text x="721" y="240" text-anchor="middle" class="label">Gate + audit</text><text x="721" y="256" text-anchor="middle" class="sub">reason codes</text>
  <path d="M281 272 C281 312 721 312 721 276" class="edge" stroke-dasharray="5 4" marker-end="url(#arrow)"/>
  <text x="500" y="322" text-anchor="middle" class="sub">counts are telemetry, never merge blockers</text>
</svg>
<span class="diagram-caption">전역 가변 상태를 제거하고, 티켓 하나의 의미적 유효성만 판정한다.</span>
</div>

판정기의 핵심 계약은 다음처럼 작고 안정적이어야 한다.

```text
Decision {
  outcome: ALLOW | DENY | INDETERMINATE
  policy_version: string
  reasons: [{ rule_id, result, evidence }]
  input_fingerprint: string
}
```

`DENY`는 정책상 부적격일 때만 사용한다. 누락 필드, 규칙 로딩 실패, 예외 같은 시스템 문제는 `INDETERMINATE`로 분리해 운영 장애와 정상 거부를 구별한다.
</section>

<section class="plan-section">
<div class="section-heading"><span>03</span><h2>단계별 실행</h2></div>

<div class="milestones">
  <div class="milestone">
    <div class="phase">Phase 0</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>흐름 복구와 증거 보존</h3>
      <ul>
        <li>게이트 규칙 변경을 잠시 동결하고, 어제 장애 직전의 마지막 정상 정책 버전으로 rollback한다. 정책 버전이 없다면 문제 규칙만 feature flag로 격리한다.</li>
        <li>멈춘 4개 티켓을 같은 입력으로 재실행하여 결과와 규칙별 trace를 보존한다. 적격으로 확인된 건은 정책 소유자 승인과 감사 기록을 남기는 ticket-scoped break-glass로 풀어준다.</li>
        <li>실제 운영 티켓 수가 0인지로 CI를 실패시키지 않는다. 대신 저장소 내 고정 fixture로 “known-good은 ALLOW, known-bad는 DENY” canary를 만든다.</li>
        <li>모든 티켓을 통과시키는 전역 fail-open은 금지한다. break-glass는 티켓별·만료형이며 `INDETERMINATE` 또는 확인된 게이트 결함에만 사용한다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 4개 티켓의 판정이 완료되고, 적격/부적격 canary와 판정 trace가 CI에서 재현된다.</p>
    </div>
  </div>

  <div class="milestone">
    <div class="phase">Phase 1</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>의도된 계약을 복원한다</h3>
      <ul>
        <li>리졸버 entry point, 외부 I/O, 규칙 목록, census pin 위치, CI job, 8,683줄 테스트를 하나의 인벤토리로 연결한다.</li>
        <li>테스트를 <em>제품 불변조건</em>, <em>정책 결정표</em>, <em>legacy 특성화</em>, <em>census exact-count</em>, <em>중복/구현결합</em>으로 분류한다.</li>
        <li>실제 사례에서 적격·부적격·경계·잘못된 입력 corpus를 만들고, 정책 소유자가 기대 결과와 reason code를 승인한다.</li>
        <li>기존 리졸버 앞에 안정된 `evaluate(ticket, context) -> Decision` 어댑터를 둔다. 이 단계에서는 내부 로직을 바꾸지 않는다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 모든 현행 규칙에 소유자와 사례가 있고, 현재 판정을 corpus에서 반복 재생할 수 있다.</p>
    </div>
  </div>

  <div class="milestone">
    <div class="phase">Phase 2</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>Census pin을 차단 경로에서 제거한다</h3>
      <ul>
        <li>기존 exact-count check를 한 차례 정보성 출력으로 전환해 어떤 의미 검사가 사라지는지 확인한 뒤 삭제한다.</li>
        <li>파일 수 pin은 “발견된 각 파일의 schema가 유효함”, “ID 중복 없음”, “참조 대상 존재”, “허용된 위치/확장자” 같은 로컬 불변조건으로 교체한다.</li>
        <li>티켓 수 pin은 “모든 티켓이 파싱됨”, “상태 전이가 유효함”, “필수 소유자/링크 존재”로 교체한다. 전체 개수는 추세 지표로만 기록한다.</li>
        <li>테스트 fixture 자체의 개수가 중요하다면 저장소 전체가 아니라 해당 fixture 디렉터리 안에서만 명시적 목록을 검증한다.</li>
        <li>CI에 repository-wide exact count가 새로 추가되는 것을 막는 정적 검사 또는 review rule을 둔다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 전역 file/ticket count 차단 assertion이 0개이며, 병렬 브랜치가 pin 파일을 함께 수정하지 않는다.</p>
    </div>
  </div>

  <div class="milestone">
    <div class="phase">Phase 3</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>거대 리졸버를 순수 정책 엔진으로 감싼다</h3>
      <ul>
        <li>I/O와 정규화를 평가에서 분리한다: adapter → canonical input → pure rules → conflict resolution → decision trace.</li>
        <li>각 규칙을 ID와 버전이 있는 독립 단위로 옮긴다. 우선순위, short-circuit, allow/deny 충돌 처리 규칙은 코드 흐름이 아니라 명시적 정책으로 둔다.</li>
        <li>새 규칙 단위 테스트는 결정표의 정상·경계·반례를 직접 표현한다. 속성 테스트로 결정론, 입력 불변성, 미처리 예외 없음, 충돌 탐지를 검증한다.</li>
        <li>legacy 특성화 테스트는 임시 호환막으로 표시한다. 새 구조의 public contract, 승인된 결정표, 불변조건이 같은 내용을 덮으면 삭제한다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 새 엔진이 전체 승인 corpus를 처리하고 모든 결과에 기계 판독 가능한 근거를 제공한다.</p>
    </div>
  </div>

  <div class="milestone">
    <div class="phase">Phase 4</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>Shadow 비교로 의미 차이를 닫는다</h3>
      <ul>
        <li>기존 리졸버를 authoritative로 유지하고 새 엔진을 같은 입력에 shadow 실행한다. 사용자에게는 한 결과만 반환한다.</li>
        <li>차이를 `의도된 버그 수정`, `legacy만 맞음`, `새 엔진 결함`, `사양 미정`으로 분류한다. 의도된 차이는 정책 소유자의 승인 사례로 corpus에 편입한다.</li>
        <li>결과뿐 아니라 reason code와 오류 분류를 비교한다. 적격률, 부적격률, no-rule-match, `INDETERMINATE`, 예외를 규칙 버전별로 관찰한다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 승인 corpus 100% 통과, 제품 불변조건 위반 0, 설명되지 않은 legacy/new 차이 0.</p>
    </div>
  </div>

  <div class="milestone">
    <div class="phase">Phase 5</div><div class="dot-col"><span class="dot"></span><span class="line"></span></div>
    <div class="milestone-body">
      <h3>점진 전환 후 legacy를 삭제한다</h3>
      <ul>
        <li>규칙 묶음 또는 티켓 유형별로 새 엔진을 authoritative로 전환한다. 각 묶음은 독립 feature flag와 last-known-good 정책 버전을 가진다.</li>
        <li>아래 중단 조건이 발생하면 코드 revert 대신 해당 규칙 묶음만 직전 정책 버전으로 되돌린다.</li>
        <li>합의한 관찰 구간 동안 중단 조건이 없으면 legacy 리졸버, shadow 경로, 대체된 구현결합 테스트를 제거한다.</li>
        <li>정책 변경 PR 템플릿에 rule ID, 영향받는 결정표 사례, 새 반례, rollback 버전을 필수로 둔다.</li>
      </ul>
      <p class="exit"><strong>Exit:</strong> 기존 5,745줄 리졸버가 실행 경로와 레포에서 제거되고, pin-only commit 없이 연속 통합이 완료된다.</p>
    </div>
  </div>
</div>
</section>

<section class="plan-section">
<div class="section-heading"><span>04</span><h2>검증 전략을 바꾸는 구체적 치환표</h2></div>

| 지금의 검사 | 문제 | 교체할 검사 | CI 역할 |
|---|---|---|---|
| 레포 전체 파일 수 `== N` | 무관한 파일 추가도 실패, 병렬 브랜치 충돌 | 발견된 파일 각각의 schema/경로/ID/참조 무결성 | 차단 |
| 전체 티켓 수 `== N` | 정상 티켓 추가가 pin 갱신을 요구 | 모든 티켓 파싱, 고유 ID, 유효 상태 전이, 필수 링크 | 차단 |
| 현재 운영 티켓 중 ALLOW 수 `> 0` | 실제 업무량과 정책 건전성을 혼동 | 고정 known-good/known-bad canary | 차단 |
| 거대 출력 snapshot | 작은 변화가 대량 갱신 유발 | outcome + 안정된 reason code + 핵심 evidence | 차단 |
| 내부 함수 호출 순서 고정 | 리팩터링을 계약 위반으로 만듦 | public `Decision` 계약과 승인된 결정표 | 차단 |
| 파일/티켓 count 추세 | 품질 의미가 약함 | 그대로 수집하되 변화량과 출처만 관찰 | 비차단 텔레메트리 |

테스트 포트폴리오는 다음 순서를 따른다.

1. **정책 결정표:** 정책 소유자가 읽고 승인할 수 있는 입력→결과 사례.
2. **규칙 단위 경계 테스트:** 한 번에 한 규칙을 격리한다.
3. **속성 테스트:** 결정론, 미처리 예외 없음, 충돌 검출 등 모든 입력에 필요한 성질.
4. **소수의 통합/계약 테스트:** adapter, 정책 엔진, 게이트 사이의 안정된 인터페이스만 검증한다.
5. **임시 differential 테스트:** 전환 중 legacy와 new의 차이를 찾고, cutover 후 제거한다.

테스트 삭제는 “줄 수 목표”가 아니라 **승인된 계약으로 대체되었는가**를 기준으로 한다. 따라서 8,683줄 전체를 먼저 지우지도, 영구 보존하지도 않는다.
</section>

<section class="plan-section">
<div class="section-heading"><span>05</span><h2>중단·복구 규칙</h2></div>

다음 중 하나라도 발생하면 해당 rollout 묶음을 중단하고 last-known-good 정책으로 되돌린다.

- known-good canary가 `ALLOW`가 아니거나 known-bad canary가 `DENY`가 아니다.
- 설명되지 않은 legacy/new outcome 차이가 발견된다.
- `INDETERMINATE`, no-rule-match, 미처리 예외가 기준선보다 증가한다.
- 적격 티켓이 reason code 없이 거부되거나, break-glass가 만료/감사 기록 없이 사용된다.
- 정책 번들이 schema 또는 버전 호환성 검사를 통과하지 못한다.

복구 단위는 레포 전체나 모든 게이트가 아니라 **정책 버전/규칙 묶음**이다. 이 구조가 어제와 같은 전면 정지를 국소 장애로 바꾼다.
</section>

<section class="plan-section">
<div class="section-heading"><span>06</span><h2>성과 지표와 완료 기준</h2></div>

| 지표 | 기준선 | 완료 기준 |
|---|---:|---:|
| 적격 canary 통과 | 어제 0/4 운영 티켓 통과 | known-good 100%, known-bad 100% 거부 |
| 전역 census 차단 assertion | 존재 | 0 |
| pin 재측정 전용 커밋 | 지난달 25 | 0 |
| pin으로 인한 병렬 브랜치 재조정 | 반복 발생 | 0 |
| 판정 reason/정책 버전 기록 | 불명확 | 판정의 100% |
| 설명되지 않은 shadow 차이 | 미측정 | 0 |
| 거대 legacy 리졸버 | 5,745 LOC | authoritative 경로에서 제거 후 파일 삭제 |

`검증 LOC / 제품 LOC = 20,280 / 17,964 ≈ 113%`는 계속 관찰하되 gate로 만들지 않는다. 이 비율은 Phase 5에서 obsolete 테스트와 legacy를 제거하면 내려가야 하지만, 낮추기 위해 중요한 정책 사례를 삭제해서는 안 된다.
</section>

<section class="plan-section">
<div class="section-heading"><span>07</span><h2>위험과 완화</h2></div>

| 위험 | 수준 | 완화 |
|---|---|---|
| 특성화 테스트가 기존 버그까지 새 사양으로 굳힘 | <span class="risk-high">HIGH</span> | legacy 일치와 정책 소유자가 승인한 의도를 별도 suite로 유지하고, 의도된 차이는 명시 승인한다. |
| 긴 shadow 기간으로 두 시스템이 영구화 | <span class="risk-high">HIGH</span> | exit 기준과 legacy 삭제 PR을 처음부터 만들고, 차이를 미분류 상태로 방치하지 않는다. |
| `INDETERMINATE`를 사실상 ALLOW로 취급 | <span class="risk-high">HIGH</span> | 정상 경로에서는 차단하고, 티켓별 만료형 break-glass만 허용한다. |
| Census 제거로 실제 누락을 놓침 | <span class="risk-med">MED</span> | count 대신 discovery completeness, schema, 고유성, 참조 무결성을 각각 검증한다. |
| 규칙 모듈화 후 우선순위가 달라짐 | <span class="risk-med">MED</span> | conflict resolution을 명시하고 differential trace를 결과와 함께 비교한다. |
| LOC 감축 압력이 테스트 품질 저하로 이어짐 | <span class="risk-low">LOW</span> | LOC는 관찰 지표로만 두고, 결정표 coverage와 미설명 차이 0을 삭제 gate로 사용한다. |
</section>

<section class="plan-section">
<div class="section-heading"><span>08</span><h2>착수 전에 정할 세 가지</h2></div>

<div class="open-question">
  <h3>정책의 최종 의미를 누가 승인하는가?</h3>
  <p>코드는 현재 동작을 보여줄 뿐 의도를 결정하지 못한다. 적격·부적격·경계 사례의 단일 승인자를 지정해야 한다.</p>
  <span class="decision-owner">Decide with: 제품 책임자 + 게이트 정책 소유자</span>
</div>

<div class="open-question">
  <h3>Break-glass 승인과 만료 규칙은 무엇인가?</h3>
  <p>전면 fail-open을 막으면서 게이트 결함이 구현 전체를 멈추지 않게, 승인자·허용 사유·자동 만료·사후 검토를 정한다.</p>
  <span class="decision-owner">Decide with: 엔지니어링 책임자 + 운영/보안</span>
</div>

<div class="open-question">
  <h3>Cutover 관찰 구간과 허용 임계값은 무엇인가?</h3>
  <p>적격률 자체는 업무량에 따라 변하므로 목표값으로 두지 않는다. canary 실패 0, 미설명 차이 0, 예외 0을 기본 hard stop으로 하고 추가 운영 임계값을 합의한다.</p>
  <span class="decision-owner">Decide with: 게이트 운영자 + 제품 책임자</span>
</div>
</section>

---

## 첫 번째 PR의 범위

첫 PR은 리라이트가 아니다. 다음만 포함한다.

- 어제 장애 입력과 known-good/known-bad canary fixture 추가
- 현재 리졸버 결과를 `Decision` 형태로 기록하는 thin adapter 및 trace
- 전역 census check를 정보성으로 내리고, 그 자리를 schema·고유성·참조 무결성 검사로 교체
- 4개 중단 티켓의 재판정 기록과 last-known-good rollback 절차 문서화

이 PR이 통과하면 pin churn은 먼저 멈추고, 이후 리졸버 분해를 안전하게 진행할 관찰 지점이 생긴다.
