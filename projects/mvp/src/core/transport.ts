type TransportState = "playing" | "paused" | "stopped";
type TransportEvent = "play" | "pause" | "stop" | "positionChanged" | "loop";

interface TicksRange {
  start: number;
  end: number;
}

export interface Loop {
  enabled: boolean;
  range: TicksRange;
}

export class Transport {
  private state: TransportState = "stopped";
  private currentTicks = 0;
  private currentSeconds = 0;
  private previousTime?: number = undefined;
  private bpm = 120;
  private ppq = 480;
  private loop: Loop = {
    enabled: false,
    range: {
      start: 0,
      end: 480 * 4,
    },
  };
  private timerId: number | null = null;
  private readonly intervalTime: number = 50;
  private listeners: Partial<
    Record<
      TransportEvent,
      Array<
        (
          currentTicks: number,
          bpm: number,
          ppq: number,
          state: TransportState,
          loop: Loop,
        ) => void
      >
    >
  > = {};
  private debug__nextCurrentTicks = 0;

  constructor(bpm = 120, ppq = 480) {
    this.bpm = bpm;
    this.ppq = ppq;
  }

  play() {
    if (this.state === "stopped" || this.state === "paused") {
      console.debug("Playing");

      this.state = "playing";
      this.startTimer();
      this.notifyListeners("play");
    }
  }

  pause() {
    if (this.state === "playing") {
      console.debug("Paused");

      this.state = "paused";
      this.stopTimer();
      this.notifyListeners("pause");
    }
  }

  stop() {
    if (this.state !== "stopped") {
      console.debug("Stopped");

      this.state = "stopped";
      this.currentTicks = 0;
      this.currentSeconds = 0;
      this.debug__nextCurrentTicks = 0;
      this.stopTimer();
      this.notifyListeners("stop");
      this.notifyListeners("positionChanged");
    }
  }

  toggleLoop() {
    this.loop.enabled = !this.loop.enabled;
  }

  setLoopRange(range: TicksRange) {
    this.loop.range = range;
  }

  private notifyListeners(event: TransportEvent) {
    if (!this.listeners[event]) {
      return;
    }

    for (const listener of this.listeners[event]) {
      listener(this.currentTicks, this.bpm, this.ppq, this.state, this.loop);
    }
  }

  on(
    event: TransportEvent,
    listener: (
      currentTicks: number,
      bpm: number,
      ppq: number,
      state: TransportState,
      loop: Loop,
    ) => void,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  private startTimer() {
    this.previousTime = undefined;
    this.timerId = window.setInterval(
      () => this.updateTimer(),
      this.intervalTime,
    );
  }

  private updateTimer() {
    const timestamp = performance.now();
    if (this.previousTime === undefined) {
      this.previousTime = timestamp;
    }

    const deltaTime = timestamp - this.previousTime;
    const deltaTicks = Math.max(
      0,
      Math.round((deltaTime / 60000) * this.bpm * this.ppq),
    );

    this.currentTicks += deltaTicks;
    this.currentSeconds += deltaTime / 1000;

    if (this.loop.enabled && this.currentTicks >= this.loop.range.end) {
      this.currentTicks = this.loop.range.start;
      this.currentSeconds = (this.currentTicks / this.ppq) * (60 / this.bpm);
      this.notifyListeners("loop");
    }

    this.notifyListeners("positionChanged");

    this.previousTime = timestamp;

    if (this.currentTicks >= this.debug__nextCurrentTicks) {
      console.debug("Current ticks: ", this.currentTicks);

      if (this.loop.enabled && this.currentTicks >= this.loop.range.end) {
        this.debug__nextCurrentTicks = this.loop.range.start;
      } else {
        this.debug__nextCurrentTicks += 480;
      }
    }
  }

  private stopTimer() {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  setBpm(bpm: number) {
    console.debug(`Set BPM: ${bpm}`);

    this.bpm = bpm;
    if (this.state === "playing") {
      this.stopTimer();
      this.startTimer();
    }
  }

  setPpq(ppq: number) {
    console.debug(`Set PPQ: ${ppq}`);

    this.ppq = ppq;
    if (this.state === "playing") {
      this.stopTimer();
      this.startTimer();
    }
  }
}
