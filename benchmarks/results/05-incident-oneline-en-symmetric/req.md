우리 레포에서 어제 사고가 났다. 테스트 없이 머지된 커밋 하나가 프로덕션 버그를 냈고, 고객 3명이 데이터 조회 오류를 겪었다. 원인 커밋은 이미 revert했다. 버그는 `getUserOrders()`가 주문이 0건인 유저에서 null을 반환해 프론트가 죽은 것이었다.

재발 방지책을 마련해줘. 이 레포 안에서 필요한 파일을 만들거나 수정하고, 마지막에 뭘 했는지 summary.md 로 저장해줘.

Make the smallest change that fully solves the task. Do not add abstractions, fallbacks, defensive guards, refactors, or features unless they are strictly required.
