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

  assert.deepEqual(getUserOrders(db, 'user-without-orders'), []);
});
