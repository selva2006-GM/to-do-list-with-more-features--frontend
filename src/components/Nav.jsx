
import React from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

export default function Nav() {

    function reset() {
        const confirmReset = window.confirm(
            "Are you sure you want to reset all tasks?"
        );

        if (confirmReset) {
            localStorage.removeItem("tasks");

            window.location.reload();
        }
    }

    return (
        <div className="Nav">
            <div className="logo">Tracker</div>

            <div className="Links">
            <Link to="/login">
                Login
            </Link>

            <Link to="/register">
                Register
            </Link>
                <a href="">Create Task</a>

                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}

