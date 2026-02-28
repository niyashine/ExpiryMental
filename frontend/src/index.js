import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddFood from "./pages/AddFood";
import Shelf from "./pages/Shelf"; // new page
import "./index.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-food" element={<AddFood />} />
        <Route path="/shelf" element={<Shelf />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);