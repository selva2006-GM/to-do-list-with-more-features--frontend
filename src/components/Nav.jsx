
import React from "react";
import "./Nav.css";

export default function Nav() {

    function reset() {
        const confirmReset = window.confirm(
            "Are you sure you want to reset all tasks?"
        );

        if (confirmReset) {
            localStorage.removeItem("tasks");

            // Refresh the page so the UI updates
            window.location.reload();
        }
    }

    return (
        <div className="Nav">
            <div className="logo">Tracker</div>

            <div className="Links">
                <a href="">Login</a>
                <a href="">Register</a>
                <a href="">Create Task</a>

                <button onClick={reset}>Reset</button>
            </div>
        </div>
    );
}

