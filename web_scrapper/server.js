import dotenv from 'dotenv'
dotenv.config()

import express from "express"
const app = express();

import mongoose from "mongoose"

mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", (error) => console.error(error));
db.once("open", () => console.log("Connected successfully to database"));

app.use(express.json());

import {router} from "./routes/scrapper.js";
app.use("/", router);

app.listen(5000, () => console.log("Listening on port 5000"));