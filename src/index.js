import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import HttpStatus from "./controller/patient.controller.js";
import ip from "ip";
import logger from "./util/logger.js";
import patientRoutes from "./route/patient.route.js";
import Response from "./domain/response.js";

dotenv.config();
const PORT = process.env.SERVER_PORT || 3000;
const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use("/patients", patientRoutes);

app.get("/", (req, res) =>
  res.send(
    new Response(
      HttpStatus.OK.code,
      HttpStatus.OK.status,
      "PATIENT API, v1.0.0 - All SYSTEMS GO!"
    )
  )
);

app.all("*", (req, res) =>
  res
    .status(HttpStatus.NOT_FOUND.code)
    .send(
      new Response(
        HttpStatus.NOT_FOUND.code,
        HttpStatus.NOT_FOUND.status,
        "ROUTE DOES NOT EXIST ON THE SERVER!"
      )
    )
);

app.listen(PORT, () => {
  logger.info(`🚀 SERVER RUNNING ON: ${ip.address()}:${PORT}`);
});