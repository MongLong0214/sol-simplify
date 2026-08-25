export function getUserOrders(db, userId) {
  const rows = db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  return rows;
}
