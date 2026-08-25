import { describe, expect, it } from 'vitest';

import { parseDuration } from './parse-duration.js';

describe('parseDuration', () => {
  it.each([
    ['250ms', 250],
    ['3s', 3_000],
    ['2m', 120_000],
    ['4h', 14_400_000],
    ['0s', 0],
  ])('converts %s to %d milliseconds', (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it.each(['', '10', '10d', '1.5s', '-1s', ' 10s', '10s '])(
    'throws for invalid input %j',
    (input) => {
      expect(() => parseDuration(input)).toThrow(`bad duration: ${input}`);
    },
  );
});
