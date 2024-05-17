import mongoose from "mongoose";
import AutoIncrementFactory from "mongoose-sequence";

const { Schema } = mongoose;

const AutoIncrement = AutoIncrementFactory(mongoose);

const Account = new Schema({
  _id: Number,
  username: { type: String, required: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
});

Account.plugin(AutoIncrement, {
  id: "account_seq",
  inc_field: "_id",
  disableIdGenerator: true,
});

export default mongoose.model("Account", Account);
