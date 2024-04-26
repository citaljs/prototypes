import { createTransport } from "../transport";

const transport = createTransport();

console.log("worker started");

self.onmessage = async (event) => {
  console.log("worker received message", event);

  const { data } = event;

  if (data.type === "play") {
    transport.play();
  }

  if (data.type === "pause") {
    transport.pause();
  }

  if (data.type === "stop") {
    transport.stop();
  }

  if (data.type === "getPlayingState") {
    const state = transport.getPlayingState();
    self.postMessage({ type: "getPlayingState", state });
  }

  if (data.type === "getCurrentTicks") {
    const ticks = transport.getCurrentTicks();
    self.postMessage({ type: "getCurrentTicks", ticks });
  }

  if (data.type === "getCurrentSeconds") {
    const seconds = transport.getCurrentSeconds();
    self.postMessage({ type: "getCurrentSeconds", seconds });
  }

  if (data.type === "getBpm") {
    const bpm = transport.getBpm();
    self.postMessage({ type: "getBpm", bpm });
  }

  if (data.type === "setBpm") {
    transport.setBpm(data.bpm);
  }

  if (data.type === "getPpq") {
    const ppq = transport.getPpq();
    self.postMessage({ type: "getPpq", ppq });
  }

  if (data.type === "setPpq") {
    transport.setPpq(data.ppq);
  }
};
