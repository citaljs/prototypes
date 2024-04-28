export class SineWaveSynthesizerProcessor extends AudioWorkletProcessor {
    constructor() {
        super(...arguments);
        Object.defineProperty(this, "phase1", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "phase2", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "phase3", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: 0
        });
        Object.defineProperty(this, "frequencies", {
            enumerable: true,
            configurable: true,
            writable: true,
            value: [440, 554.365, 659.255]
        });
    }
    process(_inputs, outputs, _parameters) {
        const output = outputs[0];
        const outputChannel = output[0];
        const numVoices = this.frequencies.length;
        for (let i = 0; i < outputChannel.length; i++) {
            const sample1 = Math.sin(this.phase1);
            const sample2 = Math.sin(this.phase2);
            const sample3 = Math.sin(this.phase3);
            outputChannel[i] = (sample1 + sample2 + sample3) / numVoices;
            this.phase1 += (this.frequencies[0] * 2 * Math.PI) / sampleRate;
            this.phase2 += (this.frequencies[1] * 2 * Math.PI) / sampleRate;
            this.phase3 += (this.frequencies[2] * 2 * Math.PI) / sampleRate;
            if (this.phase1 > 2 * Math.PI)
                this.phase1 -= 2 * Math.PI;
            if (this.phase2 > 2 * Math.PI)
                this.phase2 -= 2 * Math.PI;
            if (this.phase3 > 2 * Math.PI)
                this.phase3 -= 2 * Math.PI;
        }
        return true;
    }
}
registerProcessor("sine-wave-synthesizer-processor", SineWaveSynthesizerProcessor);
