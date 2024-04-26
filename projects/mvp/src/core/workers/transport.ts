import type { Transport } from "../transport";
import type { BPM, PPQ, Seconds, Ticks } from "../types";
import Worker from "./transport-worker?worker";

export type WorkerTransport = {
  [K in keyof Transport]: Transport[K] extends (...args: infer Args) => infer R
    ? (...args: Args) => R extends void ? R : Promise<R>
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
    throw new Error("Method not implemented.");

    // biome-ignore lint/correctness/noUnreachable: <explanation>
    return new Promise<"playing">((resolve) => {
      resolve("playing");
    });
  }

  getCurrentTicks() {
    this.worker.postMessage({ type: "getCurrentTicks" });

    return new Promise<Ticks>((resolve) => {
      this.worker.onmessage = (event) => {
        console.log("worker received message", event);

        const { data } = event;

        if (data.type === "getCurrentTicks") {
          resolve(data.ticks as Ticks);
        }
      };
    });
  }

  getCurrentSeconds() {
    this.worker.postMessage({ type: "getCurrentTicks" });

    return new Promise<Seconds>((resolve) => {
      this.worker.onmessage = (event) => {
        console.log("worker received message", event);

        const { data } = event;

        if (data.type === "getCurrentTicks") {
          resolve(data.seconds as Seconds);
        }
      };
    });
  }

  getBpm() {
    this.worker.postMessage({ type: "getBpm" });

    return new Promise<BPM>((resolve) => {
      this.worker.onmessage = (event) => {
        console.log("worker received message", event);

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
        console.log("worker received message", event);

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
