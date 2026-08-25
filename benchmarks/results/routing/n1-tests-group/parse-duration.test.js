import { describe, expect, it } from 'vitest';

import { parseDuration } from './parse-duration.js';

describe('parseDuration', () => {
  it.each([
    ['1ms', 1],
    ['2s', 2_000],
    ['3m', 180_000],
    ['4h', 14_400_000],
  ])('converts %s to milliseconds', (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it('accepts zero as the lower boundary', () => {
    expect(parseDuration('0ms')).toBe(0);
  });

  it.each(['', '10', '-1s', '1.5s', '1d', ' 1s', '1s '])(
    'rejects an invalid duration: %j',
    (input) => {
      expect(() => parseDuration(input)).toThrow(`bad duration: ${input}`);
    },
  );
});
