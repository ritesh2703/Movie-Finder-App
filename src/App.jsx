import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home"; // Home Page
import ThemeToggle from "./components/ThemeToggle";
import "./App.css";

const App = () => {
  const darkMode = useSelector((state) => state.theme.darkMode);

  return (
    <div className={`min-h-screen w-screen flex flex-col ${darkMode ? "dark bg-gray-900 text-white" : "bg-white text-black"}`}>
      <Router>
        {/* Header Section */}
        <header className="w-full max-w-screen-xl mx-auto px-6 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-bold">🎬 Movie Finder</h1>
          <ThemeToggle />
        </header>

        {/* Main Content */}
        <main className="w-full max-w-screen-xl mx-auto px-6 flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
          </Routes>
        </main>
      </Router>
    </div>
  );
};

export default App;
