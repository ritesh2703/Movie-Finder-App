import { configureStore } from "@reduxjs/toolkit";
import movieReducer from "./slices/movieSlice";
import themeReducer from "./slices/themeSlice";

export const store = configureStore({
  reducer: {
    movies: movieReducer,
    theme: themeReducer,
  },
});
