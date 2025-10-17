import { useRef, useCallback } from 'react';

interface Track {
  name: string;
  src: string;
}

export function useMultiAudio(tracks: Track[]) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const buffersRef = useRef<Record<string, AudioBuffer>>({});
  const sourcesRef = useRef<Record<string, AudioBufferSourceNode>>({});

  const audioPlayerInit = useCallback(async () => {
    console.log(`Initializing audio player`);
    if (!audioContextRef.current) {
      console.log(`Declaring audioContextRef`);
      audioContextRef.current = new AudioContext();
      for (const { name, src } of tracks) {
        const res = await fetch(src);
        const arrayBuffer = await res.arrayBuffer();
        const buffer = await audioContextRef.current
          .decodeAudioData(arrayBuffer)
          .catch(() => console.error(`failed to decode ${name}`));
        buffersRef.current[name] = buffer!;
      }
    }
  }, [tracks]);

  const playAudio = useCallback((name: string) => {
    const audioContext = audioContextRef.current;
    if (!audioContext) return;

    // resume if suspended
    if (audioContext.state === 'suspended') {
      alert(`audio context was suspended`)
      audioContext.resume().catch((err) => console.error(err)); // synchronous call
    }
    const buffer = buffersRef.current[name];
    if (!buffer || !audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);

    // Remove reference once finished
    source.onended = () => {
      delete sourcesRef.current[name];
    };
  }, []);

  const loopAudio = useCallback((name: string) => {
    const buffer = buffersRef.current[name];
    if (!buffer || !audioContextRef.current) return;

    const source = audioContextRef.current.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContextRef.current.destination);
    source.start(0);
    source.loop = true;
  }, []);

  return { audioPlayerInit, playAudio, loopAudio };
}
