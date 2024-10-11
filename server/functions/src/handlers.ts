import { OpenAI } from "openai";

const initialPrompt = `
You are a music writing assistant and you will receive a grid as a 2-dimensional array, each row of the array corresponds to a serie notes that can be played at the same time. The possible notes will be displayed in a separate array. 
When the value of a partition[rowIndex][noteIndex] is 0 then nothing is played but when it is 1 that means the note is played.
Try to have a constant pattern on the first 2 or 3 elements of each row. Try not to have more than 1/10th of all the values set to 1, try tom have 1/12th to 1/6th of the values set to 1.

I am sending you a filled in partition. Add or remove or modify between 2 and 8 notes on it in total. Add and remove notes at each iteration and send me back a modified partition as a json object with the same structure.
Please send only the partition without variable name and format your answer in json string format, without other text or comment, without indicating that it is a json (example: "[[0,0], [1,0]]").
`;

const defaultPitchRows = `["C3", "D3", "E3", "F3", "G3", "A3", "B3", "C4"]`;
const defaultPartition = ` [
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [1, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
  [0, 0, 0, 0, 0, 0, 0, 0],
];`;

export type GetUpdatedPartitionFromOpenAIArgs = {
  pitchRows?: string;
  partition?: string;
  openAi: OpenAI;
};

export const getUpdatedPartitionFromOpenAI = async ({
  pitchRows,
  partition,
  openAi,
}: GetUpdatedPartitionFromOpenAIArgs) => {
  const pitchRowsOpenAiArg = pitchRows
    ? JSON.stringify(pitchRows)
    : defaultPitchRows;
  const partitionOpenAiArg = partition
    ? JSON.stringify(partition)
    : defaultPartition;

  const pitchRowsTextToInsert = `const pitchRows = ${pitchRowsOpenAiArg};
  
  `;
  const partitionTextToInsert = `const INITIAL_PARTITION = ${partitionOpenAiArg};
  
  `;

  const assembledPrompt =
    pitchRowsTextToInsert + partitionTextToInsert + initialPrompt;

  console.log("assembled prompt", assembledPrompt);

  try {
    const response = await openAi.chat.completions.create({
      model: "gpt-3.5-turbo",
      max_tokens: 3000,
      messages: [
        {
          role: "user",
          content: assembledPrompt,
        },
      ],
      temperature: 1.3,
    });
    const responseMessageContent = response.choices[0].message.content;
    console.log("responseMessageContent", responseMessageContent);
    const parsedResponse = responseMessageContent
      ? JSON.parse(responseMessageContent)
      : "";
    console.log(parsedResponse);
    return parsedResponse;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
