import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

function CreateTask() {
    const navigate = useNavigate();

    const [tasks, setTasks] = useState([
        {
            taskText: "",
            taskDate: new Date().toLocaleDateString("en-CA"),
        },
    ]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // =====================================================
    // ADD NEW TASK INPUT
    // =====================================================

    const addTask = () => {
        setTasks((currentTasks) => [
            ...currentTasks,
            {
                taskText: "",
                taskDate:
                    new Date().toLocaleDateString("en-CA"),
            },
        ]);
    };

    // =====================================================
    // REMOVE TASK INPUT
    // =====================================================

    const removeTask = (index) => {
        if (tasks.length === 1) {
            return;
        }

        setTasks((currentTasks) =>
            currentTasks.filter(
                (_, taskIndex) => taskIndex !== index
            )
        );
    };

    // =====================================================
    // UPDATE TASK
    // =====================================================

    const updateTask = (index, field, value) => {
        setTasks((currentTasks) =>
            currentTasks.map((task, taskIndex) =>
                taskIndex === index
                    ? {
                          ...task,
                          [field]: value,
                      }
                    : task
            )
        );
    };

    // =====================================================
    // CREATE ALL TASKS
    // =====================================================

    const createTasks = async (e) => {
        e.preventDefault();

        setError("");

        // -------------------------------------------------
        // VALIDATE TASKS
        // -------------------------------------------------

        for (let i = 0; i < tasks.length; i++) {
            if (!tasks[i].taskText.trim()) {
                setError(
                    `Please enter task ${i + 1}.`
                );
                return;
            }

            if (!tasks[i].taskDate) {
                setError(
                    `Please select a date for task ${
                        i + 1
                    }.`
                );
                return;
            }
        }

        // -------------------------------------------------
        // TOKEN
        // -------------------------------------------------

        const token =
            localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);

            // -------------------------------------------------
            // CREATE TASKS
            // -------------------------------------------------

            for (const task of tasks) {
                const response = await fetch(
                    `${API_URL}/api/tasks`,
                    {
                        method: "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            Authorization:
                                `Bearer ${token}`,
                        },

                        body: JSON.stringify({
                            task_text:
                                task.taskText.trim(),

                            task_date:
                                task.taskDate,
                        }),
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to create task"
                    );
                }

                console.log(
                    "Task created:",
                    data
                );
            }

            // -------------------------------------------------
            // GO TO DASHBOARD
            // -------------------------------------------------

            navigate("/dashboard");

        } catch (error) {
            console.error(
                "CREATE TASKS ERROR:",
                error
            );

            setError(error.message);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-8">

            <div className="w-full max-w-2xl">

                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">

                    {/* HEADER */}

                    <div className="flex items-start justify-between">

                        <div>

                            <h1 className="text-2xl font-bold text-gray-900">
                                Create Tasks
                            </h1>

                            <p className="text-gray-500 mt-1">
                                Add multiple tasks to your tracker.
                            </p>

                        </div>

                        <span className="rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-600">
                            {tasks.length}{" "}
                            {tasks.length === 1
                                ? "task"
                                : "tasks"}
                        </span>

                    </div>


                    {/* FORM */}

                    <form
                        onSubmit={createTasks}
                        className="mt-6 space-y-4"
                    >

                        {tasks.map(
                            (task, index) => (

                            <div
                                key={index}
                                className="rounded-xl border border-gray-200 bg-gray-50 p-4"
                            >

                                {/* TASK HEADER */}

                                <div className="mb-4 flex items-center justify-between">

                                    <p className="font-medium text-gray-900">
                                        Task {index + 1}
                                    </p>

                                    {tasks.length >
                                        1 && (
                                        <button
                                            type="button"
                                            onClick={() =>
                                                removeTask(
                                                    index
                                                )
                                            }
                                            className="text-sm text-red-500 hover:text-red-700"
                                        >
                                            Remove
                                        </button>
                                    )}

                                </div>


                                {/* TASK TEXT */}

                                <div>

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Task
                                    </label>

                                    <input
                                        type="text"
                                        value={
                                            task.taskText
                                        }
                                        onChange={(e) =>
                                            updateTask(
                                                index,
                                                "taskText",
                                                e.target
                                                    .value
                                            )
                                        }
                                        placeholder="Enter your task"
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400"
                                    />

                                </div>


                                {/* DATE */}

                                <div className="mt-4">

                                    <label className="mb-2 block text-sm font-medium text-gray-700">
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        value={
                                            task.taskDate
                                        }
                                        onChange={(e) =>
                                            updateTask(
                                                index,
                                                "taskDate",
                                                e.target
                                                    .value
                                            )
                                        }
                                        className="w-full rounded-lg border border-gray-300 bg-white px-4 py-3 outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-400"
                                    />

                                </div>

                            </div>
                        ))}


                        {/* ADD TASK */}

                        <button
                            type="button"
                            onClick={addTask}
                            className="w-full rounded-lg border border-dashed border-gray-400 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        >
                            + Add Another Task
                        </button>


                        {/* ERROR */}

                        {error && (
                            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                                {error}
                            </div>
                        )}


                        {/* BUTTONS */}

                        <div className="flex gap-3 pt-2">

                            <button
                                type="button"
                                onClick={() =>
                                    navigate(-1)
                                }
                                disabled={loading}
                                className="flex-1 rounded-lg border border-gray-300 py-3 text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
                            >
                                Cancel
                            </button>


                            <button
                                type="submit"
                                disabled={loading}
                                className="flex-1 rounded-lg bg-gray-900 py-3 text-white transition hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                {loading
                                    ? "Creating..."
                                    : `Create ${tasks.length} ${
                                          tasks.length ===
                                          1
                                              ? "Task"
                                              : "Tasks"
                                      }`}
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
}

export default CreateTask;