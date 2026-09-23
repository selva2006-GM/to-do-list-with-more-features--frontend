import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showReview, setShowReview] = useState(false);

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
      : Math.round((completedTasks / totalTasks) * 100);

  const score = completedTasks * 10;

  function saveReview() {
    const today = new Date().toISOString().split("T")[0];

    const trackerData =
      JSON.parse(localStorage.getItem("trackerData")) || {};

    trackerData[today] = {
      tasks,
      score,
      review,
      suggestions,
    };

    localStorage.setItem(
      "trackerData",
      JSON.stringify(trackerData)
    );

    alert("Your today's tracker data has been saved.");
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-8">

      <div className="mx-auto max-w-3xl">

        {/* Reminder */}
        <div className="mb-6 rounded-xl bg-yellow-100 p-5">
          <h2 className="text-xl font-bold text-yellow-900">
            🔔 Today's Reminder
          </h2>

          <p className="mt-2 text-yellow-800">
            Stay focused and complete your tasks one step
            at a time.
          </p>
        </div>

        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow">

          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">
                Today's Tracker
              </h1>

              <p className="mt-1 text-gray-500">
                Keep moving forward.
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">
                Score
              </p>

              <p className="text-3xl font-bold text-green-600">
                {score}
              </p>
            </div>
          </div>

          {/* Progress */}
          <div className="mt-6">

            <div className="mb-2 flex justify-between text-sm">
              <span>Progress</span>

              <span>
                {completedTasks}/{totalTasks} completed
              </span>
            </div>

            <div className="h-4 overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full rounded-full bg-green-500 transition-all"
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p className="mt-2 text-right text-sm text-gray-500">
              {progress}%
            </p>

          </div>
        </div>

        {/* Tasks */}
        <div className="mt-6 space-y-3">

          {tasks.map((task, index) => (
            <div
              key={task.id}
              className={`flex items-center gap-4 rounded-xl bg-white p-5 shadow ${
                task.completed
                  ? "opacity-60"
                  : ""
              }`}
            >

              {/* Checkbox */}
              <input
                type="checkbox"
                checked={task.completed}
                onChange={() => toggleTask(index)}
                className="h-5 w-5"
              />

              {/* Task */}
              <div className="flex-1">

                <p
                  className={`font-medium ${
                    task.completed
                      ? "line-through text-gray-400"
                      : "text-gray-900"
                  }`}
                >
                  {task.task}
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Duration: {task.duration} {task.unit}
                </p>

              </div>

              {/* Score */}
              <div className="text-sm font-semibold text-green-600">
                +10
              </div>

            </div>
          ))}

        </div>

        {/* Completed */}
        {showReview && (
          <div className="mt-8 rounded-2xl bg-white p-6 shadow">

            <h2 className="text-2xl font-bold">
              🎉 You completed today's tasks!
            </h2>

            <p className="mt-2 text-gray-600">
              You earned {score} points today.
            </p>

            {/* Review */}
            <div className="mt-6">

              <label className="font-medium">
                How was your day?
              </label>

              <textarea
                value={review}
                onChange={(e) =>
                  setReview(e.target.value)
                }
                placeholder="Write your review..."
                className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                rows="4"
              />

            </div>

            {/* Suggestions */}
            <div className="mt-5">

              <label className="font-medium">
                Any suggestions?
              </label>

              <textarea
                value={suggestions}
                onChange={(e) =>
                  setSuggestions(e.target.value)
                }
                placeholder="Tell us how we can improve..."
                className="mt-2 w-full rounded-lg border p-3 outline-none focus:border-blue-500"
                rows="4"
              />

            </div>

            {/* Signup */}
            <div className="mt-6 rounded-xl bg-gray-100 p-5">

              <h3 className="text-lg font-bold">
                🔓 Unlock your tracker
              </h3>

              <p className="mt-2 text-sm text-gray-600">
                Sign up to permanently save your daily
                progress, scores and reviews.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-4 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
              >
                Sign Up & Save Tracker
              </button>

            </div>

            {/* Temporary local save */}
            <button
              onClick={saveReview}
              className="mt-4 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Save Today's Data
            </button>

          </div>
        )}

      </div>
    </div>
  );
}