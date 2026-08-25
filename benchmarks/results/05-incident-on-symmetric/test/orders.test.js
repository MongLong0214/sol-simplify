import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserOrders } from '../src/orders.js';

test('getUserOrders returns an empty array when the user has no orders', () => {
  const db = { query: () => [] };

  assert.deepEqual(getUserOrders(db, 'user-without-orders'), []);
});

test('getUserOrders returns the orders from the database', () => {
  const orders = [{ id: 1 }, { id: 2 }];
  const db = { query: () => orders };

  assert.strictEqual(getUserOrders(db, 'user-with-orders'), orders);
});
