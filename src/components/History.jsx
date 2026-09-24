import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";

export default function History() {
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchTasks = async () => {
            try {
                const token = localStorage.getItem("token");

                if (!token) {
                    setError("Please login first.");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/tasks`,
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                            "Failed to fetch task history"
                    );
                }

                setTasks(data);
            } catch (error) {
                console.error(
                    "HISTORY ERROR:",
                    error
                );

                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTasks();
    }, []);

    // =====================================================
    // GROUP TASKS BY DATE
    // =====================================================

    const groupedTasks = tasks.reduce(
        (groups, task) => {
            const date = String(task.task_date)
                .split("T")[0];

            if (!groups[date]) {
                groups[date] = [];
            }

            groups[date].push(task);

            return groups;
        },
        {}
    );

    const dates = Object.keys(groupedTasks).sort(
        (a, b) => b.localeCompare(a)
    );

    // =====================================================
    // FORMAT DATE
    // =====================================================

    const formatDate = (dateString) => {
        const date = new Date(
            `${dateString}T00:00:00`
        );

        return date.toLocaleDateString(
            "en-IN",
            {
                weekday: "long",
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <Nav />

            <main className="mx-auto max-w-4xl px-6 py-8">

                {/* BACK */}

                <Link
                    to="/dashboard"
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                >
                    ← Back to Dashboard
                </Link>


                {/* HEADER */}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                    <h1 className="text-2xl font-semibold text-gray-900">
                        Task History
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        View your previous tasks and progress.
                    </p>

                </div>


                {/* ERROR */}

                {error && (
                    <div className="mt-6 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
                        {error}
                    </div>
                )}


                {/* LOADING */}

                {loading && (
                    <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">

                        <p className="text-sm text-gray-500">
                            Loading history...
                        </p>

                    </div>
                )}


                {/* NO TASKS */}

                {!loading &&
                    !error &&
                    tasks.length === 0 && (

                    <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">

                        <p className="text-gray-500">
                            No task history yet.
                        </p>

                        <Link
                            to="/create-task"
                            className="mt-4 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
                        >
                            Create a Task
                        </Link>

                    </div>
                )}


                {/* HISTORY */}

                {!loading &&
                    !error &&
                    dates.length > 0 && (

                    <div className="mt-6 space-y-6">

                        {dates.map((date) => {

                            const dayTasks =
                                groupedTasks[date];

                            const completed =
                                dayTasks.filter(
                                    (task) =>
                                        task.completed
                                ).length;

                            const total =
                                dayTasks.length;

                            const percentage =
                                total === 0
                                    ? 0
                                    : Math.round(
                                          (completed /
                                              total) *
                                              100
                                      );

                            return (
                                <div
                                    key={date}
                                    className="rounded-xl border border-gray-200 bg-white p-6"
                                >

                                    {/* DATE HEADER */}

                                    <div className="flex items-center justify-between">

                                        <div>

                                            <h2 className="font-semibold text-gray-900">
                                                {formatDate(
                                                    date
                                                )}
                                            </h2>

                                            <p className="mt-1 text-sm text-gray-500">
                                                {completed} of{" "}
                                                {total} tasks completed
                                            </p>

                                        </div>


                                        {/* SCORE */}

                                        <div className="text-right">

                                            <p className="text-lg font-semibold text-gray-900">
                                                {completed *
                                                    10}
                                            </p>

                                            <p className="text-xs text-gray-500">
                                                points
                                            </p>

                                        </div>

                                    </div>


                                    {/* PROGRESS */}

                                    <div className="mt-4 h-2 rounded-full bg-gray-200">

                                        <div
                                            className="h-2 rounded-full bg-green-600 transition-all"
                                            style={{
                                                width:
                                                    `${percentage}%`,
                                            }}
                                        />

                                    </div>


                                    {/* TASKS */}

                                    <div className="mt-5 space-y-2">

                                        {dayTasks.map(
                                            (task) => (

                                            <div
                                                key={
                                                    task.task_id
                                                }
                                                className={`flex items-center justify-between rounded-lg border px-4 py-3 ${
                                                    task.completed
                                                        ? "border-green-100 bg-green-50"
                                                        : "border-gray-100 bg-gray-50"
                                                }`}
                                            >

                                                <div className="flex items-center gap-3">

                                                    <div
                                                        className={`flex h-5 w-5 items-center justify-center rounded-full ${
                                                            task.completed
                                                                ? "bg-green-600 text-white"
                                                                : "border-2 border-gray-300"
                                                        }`}
                                                    >
                                                        {task.completed &&
                                                            "✓"}
                                                    </div>


                                                    <span
                                                        className={
                                                            task.completed
                                                                ? "text-gray-400 line-through"
                                                                : "text-gray-800"
                                                        }
                                                    >
                                                        {
                                                            task.task_text
                                                        }
                                                    </span>

                                                </div>


                                                <span
                                                    className={`text-xs font-medium ${
                                                        task.completed
                                                            ? "text-green-600"
                                                            : "text-gray-400"
                                                    }`}
                                                >
                                                    {task.completed
                                                        ? "Completed"
                                                        : "Pending"}
                                                </span>

                                            </div>

                                        ))}

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

            </main>
        </div>
    );
}