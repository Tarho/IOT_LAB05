import Board from "../models/board.js";
import TemperatureSensor from "../models/sensor_tempurate.js";

export const getHumidity = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const latestHumidity = await TemperatureSensor.findOne({ board_id })
      .sort({ _id: -1 })
      .limit(1);

    if (!latestHumidity) {
      return res.status(404).json({ message: "Humidity value not found" });
    }

    const board = await Board.findById(board_id); // Assuming Board is a Mongoose model
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { board_name, ipaddress } = board;

    const { humidity, date } = latestHumidity;

    const response = {
      board_name,
      ipaddress,
      board_id,
      humidity,
      date,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching humidity value:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getTemperature = async (req, res, next) => {
  try {
    const board_id = req.params.board_id;
    const latestTemperature = await TemperatureSensor.findOne({ board_id })
      .sort({ _id: -1 })
      .limit(1);

    if (!latestTemperature) {
      return res.status(404).json({ message: "Temperature value not found" });
    }

    const board = await Board.findById(board_id); // Assuming Board is a Mongoose model
    if (!board) {
      return res.status(404).json({ message: "Board not found" });
    }

    const { board_name, ipaddress } = board;

    const { temperature, date } = latestTemperature;

    const response = {
      board_name,
      ipaddress,
      board_id,
      temperature,
      date,
    };
    return res.status(200).json(response);
  } catch (error) {
    console.error("Error fetching humidity value:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const AddTempurateSensorValue = async (req, res, next) => {
  try {
    const { temperature, humidity, board_id } = req.body;

    const board = await Board.findOne({ _id: board_id });

    if (!board) {
      return res.status(404).json({ success: false, error: "Board not found" });
    }

    const { board_name, ipaddress } = board;
    const currentTime = new Date();
    const offset = 7 * 60;
    currentTime.setMinutes(currentTime.getMinutes() + offset);
    const temperatureSensor = new TemperatureSensor({
      board_name,
      ipaddress,
      board_id,
      temperature,
      humidity,
      date: currentTime, // Assign current time
    });

    // Save the TemperatureSensor document to the database
    await temperatureSensor.save();

    return res.status(200).json({ success: true, sensor: temperatureSensor });
  } catch (error) {
    console.error("Error adding temperature and humidity sensor value:", error);
    return res
      .status(500)
      .json({ success: false, error: "Internal server error" });
  }
};

export const getAllDataT = async (req, res, next) => {
  try {
    const allData = await TemperatureSensor.find();
    return res.status(200).json(allData);
  } catch (error) {
    console.error("Error fetching all data:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const getTemperatureSensorDataByBoardId = async (req, res) => {
  const { board_id } = req.params;

  try {
    const sensorData = await TemperatureSensor.findOne({ board_id })
      .sort({ _id: -1 }) // or .sort({ date: -1 }) if you prefer to sort by date
      .limit(1);

    if (!sensorData) {
      return res.status(404).json({ message: "No data found for this board ID" });
    }

    res.json(sensorData);
  } catch (error) {
    res.status(500).json({ message: "Internal server error", error });
  }
};