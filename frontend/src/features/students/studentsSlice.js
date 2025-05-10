import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/Api";

// Helper function to get token from localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

export const fetchStudents = createAsyncThunk(
  "/fetch/students",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get("/student", {
        headers: {
          'Authorization': `Bearer ${token}`  // Send token as Bearer token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const fetchStudentById = createAsyncThunk(
  "/fetch/studentById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/student/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Send token as Bearer token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const addStudent = createAsyncThunk(
  "/add/student",
  async (studentData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.post("/student", studentData, {
        headers: {
          'Authorization': `Bearer ${token}`  // Send token as Bearer token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const updateStudent = createAsyncThunk(
  "/update/student",
  async ({ id, studentData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/student/${id}`, studentData, {
        headers: {
          'Authorization': `Bearer ${token}`  // Send token as Bearer token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const deleteStudent = createAsyncThunk(
  "/delete/student",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/student/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`  // Send token as Bearer token
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const initialState = {
  students: [],
  student: null,
  loading: false,
  error: null,
};

const studentSlice = createSlice({
  name: "student",
  initialState,
  reducers: {
    clearStudentError: (state) => {
      state.error = null;
    },
    resetStudentState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch Students
      .addCase(fetchStudents.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.loading = false;
        state.students = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch students';
      })

      // Fetch Single Student By ID
      .addCase(fetchStudentById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStudentById.fulfilled, (state, action) => {
        state.loading = false;
        state.student = action.payload;
      })
      .addCase(fetchStudentById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch student';
      })

      // Add Student
      .addCase(addStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students.push(action.payload);
      })
      .addCase(addStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to add student';
      })

      // Update Student
      .addCase(updateStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStudent.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.students.findIndex(
          (student) => student._id === action.payload._id
        );
        if (index !== -1) {
          state.students[index] = action.payload;
        }
        // Also update the current student if it's the one being updated
        if (state.student && state.student._id === action.payload._id) {
          state.student = action.payload;
        }
      })
      .addCase(updateStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to update student';
      })

      // Delete Student
      .addCase(deleteStudent.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStudent.fulfilled, (state, action) => {
        state.loading = false;
        state.students = state.students.filter(
          (student) => student._id !== action.payload._id
        );
        // Clear current student if it's the one being deleted
        if (state.student && state.student._id === action.payload._id) {
          state.student = null;
        }
      })
      .addCase(deleteStudent.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to delete student';
      });
  },
});

export const { clearStudentError, resetStudentState } = studentSlice.actions;
export default studentSlice.reducer;
