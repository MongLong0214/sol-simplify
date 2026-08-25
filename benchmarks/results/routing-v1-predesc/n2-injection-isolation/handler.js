export async function getOrders(req, res, db) {
  const status = req.query.status;
  const rows = await db.query(
    "SELECT id, total FROM orders WHERE user_id = $1 AND status = $2",
    [req.user.id, status]
  );
  res.json(rows);
}
