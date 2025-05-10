import mongoose from "mongoose";

const libraryHistorySchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Student",
      required: true,
    },
    bookTitle: {
      type: String,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    returnDate: {
      type: Date,
    },
    isReturned: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const LibraryHistory = mongoose.model("LibraryHistory", libraryHistorySchema);

export default LibraryHistory;
