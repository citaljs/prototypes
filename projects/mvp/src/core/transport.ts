type TransportState = "playing" | "paused" | "stopped";
type TransportEvent = "play" | "pause" | "stop" | "positionChanged";

export class Transport {
  private state: TransportState = "stopped";
  private currentTicks = 0;
  private currentSeconds = 0;
  private previousTime = 0;
  private bpm = 120;
  private ppq = 480;
  private timerId: number | null = null;
  private readonly intervalTime: number = 50;
  private listeners: Partial<
    Record<
      TransportEvent,
      Array<(currentTicks: number, state: TransportState) => void>
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

  private notifyListeners(event: TransportEvent) {
    if (!this.listeners[event]) {
      return;
    }

    for (const listener of this.listeners[event]) {
      listener(this.currentTicks, this.state);
    }
  }

  on(
    event: TransportEvent,
    listener: (currentTicks: number, state: TransportState) => void,
  ) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  private startTimer() {
    this.previousTime = performance.now();
    this.timerId = window.setInterval(() => {
      const timestamp = performance.now();

      const deltaTime = timestamp - this.previousTime;
      const deltaTicks = Math.max(
        0,
        Math.round((deltaTime / 60000) * this.bpm * this.ppq),
      );

      this.currentTicks += deltaTicks;
      this.currentSeconds += deltaTime / 1000;

      this.notifyListeners("positionChanged");

      this.previousTime = timestamp;

      if (this.currentTicks >= this.debug__nextCurrentTicks) {
        console.debug("Current ticks: ", this.currentTicks);
        this.debug__nextCurrentTicks += 480;
      }
    }, this.intervalTime);
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
