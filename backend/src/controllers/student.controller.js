import Student from "../models/student.model.js";

// Get all students
export const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Get student by ID
export const getStudentsById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }
    res.json({ success: true, message: "Student details", student });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// Add new student
export const addStudent = async (req, res) => {
  const {
    name,
    rollNumber,
    class: studentClass,
    section,
    dateOfBirth,
    gender,
    address,
    parentDetails,
  } = req.body;

  try {
    const newStudent = new Student({
      name,
      rollNumber,
      class: studentClass,
      section,
      dateOfBirth,
      gender,
      address,
      parentDetails,
    });

    const savedStudent = await newStudent.save();
    res.status(201).json({ success: true, student: savedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update student
export const updateStudent = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    rollNumber,
    class: studentClass,
    section,
    dateOfBirth,
    gender,
    address,
    parentDetails,
    feesStatus,
  } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      {
        name,
        rollNumber,
        class: studentClass,
        section,
        dateOfBirth,
        gender,
        address,
        parentDetails,
        feesStatus,
      },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    res.status(200).json({ success: true, student: updatedStudent });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete student
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: "Student not found" });
    }

    await Student.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Student deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};
