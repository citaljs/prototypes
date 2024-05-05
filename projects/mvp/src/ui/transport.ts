import type { Engine } from "../core/engine";

export class Transport {
  private root: HTMLDivElement;
  private playButton: HTMLButtonElement;
  private pauseButton: HTMLButtonElement;
  private stopButton: HTMLButtonElement;

  constructor(
    private container: HTMLElement,
    private engine: Engine,
  ) {
    this.root = document.createElement("div");
    this.playButton = document.createElement("button");
    this.pauseButton = document.createElement("button");
    this.stopButton = document.createElement("button");
    this.initialize();
  }

  initialize() {
    this.root.classList.add("cital-transport");
    this.container.appendChild(this.root);

    this.playButton.className = "cital-transport__button cital-transport__play";
    this.playButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 5v14l11-7L8 5z" fill="currentColor"/>
    </svg>`;
    this.playButton.onclick = () => this.engine.play();
    this.root.appendChild(this.playButton);

    this.pauseButton.className =
      "cital-transport__button cital-transport__pause";
    this.pauseButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6h4v12H6V6zm8 0h4v12h-4V6z" fill="currentColor"/>
    </svg>`;
    this.pauseButton.onclick = () => this.engine.pause();
    this.root.appendChild(this.pauseButton);

    this.stopButton.className = "cital-transport__button cital-transport__stop";
    this.stopButton.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6h12v12H6V6z" fill="currentColor"/>
    </svg>`;
    this.stopButton.onclick = () => this.engine.stop();
    this.root.appendChild(this.stopButton);
  }
}
