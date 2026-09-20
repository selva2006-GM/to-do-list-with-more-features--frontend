import React, { useEffect, useState } from "react";
import "./Nav.css";
import { Link } from "react-router-dom";

export default function Nav() {
    const [logged, setlogget] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            setlogget(true);
        } else {
            setlogget(false);
        }
    }, []);

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setlogget(false);
    }

    function reset() {
        const confirmReset = window.confirm(
            "Are you sure you want to reset all tasks?"
        );

        if (confirmReset) {
            localStorage.removeItem("tasks");
            localStorage.removeItem("taskSession");

            window.location.reload();
        }
    }

    return (
        <div className="Nav">

            <div className="logo">
                <Link to="/">
                    Tracker
                </Link>
            </div>

            <div className="Links">

                {!logged && (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

                {logged && (
                    <button onClick={logout}>
                        Logout
                    </button>
                )}

                {/* <Link to="/create-task">
                    Create Task
                </Link> */}

                <button onClick={reset}>
                    Reset
                </button>

            </div>

        </div>
    );
}