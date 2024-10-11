export type NoteLabelsProps = {
  pitchRows: string[];
};

export const NoteLabels = ({ pitchRows }: NoteLabelsProps) =>
  pitchRows.map((pitch) => (
    <div style={{ padding: 4 }}>
      <button>{pitch}</button>
    </div>
  ));
