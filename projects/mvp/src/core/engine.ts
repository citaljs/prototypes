import { NoteStore } from "./note";
import { Scheduler, type SchedulerObserver } from "./scheduler";
import { SineSynthesizer } from "./synthesizer";
import { Transport } from "./transport";

export class Engine {
  private transport: Transport;
  private scheduler: Scheduler;
  private synthesizer: SchedulerObserver;
  private store: NoteStore;

  constructor() {
    this.transport = new Transport(120, 480);
    this.store = new NoteStore();
    this.scheduler = new Scheduler(this.transport, this.store);
    this.synthesizer = new SineSynthesizer(new AudioContext());
    this.scheduler.addObserver(this.synthesizer);
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
