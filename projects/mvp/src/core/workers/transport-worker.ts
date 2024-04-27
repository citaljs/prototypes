import { createTransport } from "../transport";

const transport = createTransport();

console.log("worker started");

self.onmessage = async (event) => {
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
    const playingState = transport.getPlayingState();
    self.postMessage({ type: "getPlayingState", playingState });
  }

  if (data.type === "getCurrentTicks") {
    const currentTicks = transport.getCurrentTicks();
    self.postMessage({ type: "getCurrentTicks", currentTicks });
  }

  if (data.type === "getCurrentSeconds") {
    const currentSeconds = transport.getCurrentSeconds();
    self.postMessage({ type: "getCurrentSeconds", currentSeconds });
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
