import AutoIncrementFactory from "mongoose-sequence";
import mongoose from "mongoose";

const { Schema } = mongoose;

const LightSensor = new Schema({
  _id: Number,
  device_name: { type: String, required: true },
  light: { type: Number, required: true },
  board_id: { type: Number, ref: "Board", required: true },
  board_name: { type: String, required: true },
  ipaddress: { type: String, required: true },
  date: { type: Date, required: true },
});

const AutoIncrement = AutoIncrementFactory(mongoose);

LightSensor.plugin(AutoIncrement, {
  id: "sensor_light_seq",
  inc_field: "_id",
  disableIdGenerator: true, // Disable Mongoose's default ObjectId generator
});

export default mongoose.model("LightSensor", LightSensor);
