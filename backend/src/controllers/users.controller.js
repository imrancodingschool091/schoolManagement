import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

// Get users
export const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, data: users });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ success: true, data: user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add new user
export const addNewUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword, role });
    await user.save();
    res.status(201).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { name, email, password: updatedPass = null, role } = req.body;
    const currentUser = await User.findById(req.user.userId);

    const userToUpdate = await User.findById(req.params.id);

    if (!userToUpdate) {
      return res.status(404).json({ message: "User not found" });
    }
    let password = userToUpdate.password;

    if (currentUser.superAdmin) {
      if (updatedPass) password = await bcrypt.hash(updatedPass, 10);
      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, password, role },
        { new: true }
      );
      return res.json({ success: true, data: updatedUser });
    }

    if (currentUser.role === "Admin") {
      if (userToUpdate.role === "Admin") {
        return res.status(403).json({ message: "Admins cannot update other Admins" });
      }
      if (updatedPass) password = await bcrypt.hash(updatedPass, 10);

      const updatedUser = await User.findByIdAndUpdate(
        req.params.id,
        { name, email, password, role },
        { new: true }
      );
      return res.json({ success: true, data: updatedUser });
    }

    return res.status(403).json({ message: "You do not have permission to update this user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user.userId);

    const userToDelete = await User.findById(req.params.id);

    if (!userToDelete) {
      return res.status(404).json({ message: "User not found" });
    }
    if (currentUser.superAdmin) {
      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    }

    if (currentUser.role === "Admin") {
      if (userToDelete.role === "Admin") {
        return res.status(403).json({ message: "Admins cannot delete other Admins" });
      }

      await User.findByIdAndDelete(req.params.id);
      return res.status(200).json({ success: true, message: "Deleted successfully" });
    }

    return res.status(403).json({ message: "You do not have permission to delete this user" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
