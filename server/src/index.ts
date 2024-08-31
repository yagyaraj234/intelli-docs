import express from "express";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import root from "./routes/index";

const firebase = require("../.account.json");

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebase.project_id,
    privateKey: firebase.private_key?.replace(/\\n/g, "\n"),
    clientEmail: firebase.client_email,
    // @ts-ignore
    storageBucket: firebase.storage_bucket,
  }),
});

export const db = admin.firestore();
const storage = admin.storage();
export const bucket = storage.bucket("gs://chat-doc-46080.appspot.com");

app.get("/", (req, res) => {
  res.send(`Server up and running.`);
});

app.use("/api/v1/", root);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
