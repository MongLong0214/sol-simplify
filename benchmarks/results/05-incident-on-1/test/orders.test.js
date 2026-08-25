import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserOrders } from '../src/orders.js';

test('getUserOrders returns an empty array when the user has no orders', () => {
  const db = {
    query() {
      return [];
    },
  };

  assert.deepEqual(getUserOrders(db, 'user-without-orders'), []);
});

test('getUserOrders returns the orders returned by the database', () => {
  const orders = [{ id: 'order-1', user_id: 'user-with-orders' }];
  const db = {
    query() {
      return orders;
    },
  };

  assert.equal(getUserOrders(db, 'user-with-orders'), orders);
});
