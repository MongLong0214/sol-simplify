<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="assets/logo-dark.svg?v=3">
    <img src="assets/logo.svg?v=3" width="480" alt="sol-simplify — a tangled line straightens into one clean line">
  </picture>
</p>

<p align="center">
  <em>게이트를 만들었다. 그 게이트가 자기 일을 막기 시작했다.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
  <img src="https://img.shields.io/badge/install-one%20file-111111?style=flat-square" alt="One file">
  <img src="https://img.shields.io/badge/works%20with-Codex%20%C2%B7%20Claude%20Code%20%C2%B7%20Cursor-111111?style=flat-square" alt="Works with">
  <img src="https://img.shields.io/badge/measured%20on-gpt--5.6--sol-111111?style=flat-square" alt="Measured on gpt-5.6-sol">
</p>

<p align="center">
  <strong>5개 시나리오 전체에서 ceremony 0/12 &middot; 발명된 437줄 &rarr; 58줄 &middot; 마크다운 파일 1개</strong><br>
  <sub><code>gpt-5.6-sol</code>, effort <code>xhigh</code>에서 고정 10-카테고리 루브릭으로 측정, 모든 점수는 해당 라인 인용, 원본 산출물 전부 커밋됨. 널리 알려진 한 줄짜리 프롬프트를 대조군으로 함께 실행 — 문서는 짧아지지만 게이트 면제 절차를 만들었고 14,000줄짜리 승인 기계는 그대로 뒀다. 단일 모델, 셀당 n=1–3. <a href="benchmarks/results/SCORES.md">채점표</a> &middot; <a href="benchmarks/">재현하기</a>.</sub>
</p>

<p align="center">
  <sub><a href="README.md">English</a> &middot; <strong>한국어</strong></sub>
</p>

---

코딩 에이전트의 과잉은 코드에서 끝나지 않는다. **자기 일 주변에 관료제를 짓는다** — 게이트, 레지스트리, traceability 매트릭스, 밸리데이터를 검증하는 밸리데이터 — 그리고 프로젝트의 남은 수명을 그 기계를 유지하는 데 쓴다. 결국 기계가 제품보다 커지고, 일 자체를 거부하기 시작한다.

sol-simplify는 그걸 멈추는 **마크다운 파일 하나**다. 플러그인도, 훅도, 설치 스크립트도 없다.

## Before / after

코드가 0줄이고 메인테이너가 1명인 프로젝트에 개발 프로세스를 설계해달라고 하면:

<table>
<tr><th>스킬 없이</th><th>sol-simplify</th></tr>
<tr valign="top"><td>

```
437줄 · 35섹션

품질 목표와 불변 조건
변경 단위와 개발 흐름 (자기 리뷰, 완료 정의)
위험 기반 품질 게이트
테스트 및 검증 구조 (정적/단위/계약/통합/E2E/실제공급자)
평가 도구 자체의 유효성 검증
CI 운영 모델 (PR 필수 검사, 야간 검사, CI 규율)
릴리스 절차 + 릴리스 후보 체크리스트
결함 분류와 대응
프로젝트 건강 지표
문서 유지
```

</td><td>

```
58줄 · 6섹션

전제와 품질 기준
개발 흐름
최소 제품 검증
평가 신뢰성
변경과 릴리스
```

> 혼자 작업할 때는 의례적인 자기 승인 PR을
> 요구하지 않는다.
>
> 한 번의 실수 때문에 새 문서나 전역 규칙을
> 추가하지 않는다.
>
> 검사가 제품 동작과 무관하게 실패하면
> 예외 절차를 만드는 대신 그 검사를
> 수정하거나 삭제한다.

</td></tr>
</table>

프롬프트에 스킬은 한 번도 언급되지 않았다. Codex가 스스로 찾아 적용했다.

## 실측된 실패

<p align="center">
  <img src="assets/hero.svg?v=3" width="900" alt="감사 대상 레포의 git 히스토리 라인 차트: 검증 기계 라인이 20일 내내 제품 라인을 앞서고, 6일차에 기계 13,090줄 대 제품 3,561줄, 17일차에 자기 규칙이 모든 작업을 거부, 최종 기계 20,280줄 대 제품 17,964줄.">
</p>

가설이 아니다. 에이전트가 20일간 만든 실제 레포의 git 히스토리 전수 측정:

| | |
|---|---|
| 검증 기계 | **20,280줄** |
| 제품 소스 | **17,964줄** |
| 거버넌스 파일 터치 : 제품 소스 터치 | **1,326 : 92** |
| 기계 유지보수 커밋 | **683개 중 223개 — 33%** |
| 고정된 개수(pin) 재동기화만 한 커밋 | **25개** (하루 13개) |
| 제품이 존재하기도 전(6일차) 기계 크기 | **13,090줄** |
| 자기가 쓴 규칙이 모든 작업을 막은 날 | **17일차** |

그 레포에서 가장 많이 수정된 파일 6개가 전부 검사 기계다. 첫 제품 소스 파일은 13번째에 나온다. 데드락은 커밋 로그에 에이전트 자신의 문장으로 남아 있다:

```
docs: say where acceptance is decided, because the rule as written refuses all work
```

그 레포의 개별 파일은 전부 멀쩡하다. 못 쓴 코드가 없다. *stdlib을 써라, 추상화를 줄여라, diff를 작게* — 코드 레벨 조언은 이 중 아무것도 못 막았다. 실패는 코드가 아니라 **프로젝트가 수명을 어디에 쓸지 정하는 층**에서 일어났기 때문이다.

## 작동 방식

```
1  선제 거버넌스     제품이 없는데 게이트·ADR·traceability·레지스트리부터
2  검사 증식         산출물마다 밸리데이터, 밸리데이터마다 계약 테스트, 계약마다 고정 기대값
3  자가 증폭         pin이 머지마다 깨짐 → 재동기화 커밋 → 병렬 작업이 또 깨뜨림 → 반복
4  자기 거부         자기가 쓴 절차가 자기 일을 거부
```

스킬은 4단계 전부를 다룬다. 3·4단계는 다른 어떤 도구도 다루지 않는 영역이고, 한 줄짜리 지시로 부족한 이유다 — 아래 대조군 참조.

모델에게 자기가 제조하는 것들의 어휘(`ceremony`, `machinery`, `pin`, `metatest`, `circular`), 산출물을 만들기 전과 검사를 추가하기 전의 판단 절차, 스스로를 설득할 때 쓰는 합리화 목록과 그 반박, 이미 루프 안에 있음을 알아채는 4가지 시그니처, 그리고 자기가 만든 게이트에서 탈출하는 규칙 하나를 준다.

남기기로 한 절차에는 제거 조건을 마킹한다:

```
sol-simplify: <존재 이유>, remove when <제거 조건>
```

제거 조건 없는 절차는 영원히 안 없어진다.

## 숫자

5개 시나리오, 3개 arm(없음 / 한 줄 지시 / 스킬), 셀당 n=1–3. **Ceremony**는 고정 루브릭 기준 0–10점 — 요청 없이 발명된 카테고리당 1점, 모든 점수는 라인 인용. 루브릭: [`benchmarks/RUBRIC.md`](benchmarks/RUBRIC.md) · 전체 채점: [`benchmarks/results/SCORES.md`](benchmarks/results/SCORES.md) · 원본 산출물: [`benchmarks/results/`](benchmarks/results/).

| 시나리오 | 없음 | 한 줄 지시 | **sol-simplify** |
|---|---|---|---|
| **01-prd** — 북마크 버튼 하나의 PRD | 374–440줄 · ceremony 4–5 | — | 116–169줄 · **ceremony 0** (n=3) |
| **02-process** — 0줄짜리 1인 프로젝트의 개발 프로세스 | 408–437줄 · ceremony 5–6 | 108–201줄 · ceremony 1–2 | 58–125줄 · **ceremony 0** (n=3) |
| **03-loop** — 자기 게이트에 갇힌 레포 | **재건축+증식** (6주 프로그램, 2인 승인 + 7일 만료 override) | **축소** (pin만 삭제, 14k줄 기계 존치) | **해체** (기계 삭제, 예외 경로 금지) |
| **04-guardrail** — 절차가 정당하게 필요한 상황 | 요청분 4/4 · ceremony 2 | — | **요청분 4/4 · ceremony 0** (n=2) |
| **05-incident** — 머지 사고 1건 | PR 템플릿 발명, AGENTS.md 성장 (2/2) | — | 회귀 테스트+CI만, 규칙 무변경 (2/2) |

스킬을 켠 모든 런의 ceremony: **12번 중 12번 0.** 스킬 자동 픽업: 프롬프트에 이름 언급 0회로 **12/12**.

합계 뒤에 숨은 디테일이 더 값지다.

- **PRD 베이스라인 3개가 독립적으로 똑같은 허구의 `p95 500ms` 목표를 발명했다.** 이 습성은 체계적이다. 우연이면 세 번 같은 숫자가 나올 수 없다.
- **프로세스 베이스라인 3개 중 2개가 자기 게이트에 대한 공식 면제(waiver) 정책을 작성했다** — 감사 대상 레포를 데드락시킨 바로 그 메커니즘. 한 줄 지시 arm도 하나 만들었다.
- **가드레일 시나리오에서 스킬은 요청된 항목 전부를 유지했다** — 체크리스트, 승인 절차, 롤백, 감사 기록, 실제 PCI DSS v4.0.1 컨트롤 매핑까지 — 그리고 자기 마커로 그것들을 *보호*했다: `sol-simplify: 독립 승인과 증적은 PCI DSS 6.5.1…을 위해 존재한다.` 요청된 절차를 자르는 건 결함이고, 벤치마크가 그걸 검사한다.

**한 줄 지시로 충분한 경우:** 널리 알려진 그 문장 — *"Make the smallest change that fully solves the task…"* — 은 문서 태스크의 분량 감소 대부분을 공짜로 얻는다. 이번 실측에서 못 한 것: 게이트 면제 절차를 만들었고, 14,000줄 승인 기계를 그대로 뒀다. 스킬의 가치는 3–4단계에 집중된다 — 실패의 축이 *크기*에서 *방향*으로 넘어가는 곳.

## 설치

마크다운 파일 하나다. 에이전트에 맞는 걸 골라라.

### Codex

플러그인으로 — 버전 관리·업데이트·스킬 2개 일괄:

```bash
codex plugin marketplace add MongLong0214/sol-simplify
codex plugin add sol-simplify@sol-simplify
```

의존성 0으로 — 파일만 넣으면 알아서 발동한다:

```bash
mkdir -p ~/.codex/skills/sol-simplify
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify/SKILL.md \
  -o ~/.codex/skills/sol-simplify/SKILL.md
```

### Claude Code

```
/plugin marketplace add MongLong0214/sol-simplify
/plugin install sol-simplify@sol-simplify
```

파일 복사도 된다:

```bash
mkdir -p ~/.claude/skills/sol-simplify
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify/SKILL.md \
  -o ~/.claude/skills/sol-simplify/SKILL.md
```

### 상시 적용 (AGENTS.md를 읽는 모든 에이전트)

```bash
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify/SKILL.md \
  >> ~/.codex/AGENTS.md
```

단, Codex는 병합된 지시 파일을 32 KiB에서 경고 없이 자르고, 상시 룰셋은 태스크와 무관하게 매 턴 토큰을 쓴다. 온디맨드 스킬이 더 나은 기본값이다.

### Cursor, Windsurf, Cline, Copilot, 기타

`skills/sol-simplify/SKILL.md`를 해당 도구의 rules/skills 디렉토리에 복사하면 된다. 표준 frontmatter가 붙은 순수 마크다운이다.

### 삭제

파일을 지우면 끝.

## 이미 병든 레포 진단

두 번째 스킬 [`skills/sol-simplify-audit`](skills/sol-simplify-audit/SKILL.md)은 진단용이다. ceremony ratio(기계 줄수 대 제품 줄수)를 측정하고, 아무것도 배송하지 않은 유지보수 커밋을 찾고, 삭제 대상을 랭킹해서 보고만 한다 — 파일은 건드리지 않는다.

```bash
mkdir -p ~/.codex/skills/sol-simplify-audit
curl -sL https://raw.githubusercontent.com/MongLong0214/sol-simplify/main/skills/sol-simplify-audit/SKILL.md \
  -o ~/.codex/skills/sol-simplify-audit/SKILL.md
```

그 다음: *"audit this repo for ceremony"*. 판단은 에이전트가 하고, 산수는 의존성 0의 POSIX 스크립트
([`scripts/measure.sh`](skills/sol-simplify-audit/scripts/measure.sh)) 하나가 한다 — ceremony ratio,
루프 커밋, churn을 HEAD에서 매번 새로 계산한다. 플러그인 설치 경로면 자동으로 따라온다.
이 레포의 유일한 실행 파일이고, 읽기만 한다.

## sol-simplify vs Ponytail

[Ponytail](https://github.com/DietrichGebert/ponytail)은 훌륭하고, 다른 문제를 푼다. 둘은 합성된다 — 같이 써라.

| | Ponytail | sol-simplify |
|---|---|---|
| 자르는 것 | 코드 | 절차 |
| 묻는 것 | *한 줄로 되나?* | *이 검사가 존재해야 하나?* |
| 잡는 것 | 구현체 하나뿐인 인터페이스 | 메인테이너 하나뿐인 게이트 레지스트리 |
| 놓치는 것 | 6,288줄짜리 traceability 매트릭스 | 손으로 만든 날짜 파서 |

## 절대 자르지 않는 것

정확성. 실제 동작을 검증하는 테스트. 신뢰 경계의 입력 검증. 데이터 손실을 막는 에러 핸들링. 보안. 접근성. 데이터 마이그레이션. 명시적으로 요청한 모든 것.

절제는 에이전트가 발명한 절차에만 적용되고, 제품의 실제 의무에는 적용되지 않는다. 02-process 런에서 스킬은 격리 테스트, provenance 기록, 자격증명 마스킹, 결정성 요건을 전부 유지하고 — 릴리스 체크리스트를 삭제했다.

## FAQ

**짧은 문서가 더 좋은 문서인가?**
아니고, 벤치마크도 그렇게 주장하지 않는다. 측정 축은 ceremony 카운트고 줄 수는 맥락으로만 병기한다. 산출물이 전부 커밋되어 있으니 직접 읽고 반박할 수 있다.

**왜 훅·인스톨러·런타임 코드가 없나?**
제조된 절차에 반대하는 도구가 절차를 제조하면 안 되니까. 페이로드는 에이전트가 스스로 집는(실측 12/12) 마크다운 파일 하나고, 추가된 것은 정적 JSON manifest 3개뿐이다 — `codex plugin add`와 `/plugin install`이 동작하게 할 뿐 아무것도 실행하지 않는다. 이 레포에 CONTRIBUTING.md가 없는 것도 같은 이유다.

**에이전트가 테스트를 건너뛰게 되지 않나?**
실측: 아니다. 사건 시나리오에서 모든 스킬 런이 근본 원인을 고치고 회귀 테스트를 추가했으며(한 런은 red→green까지 검증), 가드레일 시나리오에서 요청된 컨트롤을 두 번 다 4/4로 유지했다. 실제 테스트를 자르는 걸 본다면 그건 이슈 감이다.

**다른 모델에서도 되나?**
모른다. 이 실패 모드를 만드는 `gpt-5.6-sol`의 성향에 맞춰 작성·측정됐다. 다른 곳의 결과는 환영한다.

**감사 대상 레포는 공개인가?**
그렇다 — 숫자는 실제 오픈소스 프로젝트의 전체 git 히스토리에서 나왔고, `skills/sol-simplify-audit/SKILL.md`의 명령어로 재도출할 수 있다.

## 라이선스

MIT
