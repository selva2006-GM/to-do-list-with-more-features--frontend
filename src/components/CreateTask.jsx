import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function CreateTask() {
  const navigate = useNavigate();

  const [taskText, setTaskText] = useState("");
  const [taskDate, setTaskDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const createTask = async (e) => {
    e.preventDefault();

    setError("");

    if (!taskText.trim()) {
      setError("Please enter a task.");
      return;
    }

    if (!taskDate) {
      setError("Please select a date.");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/tasks`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          task_text: taskText.trim(),
          task_date: taskDate,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to create task");
      }

      console.log("Task created:", data);

      // Clear input
      setTaskText("");

      // Go to dashboard
      navigate("/dashboard");

    } catch (error) {
      console.error("CREATE TASK ERROR:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4">

      <div className="w-full max-w-lg">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

          <h1 className="text-2xl font-bold text-gray-900">
            Create Task
          </h1>

          <p className="text-gray-500 mt-1 mb-6">
            Add a task to your tracker.
          </p>

          <form onSubmit={createTask} className="space-y-5">

            {/* Task */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Task
              </label>

              <input
                type="text"
                value={taskText}
                onChange={(e) => setTaskText(e.target.value)}
                placeholder="Enter your task"
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-gray-400
                           focus:border-gray-400"
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date
              </label>

              <input
                type="date"
                value={taskDate}
                onChange={(e) => setTaskDate(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-3
                           outline-none focus:ring-2 focus:ring-gray-400
                           focus:border-gray-400"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600
                              rounded-lg px-4 py-3 text-sm">
                {error}
              </div>
            )}

            {/* Buttons */}
            <div className="flex gap-3">

              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 border border-gray-300 text-gray-700
                           py-3 rounded-lg hover:bg-gray-50 transition"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-gray-900 text-white py-3 rounded-lg
                           hover:bg-gray-800 transition disabled:opacity-50"
              >
                {loading ? "Creating..." : "Create Task"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}

export default CreateTask;