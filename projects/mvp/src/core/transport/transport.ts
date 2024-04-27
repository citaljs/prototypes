import { BPM, Milliseconds, PPQ, Seconds, Ticks } from "../types";
import { millisecondsToTicks } from "../utils";

export type PlayingState = "playing" | "stopped" | "paused";

export interface Transport {
  play(): void;
  pause(): void;
  stop(): void;
  getPlayingState(): PlayingState;
  getCurrentTicks(): Ticks;
  getCurrentSeconds(): Seconds;
  getBpm(): BPM;
  setBpm(bpm: BPM): void;
  getPpq(): PPQ;
  setPpq(ppq: PPQ): void;
}

class TransportImpl implements Transport {
  private currentTicks: Ticks = new Ticks(0);
  private currentSeconds: Seconds = new Seconds(0);
  private bpm: BPM = new BPM(120);
  private ppq: PPQ = new PPQ(960);
  private playingState: PlayingState = "stopped";
  private prevTime?: Milliseconds = undefined;
  private intervalId?: number = undefined;

  private updateTime() {
    const timestamp = new Milliseconds(performance.now());
    if (this.prevTime === undefined) {
      this.prevTime = timestamp;
    }

    const deltaTime = timestamp.saturatingSub(this.prevTime);
    const deltaTicks = new Ticks(
      Math.max(0, millisecondsToTicks(deltaTime, this.bpm, this.ppq).value),
    );

    this.currentTicks = this.currentTicks.add(deltaTicks);
    this.currentSeconds = this.currentSeconds.add(deltaTime.toSeconds());

    this.prevTime = timestamp;
  }

  play() {
    if (this.playingState === "playing") {
      console.warn("Transport is already playing.");
      return;
    }

    this.playingState = "playing";
    this.prevTime = new Milliseconds(performance.now());

    this.intervalId = setInterval(() => {
      this.updateTime();
    }, 50);
  }

  pause() {
    if (this.playingState !== "playing") {
      console.warn("Transport is not playing.");
      return;
    }

    this.playingState = "paused";

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  stop() {
    if (this.playingState === "stopped") {
      console.warn("Transport is already stopped.");
      return;
    }

    this.playingState = "stopped";

    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }

    this.currentTicks = new Ticks(0);
    this.currentSeconds = new Seconds(0);
    this.prevTime = undefined;
  }

  getPlayingState() {
    return this.playingState;
  }

  getCurrentTicks() {
    return this.currentTicks;
  }

  getCurrentSeconds() {
    return this.currentSeconds;
  }

  getBpm(): BPM {
    return this.bpm;
  }

  setBpm(bpm: BPM): void {
    this.bpm = bpm;
  }

  getPpq(): PPQ {
    return this.ppq;
  }

  setPpq(ppq: PPQ): void {
    this.ppq = ppq;
  }
}

export function createTransport(): Transport {
  return new TransportImpl();
}
