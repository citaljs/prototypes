import type { PlayingState, Transport } from "../transport";
import type { BPM, PPQ, Seconds, Ticks } from "../types";
import Worker from "./transport-worker?worker";

export type WorkerTransport = {
  [K in keyof Transport]: Transport[K] extends (...args: infer Args) => infer R
    ? (
        ...args: Args
      ) => R extends void
        ? R
        : R extends PlayingState
          ? Promise<PlayingState>
          : Promise<R>
    : never;
};

class WorkerTransportImpl implements WorkerTransport {
  private readonly worker = new Worker();

  play(): void {
    this.worker.postMessage({ type: "play" });
  }

  pause(): void {
    this.worker.postMessage({ type: "pause" });
  }

  stop(): void {
    this.worker.postMessage({ type: "stop" });
  }

  getPlayingState() {
    this.worker.postMessage({ type: "getPlayingState" });

    return new Promise<PlayingState>((resolve) => {
      this.worker.onmessage = (event) => {
        const { data } = event;

        if (data.type === "getPlayingState") {
          resolve(data.playingState as PlayingState);
        }
      };
    });
  }

  getCurrentTicks() {
    this.worker.postMessage({ type: "getCurrentTicks" });

    return new Promise<Ticks>((resolve) => {
      this.worker.onmessage = (event) => {
        const { data } = event;

        if (data.type === "getCurrentTicks") {
          resolve(data.currentTicks as Ticks);
        }
      };
    });
  }

  getCurrentSeconds() {
    this.worker.postMessage({ type: "getCurrentTicks" });

    return new Promise<Seconds>((resolve) => {
      this.worker.onmessage = (event) => {
        const { data } = event;

        if (data.type === "getCurrentTicks") {
          resolve(data.currentSeconds as Seconds);
        }
      };
    });
  }

  getBpm() {
    this.worker.postMessage({ type: "getBpm" });

    return new Promise<BPM>((resolve) => {
      this.worker.onmessage = (event) => {
        const { data } = event;

        if (data.type === "getBpm") {
          resolve(data.bpm as BPM);
        }
      };
    });
  }

  setBpm(bpm: BPM) {
    this.worker.postMessage({ type: "setBpm", bpm });
  }

  getPpq() {
    this.worker.postMessage({ type: "getPpq" });

    return new Promise<PPQ>((resolve) => {
      this.worker.onmessage = (event) => {
        const { data } = event;

        if (data.type === "getPpq") {
          resolve(data.ppq as PPQ);
        }
      };
    });
  }

  setPpq(ppq: PPQ) {
    this.worker.postMessage({ type: "setPpq", ppq });
  }
}

export function createWorkerTransport() {
  return new WorkerTransportImpl();
}
