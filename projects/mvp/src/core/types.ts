/**
 * Ticks are the basic subunit of the Transport. They are
 * the smallest unit of time that the Transport supports.
 */
export class Ticks {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 0) {
      throw new Error(
        `Invalid ticks: ${value}. Please pass an positive integer value.`,
      );
    }

    this.value = value;
  }

  add(other: Ticks): Ticks {
    return new Ticks(this.value + other.value);
  }

  sub(other: Ticks): Ticks | undefined {
    const calculated = this.value - other.value;
    if (calculated < 0) {
      return undefined;
    }
    return new Ticks(this.value - other.value);
  }

  saturatingSub(other: Ticks): Ticks {
    return new Ticks(Math.max(0, this.value - other.value));
  }
}

/**
 * A number representing a time in seconds
 */
export class Seconds {
  readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error(
        `Invalid seconds: ${value}. Please pass an positive value.`,
      );
    }

    this.value = value;
  }

  toMilliseconds(): Milliseconds {
    return new Milliseconds(this.value * 1000);
  }

  add(other: Seconds): Seconds {
    return new Seconds(this.value + other.value);
  }

  sub(other: Seconds): Seconds | undefined {
    const calculated = this.value - other.value;
    if (calculated < 0) {
      return undefined;
    }
    return new Seconds(calculated);
  }

  saturatingSub(other: Seconds): Seconds {
    return new Seconds(Math.max(0, this.value - other.value));
  }
}

/**
 * One millisecond is a thousandth of a second.
 */
export class Milliseconds {
  readonly value: number;

  constructor(value: number) {
    if (value < 0) {
      throw new Error(
        `Invalid milliseconds: ${value}. Please pass an positive value.`,
      );
    }

    this.value = value;
  }

  toSeconds(): Seconds {
    return new Seconds(this.value / 1000);
  }

  add(other: Milliseconds): Milliseconds {
    return new Milliseconds(this.value + other.value);
  }

  sub(other: Milliseconds): Milliseconds | undefined {
    const calculated = this.value - other.value;
    if (calculated < 0) {
      return undefined;
    }
    return new Milliseconds(calculated);
  }

  saturatingSub(other: Milliseconds): Milliseconds {
    return new Milliseconds(Math.max(0, this.value - other.value));
  }
}

/**
 * Pulses per quarter (note)
 */
export class PPQ {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `Invalid ppq: ${value}. Please pass an integer greater than or equal to 1.`,
      );
    }

    this.value = value;
  }
}

/**
 * Beats per minute
 */
export class BPM {
  readonly value: number;

  constructor(value: number) {
    if (!Number.isInteger(value) || value < 1) {
      throw new Error(
        `Invalid bpm: ${value}. Please pass an integer greater than or equal to 1.`,
      );
    }

    this.value = value;
  }
}
