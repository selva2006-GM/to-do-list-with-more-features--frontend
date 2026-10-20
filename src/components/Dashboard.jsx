import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";
import Heatmapdash from "./Heatmapdash";
import UTracker from "./UTracker";

const TASKS_CACHE_KEY = "dashboardTasks";
const RANK_CACHE_KEY = "dashboardRank";

function readCache(key, fallback) {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

export default function Dashboard() {
  const [user, setUser] = useState(() => readCache("user", null));

  const [tasks, setTasks] = useState(() => {
    const cachedTasks = readCache(TASKS_CACHE_KEY, []);
    return Array.isArray(cachedTasks) ? cachedTasks : [];
  });

  const [rank, setRank] = useState(() =>
    readCache(RANK_CACHE_KEY, null)
  );

  const [refreshingTasks, setRefreshingTasks] = useState(false);
  const [refreshingRank, setRefreshingRank] = useState(false);

  const today = new Date().toLocaleDateString("en-CA");

  useEffect(() => {
    setUser(readCache("user", null));
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function getTasks() {
      const token = localStorage.getItem("token");

      if (!token) return;

      setRefreshingTasks(true);

      try {
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

        if (!Array.isArray(data)) {
          throw new Error("Invalid tasks response");
        }

        if (cancelled) return;

        setTasks(data);

        try {
          localStorage.setItem(
            TASKS_CACHE_KEY,
            JSON.stringify(data)
          );
        } catch (error) {
          console.error("Failed to cache tasks:", error);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to refresh tasks:", error);
        }
      } finally {
        if (!cancelled) {
          setRefreshingTasks(false);
        }
      }
    }

    getTasks();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function getRank() {
      const token = localStorage.getItem("token");

      if (!token) return;

      setRefreshingRank(true);

      try {
        const response = await fetch(`${API_URL}/api/tasks/my-rank`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch rank");
        }

        if (cancelled) return;

        const freshRank =
          data.rank !== null && typeof data.rank === "object"
            ? data.rank
            : data;

        setRank(freshRank);

        try {
          localStorage.setItem(
            RANK_CACHE_KEY,
            JSON.stringify(freshRank)
          );
        } catch (error) {
          console.error("Failed to cache rank:", error);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to refresh rank:", error);
        }
      } finally {
        if (!cancelled) {
          setRefreshingRank(false);
        }
      }
    }

    getRank();

    return () => {
      cancelled = true;
    };
  }, []);

  const todayTasks = tasks.filter((task) => {
    if (!task.task_date) return false;
    return String(task.task_date).split("T")[0] === today;
  });

  const completedTasks = todayTasks.filter(
    (task) => task.completed === true
  ).length;

  const totalTasks = todayTasks.length;

  const progress =
    totalTasks === 0
      ? 0
      : Math.round((completedTasks / totalTasks) * 100);

  const score = completedTasks * 10;

  return (
    <div className="min-h-screen bg-gray-100">
      <Nav />

      <main className="mx-auto max-w-6xl px-6 py-8">
        <div className="mb-8">
          <p className="text-sm text-gray-500">Dashboard</p>

          <h1 className="mt-1 text-3xl font-semibold text-gray-900">
            Welcome back, {user?.username || "User"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            Here's your progress for today.
          </p>

          {(refreshingTasks || refreshingRank) && (
            <p className="mt-2 text-xs text-gray-500">
              Refreshing your latest data...
            </p>
          )}
        </div>

        <div className="mb-8 flex flex-wrap gap-3">
          <Link
            to="/dashboard"
            className="rounded-lg border border-gray-700 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
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
            to="/leaderboard"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Leaderboard
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-900 text-lg font-semibold text-white">
                {user?.username?.slice(0, 2).toUpperCase() || "U"}
              </div>

              <div className="min-w-0">
                <h2 className="font-semibold text-gray-900">
                  {user?.username || "User"}
                </h2>

                <p className="break-all text-sm text-gray-500">
                  {user?.email || ""}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Today's progress</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {progress}%
            </p>

            <p className="mt-1 text-sm text-gray-500">
              {completedTasks} of {totalTasks} tasks completed
            </p>

            <div className="mt-4 h-2 overflow-hidden rounded-full bg-gray-100">
              <div
                className="h-full rounded-full bg-green-600 transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="rounded-xl border border-gray-200 bg-white p-6">
            <p className="text-sm text-gray-500">Today's score</p>

            <p className="mt-2 text-3xl font-semibold text-gray-900">
              {score}
            </p>

            <p className="mt-1 text-sm text-gray-500">
              Points earned from completed tasks
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <UTracker />
        </div>

        <div className="mt-6">
          <Heatmapdash tasks={tasks} />
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6">
          <div className="flex items-center justify-between gap-4">
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
                {rank?.rank != null ? `#${rank.rank}` : "--"}
              </p>

              <p className="text-sm text-gray-500">
                {rank?.tracker_score != null
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