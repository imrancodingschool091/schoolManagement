import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice'; // import the reducer, not the login action
import studentsReducer from '../features/students/studentsSlice'; // Corrected typo here
import LibraryReducer from "../features/library/librarySlice"
import feesReducer from "../features/fees/feesSlice"
import staffsReducer from "../features/staffs/staffsSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer, // key name can be 'auth' or anything you prefer
    student: studentsReducer, // Fixed the typo here
    library:LibraryReducer,
    fees:feesReducer,
    staff:staffsReducer
  },
});
