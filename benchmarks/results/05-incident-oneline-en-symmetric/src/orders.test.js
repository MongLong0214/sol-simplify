import assert from 'node:assert/strict';
import test from 'node:test';

import { getUserOrders } from './orders.js';

test('returns an empty array when the user has no orders', () => {
  const db = { query: () => [] };

  assert.deepEqual(getUserOrders(db, 'user-with-no-orders'), []);
});
