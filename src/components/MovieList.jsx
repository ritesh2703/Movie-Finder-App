import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addFavorite, removeFavorite } from "../redux/slices/movieSlice";
import Modal from "react-modal";
import axios from "axios";

const API_KEY = "9ad081d1";
const YOUTUBE_API_KEY = "AIzaSyBt0M9-ZWBuERFf2X1_vEcRdsgePbaLjC8"; // Replace with a valid key

const DEFAULT_MOVIES = [
  "Jhimma ", "Baipan Bhari Deva", "Kanni", "Chhatrapati Sambhaji",
  "Goshta Eka Paithanichi", "Har Har Mahadev", "Baaplyok", 
  "Shri Ganesha", "Bhool Bhulaiyaa 3", "Pushpa",
  "Jigra", "CTRL", "Brahmastra part 1", "Dunki", "Tiger","Chhaava", 
  "Dharmarakshak Mahaveer Chhatrapati Sambhaji",
  "Chhaava","Deva","Sky Force","Jolly LLB","Baaghi"
];

const MovieList = ({ movies = [] }) => {
  const [movieData, setMovieData] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [trailerLoading, setTrailerLoading] = useState(false);
  const dispatch = useDispatch();
  const favorites = useSelector((state) => state.movies.favorites);

  // Fetch movie details from OMDb API
  const fetchMovieDetailsByTitle = async (title) => {
    try {
      const response = await axios.get(`https://www.omdbapi.com/?apikey=${API_KEY}&t=${title}`);
      return response.data.Response === "True" ? response.data : null;
    } catch (error) {
      console.error("Error fetching movie details:", error);
      return null;
    }
  };

  // Load default movies if no movies are provided
  useEffect(() => {
    if (movies.length === 0) {
      const fetchDefaultMovies = async () => {
        setLoading(true);
        try {
          const moviePromises = DEFAULT_MOVIES.map((title) => fetchMovieDetailsByTitle(title));
          const results = await Promise.all(moviePromises);
          setMovieData(results.filter((movie) => movie !== null)); // Remove null results
        } catch (error) {
          console.error("Error loading default movies:", error);
        }
        setLoading(false);
      };
      fetchDefaultMovies();
    } else {
      setMovieData(movies);
    }
  }, [movies]);

  // Fetch YouTube Trailer
  const fetchYouTubeTrailer = async (movieTitle) => {
    if (!movieTitle) return;
    setTrailerLoading(true);

    try {
      const response = await axios.get("https://www.googleapis.com/youtube/v3/search", {
        params: {
          part: "snippet",
          q: `${movieTitle} official trailer`,
          key: YOUTUBE_API_KEY,
          type: "video",
          maxResults: 1,
        },
      });

      if (response.data.items?.length > 0) {
        setSelectedMovie((prev) => ({
          ...prev,
          trailerId: response.data.items[0].id.videoId,
        }));
      }
    } catch (error) {
      console.error("Error fetching YouTube trailer:", error);
    }
    
    setTrailerLoading(false);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full p-4">
      {loading ? (
        <p className="text-gray-500 text-center w-full">Loading movies...</p>
      ) : movieData.length > 0 ? (
        movieData.map((movie) => {
          const isFavorite = favorites.some((fav) => fav.imdbID === movie.imdbID);
          return (
            <div key={movie.imdbID} className="p-4 bg-gray-800 text-white rounded-lg shadow-md">
              <img
                src={movie.Poster && movie.Poster !== "N/A" ? movie.Poster : "/no-poster.jpg"}
                alt={movie.Title || "Unknown Title"}
                className="w-full h-80 object-cover rounded-md"
                onError={(e) => (e.target.src = "/no-poster.jpg")} // Handle broken images
              />
              <h3 className="text-lg font-semibold mt-2">{movie.Title || "Unknown Title"}</h3>
              <p className="text-gray-400">{movie.Year || "Unknown Year"}</p>

              {/* Favorite Button */}
              <button
                onClick={() =>
                  isFavorite
                    ? dispatch(removeFavorite(movie.imdbID))
                    : dispatch(addFavorite(movie))
                }
                className={`mt-2 p-2 rounded w-full transition ${
                  isFavorite ? "bg-red-500 hover:bg-red-700" : "bg-blue-500 hover:bg-blue-700"
                }`}
              >
                {isFavorite ? "Remove from Favorites" : "Add to Favorites"}
              </button>

              {/* See More Button */}
              <button
                onClick={() => {
                  setSelectedMovie(movie);
                  setModalIsOpen(true);
                  fetchYouTubeTrailer(movie.Title);
                }}
                className="mt-2 p-2 bg-green-500 rounded w-full hover:bg-green-700 transition"
              >
                See More
              </button>
            </div>
          );
        })
      ) : (
        <p className="text-gray-500 text-center w-full">No movies found.</p>
      )}

      {/* Movie Details Modal */}
      {selectedMovie && (
        <Modal
          isOpen={modalIsOpen}
          onRequestClose={() => setModalIsOpen(false)}
          className="bg-white p-6 rounded-lg shadow-xl max-w-2xl mx-auto mt-20 max-h-[90vh] overflow-y-auto"
          overlayClassName="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center"
        >
          <div className="text-gray-800">
            <h2 className="text-2xl font-bold">{selectedMovie.Title || "Unknown Title"} ({selectedMovie.Year || "Unknown Year"})</h2>
            <img
              src={selectedMovie.Poster && selectedMovie.Poster !== "N/A" ? selectedMovie.Poster : "/no-poster.jpg"}
              alt={selectedMovie.Title || "Unknown Title"}
              className="w-full h-auto max-h-[80vh] object-contain rounded-md mt-4"
            />
            <p className="mt-4"><strong>Plot:</strong> {selectedMovie.Plot || "No plot available."}</p>
            <p className="mt-2"><strong>Cast:</strong> {selectedMovie.Actors || "No cast information available."}</p>
            <p className="mt-2"><strong>Genre:</strong> {selectedMovie.Genre || "Unknown Genre"}</p>
            <p className="mt-2"><strong>IMDB Rating:</strong> {selectedMovie.imdbRating || "N/A"}</p>

            {/* YouTube Trailer Embed */}
            {trailerLoading ? (
              <p className="text-center text-lg mt-4">Fetching Trailer...</p>
            ) : selectedMovie.trailerId ? (
              <div className="mt-4">
                <h3 className="text-xl font-bold">🎬 Watch Trailer</h3>
                <iframe
                  width="100%"
                  height="315"
                  src={`https://www.youtube.com/embed/${selectedMovie.trailerId}`}
                  title="YouTube video player"
                  frameBorder="0"
                  allowFullScreen
                  className="rounded-md shadow-lg"
                ></iframe>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No trailer available.</p>
            )}

            {/* Close Button */}
            <button
              onClick={() => setModalIsOpen(false)}
              className="mt-4 p-2 bg-red-600 text-white rounded w-full hover:bg-red-800 transition"
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default MovieList;
