import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/Api";

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async thunks
export const fetchFeesHistory = createAsyncThunk(
  "fees/fetchFeesHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get("/fees", {
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

export const fetchFeesHistoryById = createAsyncThunk(
  "fees/fetchFeesHistoryById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/fees/${id}`, {
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

export const fetchFeesByStudentId = createAsyncThunk(
  "fees/fetchFeesByStudentId",
  async (studentId, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/fees/student/${studentId}`, {
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

export const addFeesHistory = createAsyncThunk(
  "fees/addFeesHistory",
  async (feesData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.post("/fees", feesData, {
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

export const updateFeesHistory = createAsyncThunk(
  "fees/updateFeesHistory",
  async ({ id, feesData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/fees/${id}`, feesData, {
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

export const deleteFeesHistory = createAsyncThunk(
  "fees/deleteFeesHistory",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/fees/${id}`, {
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
  fees: [],
  studentFees: [], // For fees by student ID
  entry: null,
  loading: false,
  error: null,
};

// Slice
const feesSlice = createSlice({
  name: "fees",
  initialState,
  reducers: {
    clearFeesError: (state) => {
      state.error = null;
    },
    resetFeesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all fees
      .addCase(fetchFeesHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.fees = action.payload || [];
      })
      .addCase(fetchFeesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch fees history";
      })

      // Fetch fees by ID
      .addCase(fetchFeesHistoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesHistoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.entry = action.payload || null;
      })
      .addCase(fetchFeesHistoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch fee entry";
      })

      // Fetch fees by student ID
      .addCase(fetchFeesByStudentId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFeesByStudentId.fulfilled, (state, action) => {
        state.loading = false;
        state.studentFees = action.payload || [];
      })
      .addCase(fetchFeesByStudentId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch student fees";
      })

      // Add fee
      .addCase(addFeesHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeesHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.fees.push(action.payload);
          // Also add to studentFees if the student matches
          if (state.studentFees.length > 0 && 
              action.payload.studentId === state.studentFees[0]?.studentId) {
            state.studentFees.push(action.payload);
          }
        }
      })
      .addCase(addFeesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to add fee entry";
      })

      // Update fee
      .addCase(updateFeesHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateFeesHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          // Update in fees array
          const feesIndex = state.fees.findIndex((fee) => fee._id === action.payload._id);
          if (feesIndex !== -1) {
            state.fees[feesIndex] = action.payload;
          }
          
          // Update in studentFees array
          const studentFeesIndex = state.studentFees.findIndex((fee) => fee._id === action.payload._id);
          if (studentFeesIndex !== -1) {
            state.studentFees[studentFeesIndex] = action.payload;
          }
          
          // Update in single entry
          if (state.entry && state.entry._id === action.payload._id) {
            state.entry = action.payload;
          }
        }
      })
      .addCase(updateFeesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to update fee entry";
      })

      // Delete fee
      .addCase(deleteFeesHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteFeesHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.fees = state.fees.filter((fee) => fee._id !== action.payload._id);
          state.studentFees = state.studentFees.filter((fee) => fee._id !== action.payload._id);
          if (state.entry && state.entry._id === action.payload._id) {
            state.entry = null;
          }
        }
      })
      .addCase(deleteFeesHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to delete fee entry";
      });
  },
});

export const { clearFeesError, resetFeesState } = feesSlice.actions;
export default feesSlice.reducer;