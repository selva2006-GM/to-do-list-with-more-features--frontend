import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function UTracker() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    async function getTasks() {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch tasks");
        }

        const todayTasks = data.filter((task) => {
          const taskDate = String(task.task_date).split("T")[0];
          return taskDate === today;
        });

        setTasks(todayTasks);
      } catch (error) {
        console.error("GET TRACKER TASKS ERROR:", error);
        setError(error.message || "Failed to fetch tasks");
      } finally {
        setLoading(false);
      }
    }

    getTasks();
  }, [navigate, today]);

  const toggleTask = async (task) => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const completed = !task.completed;

      setTasks((currentTasks) =>
        currentTasks.map((item) =>
          item.task_id === task.task_id
            ? { ...item, completed }
            : item
        )
      );

      const response = await fetch(
        `${API_URL}/api/tasks/${task.task_id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            completed,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to update task");
      }

      await fetch(`${API_URL}/api/tasks/score`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("TASK UPDATED:", data);
    } catch (error) {
      console.error("UPDATE TASK ERROR:", error);

      setError(error.message || "Failed to update task");

      try {
        const token = localStorage.getItem("token");

        const response = await fetch(`${API_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        const todayTasks = data.filter((task) => {
          const taskDate = String(task.task_date).split("T")[0];
          return taskDate === today;
        });

        setTasks(todayTasks);
      } catch (reloadError) {
        console.error("FAILED TO RELOAD TASKS:", reloadError);
      }
    }
  };

  const completedTasks = tasks.filter(
    (task) => task.completed
  ).length;

  const totalTasks = tasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const score = completedTasks * 10;

  if (loading) {
    return (
      <div className="flex min-h-[300px] items-center justify-center">
        <p className="text-sm text-gray-500">
          Loading tasks...
        </p>
      </div>
    );
  }

  return (
    <main className="w-full">

      {/* HEADER */}
      <div className="mb-6">
        <p className="text-sm text-gray-500">
          Daily Tracker
        </p>

        <h1 className="mt-1 text-2xl font-semibold text-gray-900">
          Today's Tasks
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Complete your tasks and track your progress.
        </p>
      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* PROGRESS */}
      <div className="mb-6 rounded-xl border border-gray-200 bg-white p-5">

        <div className="flex items-center justify-between">

          <div>
            <p className="text-sm text-gray-500">
              Today's progress
            </p>

            <p className="mt-1 text-3xl font-semibold text-gray-900">
              {progress}%
            </p>
          </div>

          <div className="text-right">
            <p className="text-sm text-gray-500">
              Tasks
            </p>

            <p className="mt-1 font-semibold text-gray-900">
              {completedTasks} / {totalTasks}
            </p>
          </div>

        </div>

        <div className="mt-5 h-2 overflow-hidden rounded-full bg-gray-100">
          <div
            className="h-full rounded-full bg-green-500 transition-all duration-300"
            style={{
              width: `${progress}%`,
            }}
          />
        </div>

        <div className="mt-4 flex justify-between text-sm">
          <span className="text-gray-500">
            Score
          </span>

          <span className="font-medium text-gray-900">
            {score} points
          </span>
        </div>

      </div>

      {/* TASKS */}
      <div className="rounded-xl border border-gray-200 bg-white">

        <div className="border-b border-gray-200 px-5 py-4">
          <h2 className="font-semibold text-gray-900">
            Tasks
          </h2>
        </div>

        {tasks.length === 0 ? (
          <div className="p-8 text-center">

            <p className="text-sm text-gray-500">
              No tasks for today.
            </p>

            <button
              onClick={() => navigate("/ucreatetask")}
              className="mt-4 rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create Task
            </button>

          </div>
        ) : (
          <div className="divide-y divide-gray-100">

            {tasks.map((task) => (
              <div
                key={task.task_id}
                className="flex items-center gap-4 px-5 py-4"
              >

                <input
                  type="checkbox"
                  checked={Boolean(task.completed)}
                  onChange={() => toggleTask(task)}
                  className="h-5 w-5 cursor-pointer accent-green-600"
                />

                <div className="flex-1">
                  <p
                    className={`text-sm ${
                      task.completed
                        ? "text-gray-400 line-through"
                        : "text-gray-900"
                    }`}
                  >
                    {task.task_text}
                  </p>
                </div>

                <span
                  className={`text-xs ${
                    task.completed
                      ? "text-green-600"
                      : "text-gray-400"
                  }`}
                >
                  {task.completed ? "Done" : "+10"}
                </span>

              </div>
            ))}

          </div>
        )}

        {tasks.length > 0 && (
          <div className="border-t border-gray-200 px-5 py-4 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-500">
                Completed
              </span>

              <span className="font-medium text-gray-900">
                {completedTasks} / {totalTasks}
              </span>
            </div>
          </div>
        )}

      </div>

    </main>
  );
}