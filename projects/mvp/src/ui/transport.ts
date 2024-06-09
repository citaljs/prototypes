import van from "vanjs-core";

import type { Engine } from "../core/engine";
import "./transport.css";

const { div, button } = van.tags;
const { svg, path } = van.tags("http://www.w3.org/2000/svg");

export class Transport {
  constructor(container: HTMLElement, engine: Engine) {
    const dom = this.create(engine);
    van.add(container, dom);
  }

  private create(engine: Engine) {
    return div(
      { class: "cital-transport" },
      button(
        {
          class: "cital-transport__button cital-transport__play",
          onclick: () => engine.play(),
        },
        svg(
          { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
          path({ d: "M8 5v14l11-7L8 5z", fill: "currentColor" }),
        ),
      ),
      button(
        {
          class: "cital-transport__button cital-transport__pause",
          onclick: () => engine.pause(),
        },
        svg(
          { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
          path({ d: "M6 6h4v12H6V6zm8 0h4v12h-4V6z", fill: "currentColor" }),
        ),
      ),
      button(
        {
          class: "cital-transport__button cital-transport__stop",
          onclick: () => engine.stop(),
        },
        svg(
          { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none" },
          path({ d: "M6 6h12v12H6V6z", fill: "currentColor" }),
        ),
      ),
    );
  }
}
