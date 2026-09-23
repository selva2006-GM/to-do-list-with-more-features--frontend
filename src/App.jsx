import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import UCreateTask from "./components/UCreateTask"
import Tracker from "./components/Tracker";

import { ThemeProvider } from "./ThemeContext";

export default function App() {
    return (
        <ThemeProvider>
            <BrowserRouter>
                <Routes>

                    <Route
                        path="/"
                        element={<Home />}
                    />

                    <Route
                        path="/login"
                        element={<Login />}
                    />
                    <Route
          path="/tracker"
          element={<Tracker />}
        />
                    <Route
                        path="/register"
                        element={<Register />}
                    />
                    <Route
                        path="/ucreatetask"
                        element={<UCreateTask/>} 
                    />

                </Routes>
            </BrowserRouter>
        </ThemeProvider>
    );
}