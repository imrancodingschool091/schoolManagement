import LibraryHistory from "../models/liabrary.model.js";

// Get all library history
export const getLibraryHistory = async (req, res) => {
  try {
    const histories = await LibraryHistory.find().populate("studentId", "name rollNumber");
    res.json({ success: true, data: histories });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add new library history
export const addLibraryHistory = async (req, res) => {
  const { studentId, bookTitle, issueDate, returnDate } = req.body;

  try {
    const newHistory = new LibraryHistory({
      studentId,
      bookTitle,
      issueDate,
      returnDate,
    });

    const savedHistory = await newHistory.save();
    res.status(201).json({
      success: true,
      data: savedHistory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Update library history
export const updateLibraryHistory = async (req, res) => {
  try {
    const updatedHistory = await LibraryHistory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedHistory) {
      return res.status(404).json({ success: false, message: "History not found" });
    }

    res.json({ success: true, data: updatedHistory });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Get single library history by ID
export const getSingleLibraryHistory = async (req, res) => {
  try {
    const history = await LibraryHistory.findById(req.params.id).populate("studentId", "name rollNumber");

    if (!history) {
      return res.status(404).json({ success: false, message: "History not found" });
    }

    res.json({ success: true, data: history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Delete library history
export const deleteLibraryHistory = async (req, res) => {
  try {
    const history = await LibraryHistory.findByIdAndDelete(req.params.id);

    if (!history) {
      return res.status(404).json({ success: false, message: "History not found" });
    }

    res.json({ success: true, message: "History deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
