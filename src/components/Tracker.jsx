import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Tracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [review, setReview] = useState("");
  const [suggestions, setSuggestions] = useState("");
  const [showReview, setShowReview] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};

    if (!savedTasks[today]) {
      navigate("/ucreatetask");
      return;
    }

    setTasks(savedTasks[today]);

    const savedTrackerData =
      JSON.parse(localStorage.getItem("trackerData")) || {};

    if (savedTrackerData[today]) {
      setReview(savedTrackerData[today].review || "");
      setSuggestions(savedTrackerData[today].suggestions || "");
    }

    setShowReview(
      savedTasks[today].length > 0 &&
        savedTasks[today].every((task) => task.completed),
    );
  }, [navigate]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  function toggleTask(index) {
    const updatedTasks = [...tasks];

    updatedTasks[index] = {
      ...updatedTasks[index],
      completed: !updatedTasks[index].completed,
    };

    setTasks(updatedTasks);

    const today = new Date().toISOString().split("T")[0];
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || {};

    savedTasks[today] = updatedTasks;
    localStorage.setItem("tasks", JSON.stringify(savedTasks));

    const completed =
      updatedTasks.length > 0 &&
      updatedTasks.every((task) => task.completed);

    setShowReview(completed);
  }

  const completedTasks = tasks.filter((task) => task.completed).length;
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
      ...trackerData[today],
      tasks,
      score,
      review,
      suggestions,
    };

    localStorage.setItem("trackerData", JSON.stringify(trackerData));
    alert("Today's data saved.");
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-4xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Daily Tracker</p>

          <h1 className="mt-1 text-3xl font-bold text-gray-900">
            Today's Tasks
          </h1>

          <p className="mt-2 text-gray-500">
            Complete your tasks and track your progress.
          </p>
        </div>

        <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-7">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's progress</p>

              <p className="mt-1 text-4xl font-semibold text-gray-900">
                {progress}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Tasks</p>

              <p className="mt-1 text-2xl font-medium text-gray-900">
                {completedTasks} / {totalTasks}
              </p>
            </div>
          </div>

          <div className="mt-6 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-gray-900 transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="mt-6 flex justify-between">
            <p className="text-sm text-gray-500">Today's score</p>

            <p className="font-medium text-gray-900">{score} points</p>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-7">
          <h2 className="text-lg font-semibold text-gray-900">Tasks</h2>

          <div className="mt-6 space-y-3">
            {tasks.map((task, index) => (
              <div
                key={task.id ?? index}
                className="flex items-center gap-4 rounded-xl border border-gray-200 px-5 py-4 transition hover:bg-gray-50"
              >
                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
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

                <span className="text-sm font-medium text-gray-500">+10</span>
              </div>
            ))}
          </div>
        </div>

        {showReview && (
          <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-7">
            <h2 className="text-xl font-semibold text-gray-900">
              Day completed
            </h2>

            <p className="mt-1 text-gray-500">
              You earned {score} points today.
            </p>

            <div className="mt-6">
              <label className="text-sm font-medium text-gray-900">
                How was your day?
              </label>

              <textarea
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                placeholder="Write a few words..."
              />
            </div>

            <div className="mt-5">
              <label className="text-sm font-medium text-gray-900">
                Suggestions
              </label>

              <textarea
                value={suggestions}
                onChange={(e) => setSuggestions(e.target.value)}
                rows={4}
                className="mt-2 w-full rounded-lg border border-gray-300 p-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
                placeholder="Anything you'd like to change?"
              />
            </div>

            <div className="mt-6 border-t pt-6">
              <p className="font-medium text-gray-900">
                Want to keep your progress?
              </p>

              <p className="mt-1 text-sm text-gray-500">
                Create an account to save your tracker history and access it
                later.
              </p>

              <button
                onClick={() => navigate("/register")}
                className="mt-4 rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800"
              >
                Create account
              </button>
            </div>

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