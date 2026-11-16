import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Background instrumental music.
 *
 * Set MUSIC_URL to a hosted audio file to use a real track. While it's null,
 * a gentle music-box/harp arrangement is synthesised in the browser with the
 * Web Audio API, so no external file is needed. Audio only starts after the
 * guest taps "Buka Undangan" (browsers block autoplay before interaction).
 */
export const MUSIC_URL: string | null = null;

// Romantic progression: Fmaj7 – Em7 – Dm7 – Cmaj7/G (in Hz)
const CHORDS: number[][] = [
  [174.61, 220.0, 261.63, 329.63],
  [164.81, 196.0, 246.94, 293.66],
  [146.83, 174.61, 220.0, 261.63],
  [130.81, 196.0, 246.94, 329.63],
];
const MELODY: (number | null)[] = [
  659.25, null, 587.33, 523.25, 587.33, null, 523.25, 493.88,
  440.0, null, 493.88, 523.25, 493.88, null, 392.0, null,
];
const STEP = 0.42; // seconds per eighth-note
const STEPS_PER_CHORD = 8;

class Synth {
  ctx: AudioContext;
  master: GainNode;
  delay: DelayNode;
  timer: number | null = null;
  nextTime = 0;
  step = 0;

  constructor() {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctx();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    const filter = this.ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 2600;
    this.delay = this.ctx.createDelay(1);
    this.delay.delayTime.value = STEP * 1.5;
    const feedback = this.ctx.createGain();
    feedback.gain.value = 0.32;
    const wet = this.ctx.createGain();
    wet.gain.value = 0.35;
    this.master.connect(filter);
    filter.connect(this.ctx.destination);
    filter.connect(this.delay);
    this.delay.connect(feedback);
    feedback.connect(this.delay);
    this.delay.connect(wet);
    wet.connect(this.ctx.destination);
  }

  pluck(freq: number, time: number, gain: number, length: number) {
    const osc = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc2.type = "sine";
    osc.frequency.value = freq;
    osc2.frequency.value = freq * 2;
    const g2 = this.ctx.createGain();
    g2.gain.value = 0.25;
    osc.connect(g);
    osc2.connect(g2).connect(g);
    g.connect(this.master);
    g.gain.setValueAtTime(0, time);
    g.gain.linearRampToValueAtTime(gain, time + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, time + length);
    osc.start(time);
    osc2.start(time);
    osc.stop(time + length + 0.05);
    osc2.stop(time + length + 0.05);
  }

  pad(freqs: number[], time: number, length: number) {
    freqs.forEach((f) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = f / 2;
      osc.connect(g).connect(this.master);
      g.gain.setValueAtTime(0, time);
      g.gain.linearRampToValueAtTime(0.035, time + 1.2);
      g.gain.linearRampToValueAtTime(0, time + length);
      osc.start(time);
      osc.stop(time + length + 0.1);
    });
  }

  schedule = () => {
    while (this.nextTime < this.ctx.currentTime + 0.6) {
      const chordIndex = Math.floor(this.step / STEPS_PER_CHORD) % CHORDS.length;
      const chord = CHORDS[chordIndex] ?? CHORDS[0]!;
      const inChord = this.step % STEPS_PER_CHORD;
      if (inChord === 0) this.pad(chord, this.nextTime, STEP * STEPS_PER_CHORD + 0.4);
      const arp = [0, 1, 2, 3, 2, 1, 2, 3][inChord] ?? 0;
      this.pluck((chord[arp] ?? chord[0]!) * 2, this.nextTime, 0.07, 1.8);
      const note = MELODY[this.step % MELODY.length];
      if (note && Math.floor(this.step / 16) % 2 === 1) {
        this.pluck(note, this.nextTime, 0.06, 2.4);
      }
      this.nextTime += STEP;
      this.step += 1;
    }
  };

  async play() {
    await this.ctx.resume();
    if (this.timer === null) {
      this.nextTime = this.ctx.currentTime + 0.1;
      this.timer = window.setInterval(this.schedule, 120);
    }
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0.9, this.ctx.currentTime + 1.5);
  }

  pause() {
    this.master.gain.cancelScheduledValues(this.ctx.currentTime);
    this.master.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.4);
    window.setTimeout(() => {
      if (this.timer !== null) {
        window.clearInterval(this.timer);
        this.timer = null;
      }
      void this.ctx.suspend();
    }, 450);
  }

  dispose() {
    if (this.timer !== null) window.clearInterval(this.timer);
    void this.ctx.close();
  }
}

export function useMusic() {
  const [playing, setPlaying] = useState(false);
  const synthRef = useRef<Synth | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const play = useCallback(async () => {
    try {
      if (MUSIC_URL) {
        if (!audioRef.current) {
          audioRef.current = new Audio(MUSIC_URL);
          audioRef.current.loop = true;
          audioRef.current.volume = 0.6;
        }
        await audioRef.current.play();
      } else {
        if (!synthRef.current) synthRef.current = new Synth();
        await synthRef.current.play();
      }
      setPlaying(true);
    } catch {
      setPlaying(false);
    }
  }, []);

  const pause = useCallback(() => {
    audioRef.current?.pause();
    synthRef.current?.pause();
    setPlaying(false);
  }, []);

  const toggle = useCallback(() => {
    if (playing) pause();
    else void play();
  }, [playing, play, pause]);

  useEffect(
    () => () => {
      audioRef.current?.pause();
      synthRef.current?.dispose();
    },
    [],
  );

  return { playing, play, pause, toggle };
}
