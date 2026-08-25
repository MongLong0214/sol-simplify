import { describe, expect, it } from 'vitest';

import { parseDuration } from './parse-duration.js';

describe('parseDuration', () => {
  it.each([
    ['15ms', 15],
    ['2s', 2_000],
    ['3m', 180_000],
    ['4h', 14_400_000],
    ['0s', 0],
  ])('converts %s to %i milliseconds', (input, expected) => {
    expect(parseDuration(input)).toBe(expected);
  });

  it.each([
    '',
    '10',
    '10d',
    '1.5s',
    '-1s',
    ' 10s',
    '10s ',
    '10S',
  ])('rejects invalid duration %j', (input) => {
    expect(() => parseDuration(input)).toThrow(`bad duration: ${input}`);
  });
});
