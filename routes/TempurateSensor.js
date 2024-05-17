// routes/tempurateRoutes.js
import express from "express";
import {
  AddTempurateSensorValue,
  getAllDataT,
  getHumidity,
  getTemperature,
} from "../controller/TempurateController.js";

const router = express.Router();

router.get("/humidities/:board_id", getHumidity);
router.get("/temperature/:board_id", getTemperature);
router.post("/addTempurateSenSorValue", AddTempurateSensorValue);
router.get("/allDataT", getAllDataT);

export default router;
