import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UCreateTask from "./components/UCreateTask";
import Tracker from "./components/Tracker";
import Dashboard from "./components/Dashboard";
import Heatmap from "./components/Heatmap";
import History from "./components/History";
import Leaderboard from "./components/Leaderboard";
import CreateTask from "./components/CreateTask";
import { ThemeProvider } from "./ThemeContext";
import UTracker from "./components/UTracker";

export default function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/login" element={<Login />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/register" element={<Register />} />
          <Route path="/ucreatetask" element={<UCreateTask />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/history" element={<History />} />
          <Route path="/heatmap" element={<Heatmap />} />
          <Route path="/leaderboard" element={<Leaderboard />} />
          <Route path = "/createtask" element= {<CreateTask/>}
          />
          <Route path="/utracker"
          element = {<UTracker/>}/>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}
