import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [rank, setRank] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activity, setActivity] = useState({});

    // Use local date instead of UTC date
    const today = new Date().toLocaleDateString("en-CA");

    // =====================================================
    // LOAD USER
    // =====================================================

    useEffect(() => {
        const savedUser = JSON.parse(
            localStorage.getItem("user")
        );

        setUser(savedUser);
    }, []);

    // =====================================================
    // GET ALL TASKS FROM DATABASE
    // =====================================================

    useEffect(() => {
        async function getTasks() {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    console.log("No token found");
                    setLoading(false);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/tasks`,
                    {
                        method: "GET",
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log(
                    "ALL TASKS FROM SERVER:",
                    data
                );

                if (!response.ok) {
                    console.error(
                        "Tasks error:",
                        data
                    );

                    setLoading(false);
                    return;
                }

                // IMPORTANT:
                // Keep ALL tasks here.
                // Do NOT filter to today here.
                setTasks(data);

                // =================================================
                // BUILD HEATMAP ACTIVITY
                // =================================================

                const activityData = {};

                data.forEach((task) => {
                    if (!task.task_date) {
                        return;
                    }

                    const date =
                        String(task.task_date)
                            .split("T")[0];

                    if (!activityData[date]) {
                        activityData[date] = {
                            total: 0,
                            completed: 0,
                        };
                    }

                    // Every task counts toward total
                    activityData[date].total += 1;

                    // Completed task counts toward completed
                    if (task.completed === true) {
                        activityData[date].completed += 1;
                    }
                });

                console.log(
                    "HEATMAP ACTIVITY:",
                    activityData
                );

                setActivity(activityData);

            } catch (error) {
                console.error(
                    "Failed to fetch tasks:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        getTasks();
    }, []);

    // =====================================================
    // GET USER RANK
    // =====================================================

    useEffect(() => {
        async function getRank() {
            try {
                const token =
                    localStorage.getItem("token");

                if (!token) {
                    setRank(null);
                    return;
                }

                const response = await fetch(
                    `${API_URL}/api/tasks/my-rank`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`,
                        },
                    }
                );

                const data =
                    await response.json();

                if (!response.ok) {
                    console.error(
                        "Rank error:",
                        data
                    );

                    setRank(null);
                    return;
                }

                setRank(data.rank);

            } catch (error) {
                console.error(
                    "Failed to fetch rank:",
                    error
                );

                setRank(null);
            }
        }

        getRank();
    }, []);

    // =====================================================
    // TODAY'S TASKS
    // =====================================================

    const todayTasks = tasks.filter(
        (task) => {
            const taskDate =
                String(task.task_date)
                    .split("T")[0];

            return taskDate === today;
        }
    );

    // =====================================================
    // TODAY'S PROGRESS
    // =====================================================

    const completedTasks =
        todayTasks.filter(
            (task) => task.completed
        ).length;

    const totalTasks =
        todayTasks.length;

    const progress =
        totalTasks === 0
            ? 0
            : Math.round(
                  (completedTasks /
                      totalTasks) *
                      100
              );

    const score =
        completedTasks * 10;

    // =====================================================
    // GENERATE LAST 84 DAYS
    // =====================================================

    const heatmapDays = Array.from(
        { length: 84 },
        (_, index) => {

            const date = new Date();

            date.setDate(
                date.getDate() -
                    (83 - index)
            );

            return date.toLocaleDateString(
                "en-CA"
            );
        }
    );

    // =====================================================
    // HEATMAP COLOR
    // =====================================================

    function getHeatmapColor(date) {
        const day = activity[date];

        if (!day || day.total === 0) {
            return "bg-gray-100";
        }

        const percentage =
            day.completed /
            day.total;

        if (percentage === 1) {
            return "bg-green-600";
        }

        if (percentage >= 0.75) {
            return "bg-green-500";
        }

        if (percentage >= 0.5) {
            return "bg-green-300";
        }

        if (percentage > 0) {
            return "bg-green-100";
        }

        return "bg-gray-100";
    }

    // =====================================================
    // LOADING
    // =====================================================

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100">
                <Nav />

                <div className="flex min-h-[70vh] items-center justify-center">
                    <p className="text-gray-500">
                        Loading dashboard...
                    </p>
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

            <main className="mx-auto max-w-6xl px-6 py-8">

                {/* =====================================================
                    HEADER
                ===================================================== */}

                <div className="mb-8">

                    <p className="text-sm text-gray-500">
                        Dashboard
                    </p>

                    <h1 className="mt-1 text-3xl font-semibold text-gray-900">
                        Welcome back,{" "}
                        {user?.username || "User"}
                    </h1>

                    <p className="mt-2 text-sm text-gray-500">
                        Here's your progress for today.
                    </p>

                </div>


                {/* =====================================================
                    NAVIGATION
                ===================================================== */}

                <div className="mb-8 flex flex-wrap gap-3">

                    <Link
                        to="/dashboard"
                        className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white"
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/history"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        History
                    </Link>

                    <Link
                        to="/heatmap"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Heatmap
                    </Link>

                    <Link
                        to="/leaderboard"
                        className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Leaderboard
                    </Link>

                </div>


                {/* =====================================================
                    STATS
                ===================================================== */}

                <div className="grid gap-6 md:grid-cols-3">

                    {/* USER */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        <div className="flex items-center gap-4">

                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">

                                {user?.username
                                    ?.slice(0, 2)
                                    .toUpperCase() ||
                                    "U"}

                            </div>

                            <div>

                                <h2 className="font-semibold text-gray-900">
                                    {user?.username ||
                                        "User"}
                                </h2>

                                <p className="text-sm text-gray-500">
                                    {user?.email || ""}
                                </p>

                            </div>

                        </div>

                    </div>


                    {/* TODAY'S PROGRESS */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        <p className="text-sm text-gray-500">
                            Today's progress
                        </p>

                        <div className="mt-2 flex items-end justify-between">

                            <p className="text-3xl font-semibold text-gray-900">
                                {progress}%
                            </p>

                            <p className="text-sm text-gray-500">
                                {completedTasks} /{" "}
                                {totalTasks}
                            </p>

                        </div>

                        <div className="mt-4 h-2 rounded-full bg-gray-200">

                            <div
                                className="h-2 rounded-full bg-green-600 transition-all"
                                style={{
                                    width:
                                        `${progress}%`,
                                }}
                            />

                        </div>

                    </div>


                    {/* SCORE */}

                    <div className="rounded-xl border border-gray-200 bg-white p-6">

                        <p className="text-sm text-gray-500">
                            Today's score
                        </p>

                        <p className="mt-2 text-3xl font-semibold text-gray-900">
                            {score}
                        </p>

                        <p className="mt-1 text-sm text-gray-500">

                            {rank
                                ? `Rank #${rank.rank}`
                                : "Not ranked yet"}

                        </p>

                    </div>

                </div>


                {/* =====================================================
                    TODAY'S TASKS
                ===================================================== */}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Today's tasks
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                {completedTasks} of{" "}
                                {totalTasks} completed
                            </p>

                        </div>

                        <Link
                            to="/utracker"
                            className="text-sm font-medium text-gray-700 hover:underline"
                        >
                            Open tracker
                        </Link>

                    </div>


                    <div className="mt-5 space-y-2">

                        {todayTasks.length === 0 ? (

                            <p className="rounded-lg border border-dashed border-gray-300 p-5 text-center text-sm text-gray-500">
                                No tasks created for today.
                            </p>

                        ) : (

                            todayTasks.map((task) => (

                                <div
                                    key={task.task_id}
                                    className="flex items-center justify-between rounded-lg border border-gray-100 px-4 py-3"
                                >

                                    <div className="flex items-center gap-3">

                                        <div
                                            className={`h-3 w-3 rounded-full ${
                                                task.completed
                                                    ? "bg-green-500"
                                                    : "bg-gray-300"
                                            }`}
                                        />

                                        <span
                                            className={
                                                task.completed
                                                    ? "text-gray-400 line-through"
                                                    : "text-gray-800"
                                            }
                                        >
                                            {task.task_text}
                                        </span>

                                    </div>

                                    <span className="text-sm text-gray-500">
                                        {task.completed
                                            ? "Completed"
                                            : "Pending"}
                                    </span>

                                </div>

                            ))

                        )}

                    </div>

                </div>


                {/* =====================================================
                    HEATMAP
                ===================================================== */}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Activity
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Your activity over the last 84 days
                            </p>

                        </div>

                        <Link
                            to="/heatmap"
                            className="text-sm font-medium text-gray-700 hover:underline"
                        >
                            View heatmap
                        </Link>

                    </div>


                    {/* HEATMAP */}

                    <div className="mt-5 overflow-x-auto">

                        <div className="grid min-w-[700px] grid-cols-14 gap-1">

                            {heatmapDays.map(
                                (date) => {

                                    const day =
                                        activity[date];

                                    const completed =
                                        day?.completed ||
                                        0;

                                    const total =
                                        day?.total ||
                                        0;

                                    return (
                                        <div
                                            key={date}
                                            title={`${date} — ${completed}/${total} completed`}
                                            className={`h-4 w-4 rounded-sm ${getHeatmapColor(
                                                date
                                            )}`}
                                        />
                                    );
                                }
                            )}

                        </div>

                    </div>


                    {/* LEGEND */}

                    <div className="mt-4 flex items-center justify-end gap-2 text-xs text-gray-500">

                        <span>
                            Less
                        </span>

                        <div className="h-3 w-3 rounded-sm bg-gray-100" />

                        <div className="h-3 w-3 rounded-sm bg-green-100" />

                        <div className="h-3 w-3 rounded-sm bg-green-300" />

                        <div className="h-3 w-3 rounded-sm bg-green-500" />

                        <div className="h-3 w-3 rounded-sm bg-green-600" />

                        <span>
                            More
                        </span>

                    </div>

                </div>


                {/* =====================================================
                    RANK
                ===================================================== */}

                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">

                    <div className="flex items-center justify-between">

                        <div>

                            <h2 className="font-semibold text-gray-900">
                                Your leaderboard position
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                Keep completing tasks to improve your score.
                            </p>

                        </div>

                        <div className="text-right">

                            <p className="text-3xl font-semibold text-gray-900">
                                {rank
                                    ? `#${rank.rank}`
                                    : "--"}
                            </p>

                            <p className="text-sm text-gray-500">

                                {rank
                                    ? `${rank.tracker_score} points`
                                    : "No rank"}

                            </p>

                        </div>

                    </div>

                </div>

            </main>
        </div>
    );
}