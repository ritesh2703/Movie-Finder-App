import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import MovieSearch from "../components/MovieSearch";
import MovieList from "../components/MovieList";
import { fetchMovies } from "../redux/slices/movieSlice";

const DEFAULT_MOVIES = [
];

const Home = () => {
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movies.movies);
  const favorites = useSelector((state) => state.movies.favorites);
  const darkMode = useSelector((state) => state.theme.darkMode);

  // Fetch movies on load
  useEffect(() => {
    DEFAULT_MOVIES.forEach((title) => {
      dispatch(fetchMovies(title));
    });
  }, [dispatch]);

  return (
    <div
      className={`w-full min-h-screen flex flex-col items-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
      }`}
    >
      <div className="w-full h-full min-h-screen flex flex-col items-center">
        <div className="w-full max-w-6xl px-6 py-8">
          {/* Search Bar */}
          <MovieSearch />

          {/* Default Movies Section */}
          <h2 className="text-2xl font-semibold mt-6">Movies</h2>
          <MovieList movies={movies} />

          {/* Favorite Movies Section (Only if there are favorites) */}
          {favorites.length > 0 && (
            <>
              <h2 className="text-2xl font-semibold mt-6">Favorite Movies</h2>
              <MovieList movies={favorites} />
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
