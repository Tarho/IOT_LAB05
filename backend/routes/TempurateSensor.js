// routes/tempurateRoutes.js
import express from "express";
import {
  AddTempurateSensorValue,
  getAllDataT,
  getHumidity,
  getTemperature,
  getTemperatureSensorDataByBoardId,
} from "../controller/TempurateController.js";

const router = express.Router();

router.get("/humidities/:board_id", getHumidity);
router.get("/temperature/:board_id", getTemperature);
router.post("/addTempurateSenSorValue", AddTempurateSensorValue);
router.get("/allDataT", getAllDataT);
router.get("/temperatureSensors/:board_id", getTemperatureSensorDataByBoardId);


export default router;
