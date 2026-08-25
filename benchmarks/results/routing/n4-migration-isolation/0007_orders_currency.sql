BEGIN;

ALTER TABLE orders
    ADD COLUMN currency VARCHAR(3);

UPDATE orders
SET currency = 'KRW';

ALTER TABLE orders
    ALTER COLUMN currency SET NOT NULL;

COMMIT;
