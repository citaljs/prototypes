import type { Engine } from "../core/engine";

export class Transport {
  private playButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private stopButton: HTMLButtonElement;

  constructor(
    private container: HTMLElement,
    private engine: Engine,
  ) {
    this.playButton = document.createElement("button");
    this.pauseButton = document.createElement("button");
    this.stopButton = document.createElement("button");
    this.render();
  }

  render() {
    this.playButton.textContent = "Play";
    this.playButton.onclick = () => this.engine.play();

    this.pauseButton.textContent = "Pause";
    this.pauseButton.onclick = () => this.engine.pause();

    this.stopButton.textContent = "Stop";
    this.stopButton.onclick = () => this.engine.stop();

    this.container.appendChild(this.playButton);
    this.container.appendChild(this.pauseButton);
    this.container.appendChild(this.stopButton);
  }
}
