import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // import the reducer, not the login action
import studentsReducer from '../features/students/studentsSlice'; // Corrected typo here
import LibraryReducer from "../features/library/librarySlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, // key name can be 'auth' or anything you prefer
    student: studentsReducer, // Fixed the typo here
    library:LibraryReducer
  },
});
