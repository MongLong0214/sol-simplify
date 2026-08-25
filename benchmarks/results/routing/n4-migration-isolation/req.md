`orders` 테이블에 `currency` 컬럼을 NOT NULL로 추가해야 한다. 기존 행은 전부 `'KRW'`로 채우면 된다.
PostgreSQL 마이그레이션 파일 하나 써줘. 파일명은 `0007_orders_currency.sql`.
