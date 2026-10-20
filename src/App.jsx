
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UCreateTask from "./components/UCreateTask";
import Tracker from "./components/Tracker";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Leaderboard from "./components/Leaderboard";
import CreateTask from "./components/CreateTask";
import UTracker from "./components/UTracker";
import Heatmapdash from "./components/Heatmapdash";

import { ThemeProvider } from "./ThemeContext";

export default function App() {
    const token = localStorage.getItem("token");

    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>
                    <Route
                        path="/"
                        element={
                            token ? (
                                <Navigate to="/dashboard" replace />
                            ) : (
                                <Home />
                            )
                        }
                    />

                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/tracker" element={<Tracker />} />
                    <Route path="/ucreatetask" element={<UCreateTask />} />
                    <Route
    path="/dashboard"
    element={token ? <Dashboard /> : <Navigate to="/login" replace />}
/>
                    <Route path="/history" element={<History />} />
                    <Route path="/heatmapdash" element={<Heatmapdash />} />
                    <Route path="/leaderboard" element={<Leaderboard />} />
                    <Route path="/createtask" element={<CreateTask />} />
                    <Route path="/utracker" element={<UTracker />} />
                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}
