import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/Api";

// Helper function to get token
const getAuthToken = () => {
  return localStorage.getItem("token");
};

// Async thunks
export const fetchLibraryHistory = createAsyncThunk(
  "library/fetchLibraryHistory",
  async (_, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get("/library", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // Make sure this matches your API response structure
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchLibraryHistoryById = createAsyncThunk(
  "library/fetchLibraryHistoryById",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.get(`/library/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // Changed from response.data to response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const addLibraryHistory = createAsyncThunk(
  "library/addLibraryHistory",
  async (libraryData, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.post("/library", libraryData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // Changed from response.data to response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateLibraryHistory = createAsyncThunk(
  "library/updateLibraryHistory",
  async ({ id, libraryData }, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.put(`/library/${id}`, libraryData, { // Fixed missing slash before id
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // Changed from response.data to response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteLibraryHistory = createAsyncThunk(
  "library/deleteLibraryHistory",
  async (id, { rejectWithValue }) => {
    try {
      const token = getAuthToken();
      const response = await api.delete(`/library/${id}`, { // Fixed missing slash before id
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data; // Changed from response.data to response.data.data
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Initial state
const initialState = {
  library: [],
  entry: null,
  loading: false,
  error: null,
};

// Slice
const librarySlice = createSlice({
  name: "library",
  initialState,
  reducers: {
    clearLibraryError: (state) => {
      state.error = null;
    },
    resetLibraryState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch all
      .addCase(fetchLibraryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryHistory.fulfilled, (state, action) => {
        state.loading = false;
        state.library = action.payload || []; // Added fallback empty array
      })
      .addCase(fetchLibraryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch library history";
      })

      // Fetch one
      .addCase(fetchLibraryHistoryById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLibraryHistoryById.fulfilled, (state, action) => {
        state.loading = false;
        state.entry = action.payload || null; // Added fallback null
      })
      .addCase(fetchLibraryHistoryById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to fetch entry";
      })

      // Add
      .addCase(addLibraryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addLibraryHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.library.push(action.payload);
        }
      })
      .addCase(addLibraryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to add entry";
      })

      // Update
      .addCase(updateLibraryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateLibraryHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          const index = state.library.findIndex((entry) => entry._id === action.payload._id);
          if (index !== -1) {
            state.library[index] = action.payload;
          }
          if (state.entry && state.entry._id === action.payload._id) {
            state.entry = action.payload;
          }
        }
      })
      .addCase(updateLibraryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to update entry";
      })

      // Delete
      .addCase(deleteLibraryHistory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteLibraryHistory.fulfilled, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.library = state.library.filter((entry) => entry._id !== action.payload._id);
          if (state.entry && state.entry._id === action.payload._id) {
            state.entry = null;
          }
        }
      })
      .addCase(deleteLibraryHistory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || action.error?.message || "Failed to delete entry";
      });
  },
});

export const { clearLibraryError, resetLibraryState } = librarySlice.actions;
export default librarySlice.reducer;