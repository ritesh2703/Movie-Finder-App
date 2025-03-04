import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_KEY = "9ad081d1";
const BASE_URL = "https://www.omdbapi.com/";

export const fetchMovies = createAsyncThunk(
  "movies/fetchMovies",
  async (searchTerm, { getState }) => {
    const { genre, year, rating } = getState().movies.filters;
    let query = `?apikey=${API_KEY}&s=${searchTerm}`;

    if (genre) query += `&genre=${genre}`;
    if (year) query += `&y=${year}`;
    if (rating) query += `&imdbRating=${rating}`;

    const response = await axios.get(`${BASE_URL}${query}`);
    
    return (response.data.Search || []).map((movie) => ({
      ...movie,
      isFavorite: false, // ✅ Initialize with isFavorite flag
    }));
  }
);

const movieSlice = createSlice({
  name: "movies",
  initialState: {
    movies: [],
    favorites: [],
    filters: { genre: "", year: "", rating: "" },
  },
  reducers: {
    setFilter: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    addFavorite: (state, action) => {
      const movie = { ...action.payload, isFavorite: true }; // ✅ Ensure isFavorite is set
      if (!state.favorites.find((fav) => fav.imdbID === movie.imdbID)) {
        state.favorites.push(movie);
      }

      // ✅ Update movies array to reflect favorite status
      state.movies = state.movies.map((m) =>
        m.imdbID === movie.imdbID ? { ...m, isFavorite: true } : m
      );
    },
    removeFavorite: (state, action) => {
      state.favorites = state.favorites.filter(
        (movie) => movie.imdbID !== action.payload
      );

      // ✅ Update movies array to remove favorite status
      state.movies = state.movies.map((m) =>
        m.imdbID === action.payload ? { ...m, isFavorite: false } : m
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchMovies.fulfilled, (state, action) => {
      state.movies = action.payload;
    });
  },
});

export const { setFilter, addFavorite, removeFavorite } = movieSlice.actions;
export default movieSlice.reducer;
