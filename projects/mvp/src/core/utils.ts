import { type BPM, type Milliseconds, type PPQ, Seconds, Ticks } from "./types";

/**
 * Checks if a number is a power of two.
 *
 * @param {number} n The number to check.
 * @returns {boolean} True if `n` is a power of two; otherwise, false.
 */
export const isPowerOfTwo = (n: number): boolean => {
  return n !== 0 && (n & (n - 1)) === 0;
};

/**
 * Convert ticks into seconds.
 */
export const ticksToSeconds = (ticks: Ticks, bpm: BPM, ppq: PPQ): Seconds => {
  return new Seconds((ticks.value * (60 / bpm.value)) / ppq.value);
};

/**
 * Convert ticks into mill seconds.
 */
export const ticksToMilliseconds = (
  ticks: Ticks,
  bpm: BPM,
  ppq: PPQ,
): Milliseconds => {
  return ticksToSeconds(ticks, bpm, ppq).toMilliseconds();
};

/**
 * Convert seconds to ticks.
 */
export const secondsToTicks = (seconds: Seconds, bpm: BPM, ppq: PPQ): Ticks => {
  return new Ticks(Math.floor((seconds.value / (60 / bpm.value)) * ppq.value));
};

/**
 * Convert mill seconds to ticks.
 */
export const millisecondsToTicks = (
  milliseconds: Milliseconds,
  bpm: BPM,
  ppq: PPQ,
): Ticks => {
  return secondsToTicks(milliseconds.toSeconds(), bpm, ppq);
};
