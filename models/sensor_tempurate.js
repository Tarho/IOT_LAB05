import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const { Schema } = mongoose;

const TemperatureSensorSchema = new Schema({
  _id: Number,
  device_name: { type: String, required: true },
  temperature: { type: Number, required: true },
  humidity: { type: Number, required: true },
  board_id: { type: Number, ref: "Board", required: true },
  board_name: { type: String, required: true },
  ipaddress: { type: String, required: true },
  date: { type: Date, required: true },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

TemperatureSensorSchema.plugin(AutoIncrement, {
  id: "sensor_temperature_seq",
  inc_field: "_id",
  disableIdGenerator: true,
});

const TemperatureSensor = mongoose.model(
  "TemperatureSensor",
  TemperatureSensorSchema
);
export default TemperatureSensor;
