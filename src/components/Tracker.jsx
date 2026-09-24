import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showReview, setShowReview] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());

  // Timer: seconds elapsed since opening tracker
  const [elapsedTime, setElapsedTime] = useState(0);

  // Real clock + timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      setElapsedTime((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Format timer as HH:MM:SS
  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  // Load today's tasks
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];

    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || {};

    if (!savedTasks[today]) {
      navigate("/ucreatetask");
      return;
    }

    setTasks(savedTasks[today]);
  }, [navigate]);

  function toggleTask(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed =
      !updatedTasks[index].completed;

    setTasks(updatedTasks);

    const today = new Date().toISOString().split("T")[0];

    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || {};

    savedTasks[today] = updatedTasks;

    localStorage.setItem(
      "tasks",
      JSON.stringify(savedTasks)
    );

    const completed = updatedTasks.every(
      (task) => task.completed
    );

    if (completed) {
      setShowReview(true);
    }
  }

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round(
          (completedTasks / totalTasks) * 100
        );

  const score = completedTasks * 10;

  function saveReview() {
    const today = new Date().toISOString().split("T")[0];

    const trackerData =
      JSON.parse(
        localStorage.getItem("trackerData")
      ) || {};

    trackerData[today] = {
      tasks,
      score,
      review,
      suggestions,
      elapsedTime,
    };

    localStorage.setItem(
      "trackerData",
      JSON.stringify(trackerData)
    );

    alert("Today's data saved.");
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* TOP BAR */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">

          {/* Date + Clock */}
          <div>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString(
                "en-IN",
                {
                  weekday: "long",
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                }
              )}
            </p>

            <p className="text-2xl font-semibold text-gray-900">
              {currentTime.toLocaleTimeString(
                "en-IN",
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  second: "2-digit",
                }
              )}
            </p>
          </div>

          {/* Timer */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Timer
            </p>

            <p className="text-2xl font-semibold text-gray-900 tabular-nums">
              {formatTime(elapsedTime)}
            </p>
          </div>

          {/* Score */}
          <div className="text-right">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Score
            </p>

            <p className="text-2xl font-semibold text-gray-900">
              {score}
            </p>
          </div>

        </div>
      </header>

      {/* MAIN */}
      <main className="mx-auto max-w-4xl px-6 py-8">

        {/* Reminder */}
        <div className="mb-6">
          <p className="text-sm text-gray-500">
            Reminder
          </p>

          <p className="mt-1 text-lg text-gray-800">
            Focus on one task at a time.
          </p>
        </div>

        {/* Progress */}
        <div className="mb-8 rounded-xl border bg-white p-6">

          <div className="mb-3 flex justify-between">

            <span className="font-medium">
              Today's progress
            </span>

            <span className="text-sm text-gray-500">
              {completedTasks} / {totalTasks}
            </span>

          </div>

          <div className="h-2 rounded-full bg-gray-200">

            <div
              className="h-2 rounded-full bg-green-600 transition-all"
              style={{
                width: `${progress}%`,
              }}
            />

          </div>

          <p className="mt-2 text-right text-sm text-gray-500">
            {progress}%
          </p>

        </div>

        {/* TASKS */}
        <div className="space-y-3">

          {tasks.map((task, index) => (

            <div
              key={task.id}
              className="flex items-center gap-4 rounded-xl border bg-white px-5 py-4"
            >

              <input
                type="checkbox"
                checked={task.completed}
                onChange={() =>
                  toggleTask(index)
                }
                className="h-5 w-5"
              />

              <div className="flex-1">

                <p
                  className={
                    task.completed
                      ? "text-gray-400 line-through"
                      : "text-gray-900"
                  }
                >
                  {task.task}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  {task.duration} {task.unit}
                </p>

              </div>

              <span className="text-sm text-gray-500">
                +10
              </span>

            </div>

          ))}

        </div>

        {/* COMPLETED */}
        {showReview && (

          <div className="mt-8 rounded-xl border bg-white p-6">

            <h2 className="text-xl font-semibold">
              Day completed
            </h2>

            <p className="mt-1 text-gray-500">
              You earned {score} points today.
            </p>

            {/* Review */}
            <div className="mt-6">

              <label className="text-sm font-medium">
                How was your day?
              </label>

              <textarea
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
                rows="4"
                className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-gray-500"
                placeholder="Write a few words..."
              />

            </div>

            {/* Suggestions */}
            <div className="mt-5">

              <label className="text-sm font-medium">
                Suggestions
              </label>

              <textarea
                value={suggestions}
                onChange={(e) =>
                  setSuggestions(e.target.value)
                }
                rows="4"
                className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-gray-500"
                placeholder="Anything you'd like to change?"
              />

            </div>

            {/* Signup */}
            <div className="mt-6 border-t pt-6">

              <p className="font-medium">
                Want to keep your progress?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create an account to save your tracker
                history and access it later.
              </p>

              <button
                onClick={() =>
                  navigate("/register")
                }
                className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create account
              </button>

            </div>

            <button
              onClick={saveReview}
              className="mt-3 rounded-lg border px-5 py-2.5 text-sm font-medium hover:bg-gray-50"
            >
              Save locally
            </button>

          </div>

        )}

      </main>

    </div>
  );
}