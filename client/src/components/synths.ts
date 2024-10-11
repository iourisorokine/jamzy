import * as Tone from "tone";

export const polySynth = new Tone.PolySynth().toDestination();
export const fmSynth = new Tone.FMSynth().toDestination();
export const AMSynth = new Tone.AMSynth().toDestination();
export const duoSynth = new Tone.DuoSynth().toDestination();
