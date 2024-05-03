type TransportState = "playing" | "paused" | "stopped";
type TransportEvent = "play" | "pause" | "stop" | "positionChanged";

export class Transport {
  private state: TransportState = "stopped";
  private currentTicks = 0;
  private bpm = 120;
  private ppq = 480;
  private timerId: number | null = null;
  private listeners: Partial<
    Record<TransportEvent, Array<(currentTicks: number) => void>>
  > = {};

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
      listener(this.currentTicks);
    }
  }

  on(event: TransportEvent, listener: (currentTicks: number) => void) {
    if (!this.listeners[event]) {
      this.listeners[event] = [];
    }
    this.listeners[event].push(listener);
  }

  private startTimer() {
    const ticksPerMinute = this.bpm * this.ppq;
    const interval = 60000 / ticksPerMinute;

    this.timerId = window.setInterval(() => {
      if (this.currentTicks % this.ppq === 0) {
        console.debug(this.currentTicks);
      }

      this.currentTicks += 1;
      this.notifyListeners("positionChanged");
    }, interval);
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
