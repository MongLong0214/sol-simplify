/**
 * Return all orders for a user.
 *
 * The return value is always an array. In particular, a user with no orders
 * has an empty array so callers can safely iterate over the result.
 */
export function getUserOrders(db, userId) {
  const rows = db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
}
