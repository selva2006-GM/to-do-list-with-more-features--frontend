
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function UCreateTask() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([
    {
      taskText: "",
      taskDate: new Date().toLocaleDateString("en-CA"),
    },
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const addTask = () => {
    setTasks((prev) => [
      ...prev,
      {
        taskText: "",
        taskDate: new Date().toLocaleDateString("en-CA"),
      },
    ]);
  };

  const removeTask = (index) => {
    setTasks((prev) => prev.filter((_, i) => i !== index));
  };

  const updateTask = (index, field, value) => {
    setTasks((prev) =>
      prev.map((task, i) =>
        i === index ? { ...task, [field]: value } : task
      )
    );
  };

  const createTasks = async (e) => {
    e.preventDefault();
    setError("");

    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].taskText.trim()) {
        setError(`Please enter task ${i + 1}.`);
        return;
      }

      if (!tasks[i].taskDate) {
        setError(`Please select a date for task ${i + 1}.`);
        return;
      }
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      for (const task of tasks) {
        const response = await fetch(`${API_URL}/api/tasks`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            task_text: task.taskText.trim(),
            task_date: task.taskDate,
          }),
        });

        const data = await response.json().catch(() => ({}));

        if (!response.ok) {
          throw new Error(data.message || "Failed to create task.");
        }
      }

      navigate("/dashboard");
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
        <button className=" rounded-lg bg-gray-900 px-6 py-2.5 m-1 text-sm font-medium text-white transition hover:bg-gray-800 active:bg-gray-950 disabled:cursor-not-allowed disabled:opacity-60" onClick={()=>navigate("/")}>Back</button>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">
            Create Tasks
          </h1>

          <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
            {tasks.length} {tasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        <form onSubmit={createTasks} className="mt-6 space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="rounded-xl border border-gray-200 bg-gray-50 p-4"
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="font-medium text-gray-900">
                  Task {index + 1}
                </h2>

                {tasks.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeTask(index)}
                    disabled={loading}
                    className="text-sm font-medium text-red-600 hover:text-red-800 disabled:opacity-50"
                  >
                    Remove
                  </button>
                )}
              </div>

              <div>
                <label
                  htmlFor={`task-text-${index}`}
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Task
                </label>

                <input
                  id={`task-text-${index}`}
                  type="text"
                  value={task.taskText}
                  onChange={(e) =>
                    updateTask(index, "taskText", e.target.value)
                  }
                  placeholder="Enter your task"
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
                />
              </div>

              <div className="mt-4">
                <label
                  htmlFor={`task-date-${index}`}
                  className="mb-2 block text-sm font-medium text-gray-800"
                >
                  Due date
                </label>

                <input
                  id={`task-date-${index}`}
                  type="date"
                  value={task.taskDate}
                  onChange={(e) =>
                    updateTask(index, "taskDate", e.target.value)
                  }
                  required
                  disabled={loading}
                  className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 text-gray-900 outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600"
                />
              </div>
            </div>
          ))}

          <button
            type="button"
            onClick={addTask}
            disabled={loading}
            className="w-full rounded-lg border border-dashed border-gray-400 py-3 font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
          >
            + Add Another Task
          </button>

          {error && (
            <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
              {error}
            </p>
          )}

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={() => navigate(-1)}
              disabled={loading}
              className="flex-1 rounded-lg border border-gray-300 py-3 font-medium text-gray-800 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-gray-900 py-3 font-medium text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Creating..."
                : `Create ${tasks.length} ${
                    tasks.length === 1 ? "Task" : "Tasks"
                  }`}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UCreateTask;
