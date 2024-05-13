import type { NoteOn } from "../core/note";
import type { Synthesizer, SynthesizerGUI, SynthesizerProcessor } from "./base";

interface SamplerParameters {
  sampleFile?: File;
}

type SamplerParameterId = keyof SamplerParameters;

class SamplerProcessor implements SynthesizerProcessor {
  private audioContext: AudioContext;
  private buffer?: AudioBuffer;
  private sourceNode?: AudioBufferSourceNode;
  private parameters: SamplerParameters = {};

  constructor(audioContext: AudioContext) {
    this.audioContext = audioContext;
  }

  playNote(_: NoteOn, delayTime = 0) {
    if (this.buffer) {
      this.sourceNode = this.audioContext.createBufferSource();
      this.sourceNode.buffer = this.buffer;
      this.sourceNode.connect(this.audioContext.destination);
      this.sourceNode.start(this.audioContext.currentTime + delayTime);
    }
  }

  stopNote() {}

  onStop() {
    if (this.sourceNode) {
      this.sourceNode.stop();
      this.sourceNode.disconnect();
    }
  }

  onPause() {
    this.onStop();
  }

  setParameter(
    id: SamplerParameterId,
    value: SamplerParameters[SamplerParameterId],
  ): void {
    this.parameters[id] = value;
    this.onParameterChange(id, value);
  }

  getParameter(id: SamplerParameterId) {
    return this.parameters[id];
  }

  private onParameterChange(
    id: SamplerParameterId,
    value: SamplerParameters[SamplerParameterId],
  ) {
    if (id === "sampleFile" && value) {
      this.loadSample(value);
    }
  }

  private async loadSample(file: File) {
    const arrayBuffer = await file.arrayBuffer();
    this.buffer = await this.audioContext.decodeAudioData(arrayBuffer);
  }
}

class SamplerGUI implements SynthesizerGUI {
  constructor(private processor: SamplerProcessor) {}

  create(container: HTMLElement) {
    const fragment = document.createDocumentFragment();

    const input = document.createElement("input");
    input.type = "file";
    input.addEventListener("change", () => {
      const file = input.files?.[0];
      if (file) {
        this.processor.setParameter("sampleFile", file);
      }
    });
    fragment.appendChild(input);

    const button = document.createElement("button");
    button.textContent = "Play sample";
    button.addEventListener("click", () => {
      this.processor.playNote({
        noteId: "sample",
        ticks: 0,
        pitch: 60,
        velocity: 127,
      });
    });
    fragment.appendChild(button);

    container.appendChild(fragment);
  }
}

export class SamplerSynthesizer implements Synthesizer {
  processor: SamplerProcessor;
  gui: SamplerGUI;

  constructor(audioContext: AudioContext) {
    this.processor = new SamplerProcessor(audioContext);
    this.gui = new SamplerGUI(this.processor);
  }
}
