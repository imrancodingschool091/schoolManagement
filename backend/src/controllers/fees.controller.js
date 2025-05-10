import FeesHistory from "../models/fees.model.js";

// Get all fees history
export const getFeesHistory = async (req, res) => {
  try {
    const histories = await FeesHistory.find({}).populate("studentId", "name");
    res.json({ success: true, data: histories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single fees history by ID
export const getFeesHistoryById = async (req, res) => {
  try {
    const history = await FeesHistory.findById(req.params.id).populate("studentId", "name");
    if (!history) return res.status(404).json({ message: "Fees history not found" });
    res.json({ success: true, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add a new fees history record
export const addNewFeesHistory = async (req, res) => {
  try {
    const newHistory = await FeesHistory.create(req.body);
    res.status(201).json({
      success: true,
      data: newHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update a fees history record
export const updateFeesHistory = async (req, res) => {
  try {
    const updatedHistory = await FeesHistory.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedHistory) return res.status(404).json({ message: "Fees history not found" });
    res.json({ success: true, data: updatedHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete a fees history record
export const deleteFeesHistory = async (req, res) => {
  try {
    const deletedHistory = await FeesHistory.findByIdAndDelete(req.params.id);
    if (!deletedHistory) return res.status(404).json({ message: "Fees history not found" });
    res.status(200).json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
