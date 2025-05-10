import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  superAdmin: { type: Boolean, default: false },
  role: {
    type: String,
    enum: ["Admin", "OfficeStaff", "Librarian"],
    default: "OfficeStaff",
  },
});

const User = mongoose.model("User", userSchema);
export default User;
