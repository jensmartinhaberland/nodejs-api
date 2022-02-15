import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import HttpStatus from "./controller/patient.controller.js";
import ip from "ip";
import logger from "./util/logger.js";
import Response from "./domain/response.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.get("/", (req, res) =>
  res.send(
    new Response(
      HttpStatus.OK.code,
      HttpStatus.OK.status,
      "Patient API, v1.0.0 - All Systems Go"
    )
  )
);

// console.log(process.env);

app.listen(PORT, () => {
  logger.info(`🚀 SERVER RUNNING ON: ${ip.address()}:${PORT}`);
});