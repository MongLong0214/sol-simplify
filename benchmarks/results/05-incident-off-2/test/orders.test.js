import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserOrders } from '../src/orders.js';

test('getUserOrders returns an empty array when the user has no orders', () => {
  const db = {
    query(sql, params) {
      assert.equal(sql, 'SELECT * FROM orders WHERE user_id = ?');
      assert.deepEqual(params, ['user-without-orders']);
      return [];
    },
  };

  const orders = getUserOrders(db, 'user-without-orders');

  assert.deepEqual(orders, []);
  assert.notEqual(orders, null);
});

test('getUserOrders returns the orders found for the user', () => {
  const expectedOrders = [
    { id: 'order-1', user_id: 'user-with-orders' },
    { id: 'order-2', user_id: 'user-with-orders' },
  ];
  const db = {
    query() {
      return expectedOrders;
    },
  };

  assert.strictEqual(getUserOrders(db, 'user-with-orders'), expectedOrders);
});
