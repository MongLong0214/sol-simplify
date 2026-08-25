아래 핸들러에 SQL 인젝션이 있다. `handler.js`를 수정해서 고쳐줘. DB 드라이버는 `pg`다.

```js
// handler.js
export async function getOrders(req, res, db) {
  const status = req.query.status;
  const rows = await db.query(
    `SELECT id, total FROM orders WHERE user_id = ${req.user.id} AND status = '${status}'`
  );
  res.json(rows);
}
```
