export function getUserOrders(db, userId) {
  return db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
}
