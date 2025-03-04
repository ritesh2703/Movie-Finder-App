import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { fetchMovies } from "../redux/slices/movieSlice";  
import axios from "axios";

const API_KEY = "9ad081d1"; // 🔴 Replace with your actual API key

const MovieSearch = () => {  
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const dispatch = useDispatch();

  // Fetch Movie Suggestions
  const handleInputChange = async (e) => {
    setQuery(e.target.value);
    
    if (e.target.value.length > 2) {
      try {
        const response = await axios.get(
          `https://www.omdbapi.com/?apikey=${API_KEY}&s=${e.target.value}`
        );

        console.log("API Response:", response.data); // Debugging

        if (response.data.Search) {
          setSuggestions(response.data.Search);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error("Error fetching suggestions:", error);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Search for Movies
  const handleSearch = () => {
    dispatch(fetchMovies(query));
  };

  return (
    <div className="relative w-full max-w-lg mx-auto mt-5">
      {/* Search Input */}
      <div className="flex">
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          className="p-2 border rounded w-full outline-none"
          placeholder="Search movies..."
        />
        <button
          onClick={handleSearch}
          className="bg-black text-white p-2 rounded ml-2 hover:bg-gray-700 transition"
        >
          Search
        </button>
      </div>

      {/* Movie Suggestions Dropdown */}
      {suggestions.length > 0 && (
        <ul className="absolute bg-white border w-full mt-1 max-h-48 overflow-auto shadow-lg z-50">
          {suggestions.map((movie) => (
            <li
              key={movie.imdbID}
              onClick={() => {
                setQuery(movie.Title);
                setSuggestions([]);
                dispatch(fetchMovies(movie.Title));
              }}
              className="p-2 hover:bg-gray-200 cursor-pointer flex justify-between"
            >
              <span>{movie.Title} ({movie.Year})</span>
              <img src={movie.Poster} alt={movie.Title} className="w-10 h-14 object-cover rounded-md"/>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MovieSearch;
