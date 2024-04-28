export class SineWaveSynthesizerNode extends AudioWorkletNode {
  constructor(context: AudioContext) {
    super(context, "sine-wave-synthesizer-processor");
  }

  onmessage(event: MessageEvent): void {
    const data = event.data;
    this.port.postMessage(data);
  }
}
