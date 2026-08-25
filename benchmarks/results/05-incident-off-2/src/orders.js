/**
 * Fetches a user's orders.
 *
 * @returns {Array<object>} The user's orders, or an empty array when none exist.
 */
export function getUserOrders(db, userId) {
  return db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
}
