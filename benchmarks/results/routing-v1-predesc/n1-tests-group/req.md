아래 함수의 유닛 테스트를 `parse-duration.test.js`에 작성해줘. 프로젝트는 Vitest를 쓴다.

```js
// parse-duration.js
export function parseDuration(s) {
  const m = /^(\d+)(ms|s|m|h)$/.exec(s);
  if (!m) throw new Error(`bad duration: ${s}`);
  const n = Number(m[1]);
  return n * { ms: 1, s: 1000, m: 60000, h: 3600000 }[m[2]];
}
```
