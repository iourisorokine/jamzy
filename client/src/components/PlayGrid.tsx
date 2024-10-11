export type PlayGridProps = {
  partition: boolean[][];
  pitchRows: string[];
  toggleNote: (columnIndex: number, rowIndex: number) => void;
};

export const PlayGrid = ({ partition, toggleNote, pitchRows }: PlayGridProps) =>
  partition.map((column, columnIndex) => (
    <div style={{ display: "flex", flexDirection: "column" }}>
      {column.map((row, rowIndex) => (
        <button
          key={`${columnIndex}-${rowIndex}`}
          onClick={() => toggleNote(columnIndex, rowIndex)}
          style={{
            margin: 4,
            backgroundColor: partition[columnIndex][rowIndex]
              ? "lightBlue"
              : "white",
          }}
        >
          {pitchRows[rowIndex]}
        </button>
      ))}
    </div>
  ));
