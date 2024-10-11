/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */
import * as functions from "firebase-functions";
import { defineSecret } from "firebase-functions/params";
import { onRequest } from "firebase-functions/v2/https";
import * as logger from "firebase-functions/logger";
import { onInit } from "firebase-functions/v2/core";
// import { initializeApp } from "firebase/app";
import * as cors from "cors";
import * as express from "express";
import * as dotenv from "dotenv";

import { OpenAI } from "openai";

import { getUpdatedPartitionFromOpenAI } from "./handlers";

const useCors = cors({ origin: true });

const apiKey = defineSecret("OPEN_AI_API_KEY");

let openAi: OpenAI;
onInit(() => {
  openAi = new OpenAI({
    apiKey: apiKey.value(),
  });
});

export const updatePartition = onRequest((request, response) => {
  dotenv.config();
  useCors(request, response, async () => {
    const { partition, pitchRows } = request.body;
    console.log("partition", partition, "pitchRows", pitchRows);

    const newPartition = await getUpdatedPartitionFromOpenAI({
      partition,
      pitchRows,
      openAi,
    });
    logger.info("Hello logs!", { structuredData: true });
    response.json({ newPartition });
  });
});

const app = express();

app.get("/health", (req, res) => {
  console.log(process.env);
  res.send("Server is up and running");
});

exports.app = functions.https.onRequest(app);
