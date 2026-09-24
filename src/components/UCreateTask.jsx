import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function UcreateTask() {
  const [tasks, setTasks] = useState([]);
  const navigate = useNavigate();
  function Taskinput() {
    setTasks([
      ...tasks,
      {
        task: "",
        duration: "",
        unit: "minutes",
        completed: false,
      },
    ]);
  }

  function handleTaskChange(index, value) {
    const updatedTasks = [...tasks];
    updatedTasks[index].task = value;
    setTasks(updatedTasks);
  }

  function handleDurationChange(index, value) {
    const updatedTasks = [...tasks];
    updatedTasks[index].duration = value;
    setTasks(updatedTasks);
  }

  function handleUnitChange(index, value) {
    const updatedTasks = [...tasks];
    updatedTasks[index].unit = value;
    setTasks(updatedTasks);
  }

  function discardTask(index) {
    setTasks(tasks.filter((_, i) => i !== index));
  }

  function savedata() {
    const today = new Date().toISOString().split("T")[0];
  
    const existingData =
      JSON.parse(localStorage.getItem("tasks")) || {};
  
    existingData[today] = tasks.map((task, index) => ({
      id: index + 1,
      task: task.task,
      duration: Number(task.duration),
      unit: task.unit,
      completed: false,
    }));
  
    localStorage.setItem(
      "tasks",
      JSON.stringify(existingData)
    );
  
    navigate("/tracker");
  }

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10">
      <div className="mx-auto max-w-3xl rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-3xl font-bold text-gray-900">
          Create Tasks
        </h1>

        <p className="mt-2 mb-6 text-sm text-gray-500">
          Add tasks and set their duration.
        </p>

        <button
          onClick={Taskinput}
          className="mb-6 rounded-lg bg-green-600 px-5 py-2.5 font-semibold text-white hover:bg-green-700"
        >
          + Add Task
        </button>

        <div className="space-y-4">
          {tasks.map((task, index) => (
            <div
              key={index}
              className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"
            >
              {/* Task */}
              <input
                type="text"
                value={task.task}
                placeholder={`Task ${index + 1}`}
                onChange={(e) =>
                  handleTaskChange(index, e.target.value)
                }
                className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />

              {/* Duration */}
              <input
                type="number"
                min="1"
                value={task.duration}
                placeholder="Duration"
                onChange={(e) =>
                  handleDurationChange(index, e.target.value)
                }
                className="w-28 rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              />

              {/* Unit */}
              <select
                value={task.unit}
                onChange={(e) =>
                  handleUnitChange(index, e.target.value)
                }
                className="rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200"
              >
                <option value="minutes">Minutes</option>
                <option value="hours">Hours</option>
              </select>

              {/* Delete */}
              <button
                onClick={() => discardTask(index)}
                title="Discard task"
                className="rounded-lg p-2 text-red-500 hover:bg-red-50 hover:text-red-700"
              >
                🗑️
              </button>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <p className="mt-4 rounded-lg border border-dashed border-gray-300 p-6 text-center text-gray-500">
            No tasks added yet.
          </p>
        )}

        {tasks.length > 0 && (
          <button
            onClick={savedata}
            className="mt-8 w-full rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Save All Tasks
          </button>
        )}
      </div>
    </div>
  );
}