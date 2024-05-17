import LightSensor from "../models/sensor_light.js";
import Board from "../models/board.js";

export const GetLightValue = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const latestLight = await LightSensor.findOne({ board_id })
      .sort({ _id: -1 })
      .limit(1);

    if (!latestLight) {
      return res.status(404).json({ message: "Light value not found" });
    }

    const board = await Board.findById(board_id); // Assuming Board is a Mongoose model
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { board_name, ipaddress } = board;

    const { device_name, light, date } = latestLight;

    const response = {
      board_name,
      ipaddress,
      board_id,
      device_name,
      light,
      date,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching humidity value:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllBoards = async (req, res, next) => {
  try {
    const boards = await Board.find();
    return res.status(200).json(boards);
  } catch (error) {
    console.error("Error fetching board data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// POST
export const AddLightSensorValue = async (req, res, next) => {
  try {
    const { device_name, light, board_id } = req.body;
    const board = await Board.findOne({ _id: board_id });

    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    const { board_name, ipaddress } = board;

    const currentTime = new Date();
    const offset = 7 * 60;
    currentTime.setMinutes(currentTime.getMinutes() + offset);

    const lightsensor = new LightSensor({
      board_name,
      ipaddress,
      board_id,
      device_name,
      light,
      date: currentTime,
    });

    // Save the lightsensor
    await lightsensor.save();

    return res.status(200).json({ success: true, sensor: lightsensor });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getAllDataL = async (req, res, next) => {
  try {
    const allData = await LightSensor.find();
    return res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
