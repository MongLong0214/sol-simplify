import { describe, expect, it } from 'vitest';

import { parseDuration } from './parse-duration.js';

describe('parseDuration', () => {
  it.each([
    ['12ms', 12],
    ['3s', 3_000],
    ['5m', 300_000],
    ['2h', 7_200_000],
  ])('converts %s to milliseconds', (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it('accepts zero as the lower boundary', () => {
    expect(parseDuration('0ms')).toBe(0);
  });

  it.each(['', '10', '10d', '-1s', '1.5s', ' 1s', '1s '])(
    'rejects invalid duration %j',
    (input) => {
      expect(() => parseDuration(input)).toThrow(`bad duration: ${input}`);
    },
  );
});
