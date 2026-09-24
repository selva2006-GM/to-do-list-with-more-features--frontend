import React, { useEffect, useState } from "react";
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

    window.location.reload();
  }

  function reset() {
    const confirmReset = window.confirm(
      "Are you sure you want to reset all tasks?",
    );

    if (confirmReset) {
      localStorage.removeItem("tasks");
      localStorage.removeItem("taskSession");

      window.location.reload();
    }
  }

  return (
    <nav className="border-b border-gray-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src="/licon.svg" alt="Tracker" className="h-8 w-8" />

          <span className="text-xl font-semibold text-gray-900">Tracker</span>
        </Link>

        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          {!logged && (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-gray-600 transition hover:text-gray-900"
              >
                Login
              </Link>

              <Link
                to="/register"
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Register
              </Link>
            </>
          )}

          {logged && (
            <button
              onClick={logout}
              className="text-sm font-medium text-gray-600 transition hover:text-red-600"
            >
              Logout
            </button>
          )}

          {!logged && (
            <button
              onClick={reset}
              className="text-sm font-medium text-gray-500 transition hover:text-red-600"
            >
              Reset
            </button>
          )}

          <Link
            to="/ucreatetask"
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 hover:text-gray-900"
          >
            Create Task
          </Link>
        </div>
      </div>
    </nav>
  );
}
