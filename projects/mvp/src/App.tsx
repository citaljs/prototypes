import { useCallback, useEffect, useRef, useState } from "react";
import type { PlayingState } from "./core/transport";
import { BPM, PPQ, type Seconds, type Ticks } from "./core/types";
import { createWorkerTransport } from "./core/workers/transport";

const transport = createWorkerTransport();

function useAnimationFrame(animationHandler: () => void) {
  const frame = useRef(0);

  const animate = useCallback(() => {
    animationHandler();
    frame.current = requestAnimationFrame(animate);
  }, [animationHandler]);

  useEffect(() => {
    frame.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame.current);
  }, [animate]);
}

function App() {
  const [playingState, setPlayingState] = useState<PlayingState>();
  const [currentTicks, setCurrentTicks] = useState<Ticks>();
  const [currentSeconds, setCurrentSeconds] = useState<Seconds>();
  const [bpm, setBpm_] = useState<BPM>();
  const [ppq, setPpq_] = useState<PPQ>();
  const [bpmInput, setBpmInput] = useState("120");
  const [ppqInput, setPpqInput] = useState("960");

  const play = () => transport.play();
  const pause = () => transport.pause();
  const stop = () => transport.stop();
  const setBpm = () => transport.setBpm(new BPM(Number.parseInt(bpmInput, 10)));
  const setPpq = () => transport.setPpq(new PPQ(Number.parseInt(ppqInput, 10)));

  useAnimationFrame(() => {
    const f = async () => {
      const playingState = await transport.getPlayingState();
      setPlayingState(playingState);
      const currentTicks = await transport.getCurrentTicks();
      setCurrentTicks(currentTicks);
      const currentSeconds = await transport.getCurrentSeconds();
      setCurrentSeconds(currentSeconds);
      const bpm = await transport.getBpm();
      setBpm_(bpm);
      const ppq = await transport.getPpq();
      setPpq_(ppq);
    };
    f();
  });

  return (
    <>
      <h1>MVP</h1>
      <div>
        <button type="button" onClick={play}>
          Play
        </button>
      </div>
      <div>
        <button type="button" onClick={pause}>
          Pause
        </button>
      </div>
      <div>
        <button type="button" onClick={stop}>
          Stop
        </button>
      </div>
      <div>
        <button type="button" onClick={setBpm}>
          setBpm
        </button>
        <input
          type="number"
          min="1"
          max="999"
          step="1"
          value={bpmInput}
          onChange={(event) => setBpmInput(event.target.value)}
        />
      </div>
      <div>
        <button type="button" onClick={setPpq}>
          setPpq
        </button>
        <input
          type="number"
          min="1"
          max="9999"
          step="1"
          value={ppqInput}
          onChange={(event) => setPpqInput(event.target.value)}
        />
      </div>
      <div>playingState: {playingState}</div>
      <div>currentTicks: {currentTicks?.value}</div>
      <div>currentSeconds: {currentSeconds?.value}</div>
      <div>bpm: {bpm?.value}</div>
      <div>ppq: {ppq?.value}</div>
    </>
  );
}

export default App;
