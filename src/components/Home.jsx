import React from "react";
import Nav from "./Nav";
import Leaderboard from "./Leaderboard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function ucreatetask() {
    navigate("/ucreatetask");
  }

  return (
    <>
      <Nav />

      {!token && (
        <main className="min-h-screen bg-gray-100">
          <section className="mx-auto max-w-6xl px-6 py-16">
            {/* Hero */}
            <div className="flex flex-col items-center text-center">
              <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                Hello, what's your plan for today?
              </h1>

              <p className="mt-4 max-w-xl text-base text-gray-500">
                Create your tasks, stay consistent, and keep track of your
                progress every day.
              </p>

              <button
                onClick={ucreatetask}
                className="mt-7 rounded-lg bg-green-800 px-6 py-3 text-sm font-semibold text-white transition hover:bg-green-700 active:bg-green-900"
              >
                Create Task
              </button>
            </div>

            {/* Leaderboard */}
            <div className="mt-16">
              <Leaderboard />
            </div>
          </section>
        </main>
      )}
    </>
  );
}
