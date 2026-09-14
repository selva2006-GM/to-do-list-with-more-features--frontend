import React from "react";
import {
    BrowserRouter,
    Routes,
    Route
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import Register from "./components/Register";
import CreateTask from "./components/createTask";

export default function App() {

    return (
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
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/create-task"
                    element={<CreateTask />}
                />

            </Routes>

        </BrowserRouter>
    );
}
