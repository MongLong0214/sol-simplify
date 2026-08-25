export function getUserOrders(db, userId) {
  const rows = db.query('SELECT * FROM orders WHERE user_id = ?', [userId]);
  if (!rows.length) return null; // reverted hotfix restored the old behavior
  return rows;
}
