import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./auth.css";

export default function Login() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    function login(e) {
        e.preventDefault();

        const savedUser = localStorage.getItem("user");

        if (!savedUser) {
            alert("No account found. Please register first.");
            return;
        }

        const user = JSON.parse(savedUser);

        if (
            user.email !== email ||
            user.password !== password
        ) {
            alert("Invalid email or password");
            return;
        }

        localStorage.setItem(
            "isLoggedIn",
            "true"
        );

        navigate("/create-task");
    }

    return (
        <div className="auth-container">

            <form
                className="auth-form"
                onSubmit={login}
            >

                <h1>Login</h1>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) =>
                        setEmail(e.target.value)
                    }
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) =>
                        setPassword(e.target.value)
                    }
                />

                <button type="submit">
                    Login
                </button>

                <p>
                    Don't have an account?{" "}
                    <Link to="/register">
                        Register
                    </Link>
                </p>

            </form>

        </div>
    );
}

