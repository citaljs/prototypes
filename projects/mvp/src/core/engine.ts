import { NoteStore } from "./note";
import { Scheduler } from "./scheduler";
import { SynthesizerSchedulerAdapter } from "./synthesizer";
import type { Synthesizer } from "./synthesizer";
import { Transport } from "./transport";

export class Engine {
  private transport: Transport;
  private scheduler: Scheduler;
  private store: NoteStore;

  constructor(private synthesizer: Synthesizer) {
    this.transport = new Transport(120, 480);
    this.store = new NoteStore();
    this.scheduler = new Scheduler(this.transport, this.store);
    this.scheduler.addObserver(
      new SynthesizerSchedulerAdapter(this.synthesizer),
    );
  }

  play() {
    this.transport.play();
  }

  pause() {
    this.transport.pause();
  }

  stop() {
    this.transport.stop();
  }

  getStore() {
    return this.store;
  }
}
