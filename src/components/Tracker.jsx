import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showReview, setShowReview] = useState(false);

  const [currentTime, setCurrentTime] = useState(new Date());
  const [startTime, setStartTime] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Load today's tasks
  useEffect(() => {
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || {};

    if (!savedTasks[today]) {
      navigate("/ucreatetask");
      return;
    }

    setTasks(savedTasks[today]);

    // Load saved review data
    const savedTrackerData =
      JSON.parse(localStorage.getItem("trackerData")) || {};

    if (savedTrackerData[today]) {
      setReview(savedTrackerData[today].review || "");
      setSuggestions(
        savedTrackerData[today].suggestions || ""
      );
    }

    // Get today's tracker start time
    const trackerStartTimes =
      JSON.parse(
        localStorage.getItem("trackerStartTimes")
      ) || {};

    let todayStartTime = trackerStartTimes[today];

    // Create start time if it doesn't exist
    if (!todayStartTime) {
      todayStartTime = Date.now();

      trackerStartTimes[today] = todayStartTime;

      localStorage.setItem(
        "trackerStartTimes",
        JSON.stringify(trackerStartTimes)
      );
    }

    setStartTime(todayStartTime);
  }, [navigate]);

  // Live clock + timer
  useEffect(() => {
    if (!startTime) return;

    function updateTime() {
      const now = Date.now();

      setCurrentTime(new Date(now));

      const elapsed = Math.floor(
        (now - startTime) / 1000
      );

      setElapsedTime(elapsed);
    }

    updateTime();

    const timer = setInterval(updateTime, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);

    const minutes = Math.floor(
      (seconds % 3600) / 60
    );

    const secs = seconds % 60;

    return `${String(hours).padStart(2, "0")}:${String(
      minutes
    ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  }

  function toggleTask(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index].completed =
      !updatedTasks[index].completed;

    setTasks(updatedTasks);

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const savedTasks =
      JSON.parse(localStorage.getItem("tasks")) || {};

    savedTasks[today] = updatedTasks;

    localStorage.setItem(
      "tasks",
      JSON.stringify(savedTasks)
    );

    const completed =
      updatedTasks.length > 0 &&
      updatedTasks.every(
        (task) => task.completed
      );

    setShowReview(completed);
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
    const today = new Date()
      .toISOString()
      .split("T")[0];

    const trackerData =
      JSON.parse(localStorage.getItem("trackerData")) || {};

    trackerData[today] = {
      tasks,
      score,
      review,
      suggestions,
      startTime,
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

      {/* HEADER */}
      <header className="border-b bg-white">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">

          {/* DATE + CLOCK */}
          <div>
            <p className="text-sm text-gray-500">
              {currentTime.toLocaleDateString("en-IN", {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>

            <p className="text-2xl font-semibold text-gray-900">
              {currentTime.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </p>
          </div>

          {/* TIMER */}
          <div className="text-center">
            <p className="text-xs uppercase tracking-wide text-gray-500">
              Timer
            </p>

            <p className="text-2xl font-semibold text-gray-900 tabular-nums">
              {formatTime(elapsedTime)}
            </p>
          </div>

          {/* SCORE */}
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

        {/* BACK */}
        <button
          onClick={() => navigate(-2)}
          className="mb-6 flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-gray-900"
        >
          <span className="text-lg">←</span>
          Back
        </button>

        {/* TITLE */}
        <div className="mb-8">
          <p className="text-sm text-gray-500">
            Daily Tracker
          </p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Today's Tasks
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your tasks and track your progress.
          </p>
        </div>

        {/* PROGRESS CARD */}
        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-7">

          <div className="flex items-start justify-between">

            <div>
              <p className="text-sm text-gray-500">
                Today's progress
              </p>

              <p className="mt-1 text-4xl font-semibold text-gray-900">
                {progress}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Tasks
              </p>

              <p className="mt-1 text-2xl font-medium text-gray-900">
                {completedTasks} / {totalTasks}
              </p>
            </div>

          </div>

          {/* PROGRESS BAR */}
          <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* SCORE */}
          <div className="mt-6 flex justify-between">
            <p className="text-sm text-gray-500">
              Today's score
            </p>

            <p className="font-medium text-gray-900">
              {score} points
            </p>
          </div>

        </div>

        {/* TASK CARD */}
        <div className="rounded-2xl border border-gray-200 bg-white p-7">

          <h2 className="text-lg font-semibold text-gray-900">
            Tasks
          </h2>

          <div className="mt-6 space-y-3">

            {tasks.map((task, index) => (
              <div
                key={task.id}
                className="flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 transition hover:bg-gray-50"
              >

                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(index)}
                  className="h-5 w-5 cursor-pointer"
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

                </div>

                <span className="text-sm font-medium text-gray-500">
                  +10
                </span>

              </div>
            ))}

          </div>

        </div>

        {/* COMPLETED REVIEW */}
        {showReview && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7">

            <h2 className="text-xl font-semibold text-gray-900">
              Day completed 🎉
            </h2>

            <p className="mt-1 text-gray-500">
              You earned {score} points today.
            </p>

            {/* REVIEW */}
            <div className="mt-6">

              <label className="text-sm font-medium text-gray-900">
                How was your day?
              </label>

              <textarea
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
                rows="4"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                placeholder="Write a few words..."
              />

            </div>

            {/* SUGGESTIONS */}
            <div className="mt-5">

              <label className="text-sm font-medium text-gray-900">
                Suggestions
              </label>

              <textarea
                value={suggestions}
                onChange={(e) =>
                  setSuggestions(e.target.value)
                }
                rows="4"
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                placeholder="Anything you'd like to change?"
              />

            </div>

            {/* CREATE ACCOUNT */}
            <div className="mt-6 border-t pt-6">

              <p className="font-medium text-gray-900">
                Want to keep your progress?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create an account to save your tracker
                history and access it later.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create account
              </button>

            </div>

            {/* SAVE */}
            <button
              onClick={saveReview}
              className="mt-3 rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Save locally
            </button>

          </div>
        )}

      </main>
    </div>
  );
}