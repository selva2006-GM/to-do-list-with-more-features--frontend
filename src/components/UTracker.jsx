import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";

export default function UTracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [review, setReview] = useState("");
  const [showReview, setShowReview] = useState(false);

  const today = new Date().toISOString().split("T")[0];

  // =====================================================
  // FETCH TODAY'S TASKS
  // =====================================================

  useEffect(() => {
    async function getTasks() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/api/tasks`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        console.log("TRACKER TASKS:", data);

        const todayTasks = data.filter((task) => task.task_date === today);

        setTasks(todayTasks);
      } catch (error) {
        console.error("GET TRACKER TASKS ERROR:", error);

        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    getTasks();
  }, [navigate, today]);

  // =====================================================
  // TOGGLE TASK
  // =====================================================

  const toggleTask = async (task) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const newCompleted = !task.completed;

      // ---------------------------------------------
      // UPDATE UI IMMEDIATELY
      // ---------------------------------------------

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.task_id === task.task_id
            ? {
                ...item,
                completed: newCompleted,
              }
            : item,
        ),
      );

      // ---------------------------------------------
      // UPDATE TASK IN DATABASE
      // ---------------------------------------------

      const response = await fetch(`${API_URL}/api/tasks/${task.task_id}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`,
        },

        body: JSON.stringify({
          completed: newCompleted,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      console.log("TASK UPDATED:", data);

      // ---------------------------------------------
      // UPDATE SCORE
      // ---------------------------------------------

      const scoreResponse = await fetch(`${API_URL}/api/tasks/score`, {
        method: "POST",

        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const scoreData = await scoreResponse.json();

      if (!scoreResponse.ok) {
        throw new Error(scoreData.message || "Failed to update score");
      }

      console.log("SCORE UPDATED:", scoreData);
    } catch (error) {
      console.error("UPDATE TASK ERROR:", error);

      setError(error.message);

      // ---------------------------------------------
      // RELOAD TASKS FROM SERVER
      // ---------------------------------------------

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const todayTasks = data.filter((task) => task.task_date === today);

        setTasks(todayTasks);
      } catch (reloadError) {
        console.error("FAILED TO RELOAD TASKS:", reloadError);
      }
    }
  };

  // =====================================================
  // CALCULATE PROGRESS
  // =====================================================

  const completedTasks = tasks.filter((task) => task.completed).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const todayScore = completedTasks * 10;

  // =====================================================
  // SHOW REVIEW
  // =====================================================

  useEffect(() => {
    if (tasks.length > 0 && completedTasks === totalTasks) {
      setShowReview(true);
    } else {
      setShowReview(false);
    }
  }, [completedTasks, totalTasks, tasks.length]);

  // =====================================================
  // SUBMIT REVIEW
  // =====================================================

  const submitReview = () => {
    console.log("REVIEW:", review);

    localStorage.setItem(`review-${today}`, review);

    setShowReview(false);
  };

  // =====================================================
  // LOADING
  // =====================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />

        <div className="flex min-h-[70vh] items-center justify-center">
          <p className="text-gray-500">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  // =====================================================
  // UI
  // =====================================================

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />

      <main className="mx-auto max-w-3xl px-6 py-8">
        {/* HEADER */}

        <div className="mb-8">
          <button
            onClick={() => navigate("/dashboard")}
            className="mb-5 text-sm text-gray-500 hover:text-gray-900"
          >
            ← Back to dashboard
          </button>

          <p className="text-sm text-gray-500">Daily Tracker</p>

          <h1 className="mt-1 text-3xl font-semibold text-gray-900">
            Today's Tasks
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Complete your tasks and track your progress.
          </p>
        </div>

        {/* ERROR */}

        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {/* PROGRESS */}

        <div className="rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-gray-500">Today's progress</p>

              <p className="mt-1 text-3xl font-semibold text-gray-900">
                {progress}%
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-gray-500">Tasks</p>

              <p className="font-semibold text-gray-900">
                {completedTasks} / {totalTasks}
              </p>
            </div>
          </div>

          {/* PROGRESS BAR */}

          <div className="mt-5 h-3 overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full rounded-full bg-green-600 transition-all duration-300"
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          {/* SCORE */}

          <div className="mt-4 flex justify-between text-sm">
            <span className="text-gray-500">Today's score</span>

            <span className="font-semibold text-gray-900">
              {todayScore} points
            </span>
          </div>
        </div>

        {/* TASKS */}

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <h2 className="font-semibold text-gray-900">Tasks</h2>

          {tasks.length === 0 ? (
            <div className="mt-5 rounded-lg border border-dashed border-gray-300 p-8 text-center">
              <p className="text-gray-500">No tasks for today.</p>

              <button
                onClick={() => navigate("/create-task")}
                className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Create Task
              </button>
            </div>
          ) : (
            <div className="mt-5 space-y-3">
              {tasks.map((task) => (
                <label
                  key={task.task_id}
                  className={`flex cursor-pointer items-center gap-4 rounded-lg border p-4 transition ${
                    task.completed
                      ? "border-green-200 bg-green-50"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={task.completed}
                    onChange={() => toggleTask(task)}
                    className="h-5 w-5 rounded"
                  />

                  <div className="flex-1">
                    <p
                      className={`font-medium ${
                        task.completed
                          ? "text-gray-400 line-through"
                          : "text-gray-900"
                      }`}
                    >
                      {task.task_text}
                    </p>
                  </div>

                  <span
                    className={`text-sm ${
                      task.completed ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {task.completed ? "Completed" : "Pending"}
                  </span>
                </label>
              ))}
            </div>
          )}
        </div>

        {/* COMPLETION */}

        {tasks.length > 0 && completedTasks === totalTasks && (
          <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-6">
            <h2 className="font-semibold text-green-800">
              🎉 All tasks completed!
            </h2>

            <p className="mt-1 text-sm text-green-700">
              You earned {todayScore} points today.
            </p>
          </div>
        )}

        {/* REVIEW */}

        {showReview && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
            <h2 className="text-lg font-semibold text-gray-900">
              How was your day?
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Leave a short review about today's tasks.
            </p>

            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              placeholder="What went well? What could be improved?"
              rows={4}
              className="mt-4 w-full resize-none rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
            />

            <button
              onClick={submitReview}
              className="mt-4 rounded-lg bg-gray-900 px-5 py-3 text-sm font-medium text-white hover:bg-gray-800"
            >
              Submit Review
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
