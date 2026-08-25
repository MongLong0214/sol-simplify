# 재발 방지 작업 요약

## 확인한 문제

- 기존 `getUserOrders()`는 조회 결과가 빈 배열이면 `null`로 바꿔 반환하고 있었습니다.
- `npm test`는 성공했지만 실행된 테스트가 0개라서 이 회귀를 잡지 못했습니다.

## 변경 사항

- `src/orders.js`: 주문이 없는 사용자에게도 DB 조회 결과인 빈 배열을 그대로 반환하도록 수정했습니다.
- `test/orders.test.js`: 주문 0건일 때 빈 배열을 반환하는 회귀 테스트와 주문이 있을 때의 정상 동작 테스트를 추가했습니다.
- `.github/workflows/test.yml`: 모든 PR과 `main` 브랜치 push에서 `npm test`를 실행하도록 GitHub Actions를 추가했습니다.

## 검증 결과

- `npm test`: 2개 테스트 모두 통과
- 주문 0건 직접 실행 결과: `[]`, `Array.isArray(result) === true`

## 저장소 밖에서 필요한 설정

GitHub의 `main` 브랜치 보호 규칙에서 이 워크플로의 `test` 상태 검사를 필수로 지정해야 테스트 실패 시 실제 머지를 막을 수 있습니다. 저장소 파일만으로는 이 설정을 강제할 수 없습니다.
