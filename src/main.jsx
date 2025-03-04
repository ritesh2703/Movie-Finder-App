import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";  // ✅ Import Provider
import { store } from "./redux/store";   // ✅ Import store
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>  {/* ✅ Wrap App in Provider */}
      <App />
    </Provider>
  </React.StrictMode>
);
