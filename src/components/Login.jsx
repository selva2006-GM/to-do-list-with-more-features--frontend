import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function Login() {
    const navigate = useNavigate();

    const [identifier, setIdentifier] = useState("");
    const [password, setPassword] = useState("");

    async function login(e) {
        e.preventDefault();

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    identifier,
                    password,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Login failed");
                return;
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            if (data.user) {
                localStorage.setItem(
                    "user",
                    JSON.stringify(data.user)
                );
            }
            navigate("/dashboard");

        } catch (error) {
            console.error("LOGIN ERROR:", error);
            alert("Unable to connect to server.");
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 px-4">

            <div className="w-full max-w-md">

                <form
                    onSubmit={login}
                    className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm"
                >

                    {/* Heading */}
                    <div className="mb-7">
                        <h1 className="text-2xl font-semibold text-gray-900">
                            Welcome back
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Login to continue tracking your progress.
                        </p>
                    </div>


                    {/* Email / Username */}
                    <div className="mb-4">
                        <label
                            htmlFor="identifier"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Email or Username
                        </label>

                        <input
                            id="identifier"
                            type="text"
                            placeholder="Enter your email or username"
                            value={identifier}
                            onChange={(e) =>
                                setIdentifier(e.target.value)
                            }
                            autoComplete="username"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                        />
                    </div>


                    {/* Password */}
                    <div className="mb-6">
                        <label
                            htmlFor="password"
                            className="mb-2 block text-sm font-medium text-gray-700"
                        >
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            autoComplete="current-password"
                            required
                            className="w-full rounded-lg border border-gray-300 px-3 py-2.5 text-sm text-gray-900 outline-none transition focus:border-gray-500 focus:ring-1 focus:ring-gray-500"
                        />
                    </div>


                    {/* Login Button */}
                    <button
                        type="submit"
                        className="w-full rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:bg-gray-950"
                    >
                        Login
                    </button>


                    {/* Register */}
                    <p className="mt-6 text-center text-sm text-gray-500">
                        Don't have an account?{" "}

                        <Link
                            to="/register"
                            className="font-medium text-gray-900 hover:underline"
                        >
                            Register
                        </Link>
                    </p>

                </form>

            </div>

        </div>
    );
}