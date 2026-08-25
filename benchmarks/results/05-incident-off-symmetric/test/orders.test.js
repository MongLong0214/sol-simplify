import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserOrders } from '../src/orders.js';

test('getUserOrders returns an empty array when the user has no orders', () => {
  const db = {
    query(sql, params) {
      assert.equal(sql, 'SELECT * FROM orders WHERE user_id = ?');
      assert.deepEqual(params, ['user-with-no-orders']);
      return [];
    },
  };

  const orders = getUserOrders(db, 'user-with-no-orders');

  assert.ok(Array.isArray(orders));
  assert.deepEqual(orders, []);
  assert.doesNotThrow(() => orders.map((order) => order.id));
});

test('getUserOrders returns the orders provided by the database', () => {
  const rows = [
    { id: 'order-1', user_id: 'user-1' },
    { id: 'order-2', user_id: 'user-1' },
  ];
  const db = { query: () => rows };

  assert.strictEqual(getUserOrders(db, 'user-1'), rows);
});
