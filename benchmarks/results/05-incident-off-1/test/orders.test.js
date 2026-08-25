import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getUserOrders } from '../src/orders.js';

describe('getUserOrders', () => {
  it('returns an empty array when the user has no orders', () => {
    const db = {
      query(sql, params) {
        assert.equal(sql, 'SELECT * FROM orders WHERE user_id = ?');
        assert.deepEqual(params, ['user-without-orders']);
        return [];
      },
    };

    const orders = getUserOrders(db, 'user-without-orders');

    assert.deepEqual(orders, []);
    assert.ok(Array.isArray(orders));
  });

  it('returns the orders returned by the database', () => {
    const expectedOrders = [
      { id: 'order-1', user_id: 'user-1' },
      { id: 'order-2', user_id: 'user-1' },
    ];
    const db = { query: () => expectedOrders };

    const orders = getUserOrders(db, 'user-1');

    assert.strictEqual(orders, expectedOrders);
  });
});
