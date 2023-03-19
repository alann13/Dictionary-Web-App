import React, { useRef } from "react";

interface Props {
  audioSrc: string;
}

export default function AudioButton({ audioSrc }: Props) {
  const audioElement = useRef<HTMLAudioElement>(null);
  const playAudio = () => {
    audioElement.current?.play();
  };

  return (
    <>
      <audio ref={audioElement}>
        <source src={audioSrc} type="audio/mpeg" />
      </audio>
      <button
        style={{ border: "none", background: "transparent" }}
        onClick={playAudio}
      >
        <img src="/icon-play.svg" alt="Play button" />
      </button>
    </>
  );
}
