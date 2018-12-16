/**
 * Polyfill for CI
 */
import React from "react";
import ReactDOM from "react-dom";

import "./style.css";

import App from "./App.jsx";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("app")
);
