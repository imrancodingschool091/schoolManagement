import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/Api";

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async thunks
export const fetchStaff = createAsyncThunk(
  "staff/fetchStaff",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get("/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchStaffById = createAsyncThunk(
  "staff/fetchStaffById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addStaff = createAsyncThunk(
  "staff/addStaff",
  async (staffData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.post("/users", staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateStaff = createAsyncThunk(
  "staff/updateStaff",
  async ({ id, staffData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/users/${id}`, staffData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteStaff = createAsyncThunk(
  "staff/deleteStaff",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Initial state
const initialState = {
  staffList: [],
  currentStaff: null,
  loading: false,
  error: null,
};

// Slice
const staffSlice = createSlice({
  name: "staff",
  initialState,
  reducers: {
    clearStaffError: (state) => {
      state.error = null;
    },
    resetStaffState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all staff
      .addCase(fetchStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaff.fulfilled, (state, action) => {
        state.loading = false;
        state.staffList = action.payload || [];
      })
      .addCase(fetchStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch staff";
      })

      // Fetch staff by ID
      .addCase(fetchStaffById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchStaffById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentStaff = action.payload || null;
      })
      .addCase(fetchStaffById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch staff member";
      })

      // Add staff
      .addCase(addStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addStaff.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.staffList.push(action.payload);
        }
      })
      .addCase(addStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to add staff member";
      })

      // Update staff
      .addCase(updateStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateStaff.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Update in staff list
          const index = state.staffList.findIndex((staff) => staff._id === action.payload._id);
          if (index !== -1) {
            state.staffList[index] = action.payload;
          }
          
          // Update current staff if it's the one being updated
          if (state.currentStaff && state.currentStaff._id === action.payload._id) {
            state.currentStaff = action.payload;
          }
        }
      })
      .addCase(updateStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to update staff member";
      })

      // Delete staff
      .addCase(deleteStaff.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteStaff.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.staffList = state.staffList.filter((staff) => staff._id !== action.payload._id);
          if (state.currentStaff && state.currentStaff._id === action.payload._id) {
            state.currentStaff = null;
          }
        }
      })
      .addCase(deleteStaff.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to delete staff member";
      });
  },
});

export const { clearStaffError, resetStaffState } = staffSlice.actions;
export default staffSlice.reducer;