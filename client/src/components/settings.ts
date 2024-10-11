export const PITCH_ROWS = [
  "A1",
  "C2",
  "D2",
  "E2",
  "D4",
  "E4",
  "G4",
  "A4",
  "C5",
  "D5",
];

export const SEQUENCE_LENGTH = 16;

export const INITIAL_PARTITION = [...new Array(SEQUENCE_LENGTH)].map(() =>
  new Array(PITCH_ROWS.length).fill(0)
);

export const TEMPO = 120;
