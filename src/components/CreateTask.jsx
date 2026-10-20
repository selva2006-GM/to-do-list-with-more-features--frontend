import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateTask() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([
    {
      task: "",
      completed: false,
    },
  ]);

  const [error, setError] = useState("");

  function addTask() {
    setTasks((currentTasks) => [
      ...currentTasks,
      {
        task: "",
        completed: false,
      },
    ]);
  }

  function removeTask(index) {
    if (tasks.length === 1) {
      return;
    }

    setTasks((currentTasks) =>
      currentTasks.filter((_, i) => i !== index)
    );
  }

  function updateTask(index, value) {
    setTasks((currentTasks) =>
      currentTasks.map((task, i) =>
        i === index
          ? {
              ...task,
              task: value,
            }
          : task
      )
    );

    setError("");
  }

  function createTasks(e) {
    e.preventDefault();

    setError("");

    for (let i = 0; i < tasks.length; i++) {
      if (!tasks[i].task.trim()) {
        setError(`Please enter task ${i + 1}.`);
        return;
      }
    }

    const today = new Date()
      .toISOString()
      .split("T")[0];

    const existingData =
      JSON.parse(localStorage.getItem("tasks")) || {};

    existingData[today] = tasks.map((task, index) => ({
      id: index + 1,
      task: task.task.trim(),
      completed: false,
    }));

    localStorage.setItem(
      "tasks",
      JSON.stringify(existingData)
    );

    // Save today's tracker start time
    const trackerStartTimes =
      JSON.parse(
        localStorage.getItem("trackerStartTimes")
      ) || {};

    trackerStartTimes[today] = Date.now();

    localStorage.setItem(
      "trackerStartTimes",
      JSON.stringify(trackerStartTimes)
    );

    navigate("/tracker");
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

      <div className="w-full max-w-2xl">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">

          {/* HEADER */}
          <div className="flex items-start justify-between">

            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Create Tasks
              </h1>

              <p className="text-gray-500 mt-2">
                Add multiple tasks to your tracker.
              </p>
            </div>

            <span className="rounded-full bg-gray-100 px-4 py-2 text-sm text-gray-600">
              {tasks.length}{" "}
              {tasks.length === 1 ? "task" : "tasks"}
            </span>

          </div>

          {/* FORM */}
          <form
            onSubmit={createTasks}
            className="mt-8"
          >

            {/* TASKS */}
            <div className="space-y-4">

              {tasks.map((task, index) => (

                <div
                  key={index}
                  className="rounded-2xl border border-gray-200 bg-gray-50 p-5"
                >

                  {/* TASK HEADER */}
                  <div className="mb-6 flex items-center justify-between">

                    <p className="text-lg font-medium text-gray-900">
                      Task {index + 1}
                    </p>

                    {tasks.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeTask(index)}
                        className="text-sm text-red-500 hover:text-red-700"
                      >
                        Remove
                      </button>
                    )}

                  </div>

                  {/* TASK INPUT */}
                  <div>

                    <label className="mb-2 block text-sm font-medium text-gray-700">
                      Task
                    </label>

                    <input
                      type="text"
                      value={task.task}
                      onChange={(e) =>
                        updateTask(
                          index,
                          e.target.value
                        )
                      }
                      placeholder="Enter your task"
                      className="w-full rounded-xl border border-gray-300 bg-white px-5 py-4 text-base outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                    />

                  </div>

                </div>

              ))}

            </div>

            {/* ADD TASK */}
            <button
              type="button"
              onClick={addTask}
              className="mt-5 w-full rounded-xl border border-dashed border-gray-400 py-4 text-sm font-medium text-gray-800 transition hover:bg-gray-50"
            >
              + Add Another Task
            </button>

            {/* ERROR */}
            {error && (
              <div className="mt-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            {/* BUTTONS */}
            <div className="mt-7 flex gap-4">

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 rounded-xl border border-gray-300 bg-white py-4 text-base font-medium text-gray-700 transition hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="flex-1 rounded-xl bg-gray-900 py-4 text-base font-medium text-white transition hover:bg-gray-800"
              >
                Create {tasks.length}{" "}
                {tasks.length === 1 ? "Task" : "Tasks"}
              </button>

            </div>

          </form>

        </div>

      </div>

    </div>
  );
}