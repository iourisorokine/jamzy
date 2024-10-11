import * as Tone from "tone";
import { useRef, useState } from "react";

import { getTimeout } from "../utils";

import { polySynth } from "./synths";
import {
  INITIAL_PARTITION,
  PITCH_ROWS,
  TEMPO,
  SEQUENCE_LENGTH,
} from "./settings";
import { NoteLabels } from "./NoteLabels";
import { PlayGrid } from "./PlayGrid";

export const MainPage = () => {
  const [partitionState, setPartitionState] = useState(INITIAL_PARTITION);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const musicPlaying = useRef<number | null | any>(null);

  const playOneToneJsNote = async (pitch: string, synth: any) => {
    const now = Tone.now();
    synth.triggerAttackRelease(pitch, "8n", now);
  };

  const playOneBar = async (columnIndex: number, partition: number[][]) => {
    const column = partition[columnIndex];
    column.forEach((row, rowIndex) => {
      if (row) {
        playOneToneJsNote(PITCH_ROWS[rowIndex], polySynth);
      }
    });
  };

  const toggleNote = (columnIndex: number, rowIndex: number) => {
    const newPartition = [...partitionState];
    newPartition[columnIndex][rowIndex] =
      newPartition[columnIndex][rowIndex] === 1 ? 0 : 1;
    setPartitionState(newPartition);
  };

  const playMusic = () => {
    setIsPlaying(true);
    let counter = 0;

    const playInterval = () => {
      playOneBar(counter, partitionState);
      counter++;
      if (counter >= SEQUENCE_LENGTH) {
        counter = 0;
      }
    };
    musicPlaying.current = setInterval(playInterval, getTimeout(TEMPO));
  };

  const stopMusic = () => {
    setIsPlaying(false);
    if (musicPlaying.current) {
      clearInterval(musicPlaying.current);
    }
  };

  const onPlayClick = () => {
    if (isPlaying) {
      stopMusic();
    } else {
      playMusic();
    }
  };

  const generateWithAi = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        "http://127.0.0.1:5001/jamzzy/us-central1/updatePartition",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ partition: partitionState, PITCH_ROWS }),
        }
      );
      const data = await response.json();
      console.log(data);
      const loadedPartition =
        data?.newPartition.partition || data?.newPartition;

      console.log("loadedPartition", loadedPartition);

      if (loadedPartition) {
        const updatedPartition = [...partitionState];
        for (
          let columnIndex = 0;
          columnIndex < partitionState.length;
          columnIndex++
        ) {
          for (
            let rowIndex = 0;
            rowIndex < partitionState[columnIndex].length;
            rowIndex++
          ) {
            updatedPartition[columnIndex][rowIndex] =
              loadedPartition[columnIndex][rowIndex] === 1 ? 1 : 0;
          }
        }
        setPartitionState(updatedPartition);
      }
    } catch (error) {
      console.error(error);
    }
    setIsLoading(false);
  };

  const setPartitionToNew = (newPartition: number[][]) => {
    const updatedPartition = [...partitionState];
    for (
      let columnIndex = 0;
      columnIndex < partitionState.length;
      columnIndex++
    ) {
      for (
        let rowIndex = 0;
        rowIndex < partitionState[columnIndex].length;
        rowIndex++
      ) {
        updatedPartition[columnIndex][rowIndex] =
          newPartition[columnIndex][rowIndex] === 1 ? 1 : 0;
      }
    }
    setPartitionState(updatedPartition);
  };

  const resetPartition = () => {
    setPartitionState(INITIAL_PARTITION);
  };

  const testGenerate = async () => {
    generateWithAi();
    setTimeout(() => {
      generateWithAi();
      setTimeout(() => {
        generateWithAi();
      }, 30000);
    }, 30000);
  };

  return (
    <div>
      <div>Tone JS implementation</div>
      <div style={{ display: "flex" }}>
        <div style={{ display: "flex", flexDirection: "column", padding: 4 }}>
          <NoteLabels pitchRows={PITCH_ROWS} />
        </div>
        <PlayGrid
          partition={partitionState}
          toggleNote={toggleNote}
          pitchRows={PITCH_ROWS}
        />
      </div>
      <div style={{ display: "flex", flex: 1, justifyContent: "center" }}>
        <div style={{ padding: 4 }}>
          <button onClick={onPlayClick}>{isPlaying ? "Pause" : "Play"}</button>
        </div>
        <div style={{ padding: 4 }}>
          <button disabled={isLoading} onClick={generateWithAi}>
            {isLoading ? "loading..." : "AI generate"}
          </button>
        </div>
        <div style={{ padding: 4 }}>
          <button onClick={resetPartition}>Reset</button>
        </div>
      </div>
    </div>
  );
};
