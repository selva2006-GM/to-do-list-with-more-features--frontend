import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function History() {
  const navigate = useNavigate();

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedTask, setExpandedTask] = useState(null);
  const [selectedDate, setSelectedDate] = useState("");
  const [visibleDays, setVisibleDays] = useState(5);
  const [loadingMore, setLoadingMore] = useState(false);

  const getLocalDateString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateString(new Date());

  const startDateObject = new Date();
  startDateObject.setDate(startDateObject.getDate() - 9);

  const tenDaysAgo = getLocalDateString(startDateObject);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
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
          throw new Error(data.message || "Failed to fetch task history");
        }

        setTasks(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("HISTORY ERROR:", error);
        setError(error.message || "Failed to fetch task history");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = tasks.filter((task) => {
    const date = String(task.task_date).split("T")[0];

    if (selectedDate) {
      return date === selectedDate;
    }

    return date <= today;
  });

  const groupedTasks = filteredTasks.reduce((groups, task) => {
    const date = String(task.task_date).split("T")[0];

    if (!groups[date]) {
      groups[date] = [];
    }

    groups[date].push(task);
    return groups;
  }, {});

  const allDates = Object.keys(groupedTasks).sort((a, b) => b.localeCompare(a));

  const dates = selectedDate ? allDates : allDates.slice(0, visibleDays);

  const formatDate = (dateString) => {
    const date = new Date(`${dateString}T00:00:00`);

    return date.toLocaleDateString("en-IN", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };
  useEffect(() => {
    if (selectedDate || loading || error) return;

    const handleScroll = () => {
      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 200;

      if (nearBottom && visibleDays < allDates.length && !loadingMore) {
        setLoadingMore(true);

        setVisibleDays((previous) => Math.min(previous + 10, allDates.length));

        setLoadingMore(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [selectedDate, loading, error, visibleDays, loadingMore, allDates.length]);

  return (
    <div className="min-h-screen bg-gray-100">
      <main className="mx-auto max-w-4xl px-6 py-8">
      <div className="sticky top-0 z-50 -mx-6 border-b border-gray-200 bg-gray-100/95 px-6 pb-3 pt-2 backdrop-blur-md">
        <button
          onClick={() => navigate(-1)}
          className="m-1 rounded-lg bg-gray-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-gray-800 active:bg-gray-950"
        >
          ← Back to Dashboard
        </button>

        

  <div className="rounded-xl border border-gray-200 bg-white p-4">
    <h1 className="text-2xl font-semibold text-gray-900">
      Task History
    </h1>

    <p className="mt-2 text-sm text-gray-500">
      {selectedDate
        ? `Showing tasks for ${formatDate(selectedDate)}.`
        : `Showing your task history from ${formatDate(tenDaysAgo)} to ${formatDate(today)}.`}
    </p>

    <div className="mt-3">
      <label
        htmlFor="date"
        className="flex flex-col gap-2 text-sm font-medium text-gray-700"
      >
        Filter by date

        <input
          type="date"
          name="date"
          id="date"
          max={today}
          value={selectedDate}
          onChange={(event) => {
            setSelectedDate(event.target.value);
            setExpandedTask(null);
          }}
          className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm font-normal text-gray-900 outline-none transition focus:border-gray-500 focus:ring-2 focus:ring-gray-200"
        />
      </label>

      {selectedDate && (
        <button
          type="button"
          onClick={() => {
            setSelectedDate("");
            setExpandedTask(null);
          }}
          className="mt-2 text-sm font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900"
        >
          Clear date filter
        </button>
      )}
    </div>
  </div>
</div>


        {loading && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-8 text-center">
            <p className="text-sm text-gray-500">Loading history...</p>
          </div>
        )}

        {!loading && !error && tasks.length === 0 && (
          <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
            <p className="text-gray-500">No task history yet.</p>

            <button
              onClick={() => navigate("/create-task")}
              className="mt-4 inline-block rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-gray-800"
            >
              Create a Task
            </button>
          </div>
        )}

        {!loading &&
          !error &&
          tasks.length > 0 &&
          filteredTasks.length === 0 && (
            <div className="mt-6 rounded-xl border border-dashed border-gray-300 bg-white p-10 text-center">
              <p className="text-gray-700 font-medium">No tasks found.</p>
              <p className="mt-2 text-sm text-gray-500">
                {selectedDate
                  ? "There are no tasks for this date."
                  : "There are no tasks in the last 10 days."}
              </p>
            </div>
          )}

        {!loading && !error && dates.length > 0 && (
          <div className="mt-6 space-y-6">
            {dates.map((date) => {
              const dayTasks = groupedTasks[date];

              const completed = dayTasks.filter(
                (task) => task.completed,
              ).length;

              const total = dayTasks.length;
              const percentage = Math.round((completed / total) * 100);
              const score = completed * 10;

              return (
                <div
                  key={date}
                  className="rounded-xl border border-gray-200 bg-white p-6"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-semibold text-gray-900">
                        {formatDate(date)}
                      </h2>

                      <p className="mt-1 text-sm text-gray-500">
                        {completed} of {total} tasks completed
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">
                        {score}
                      </p>
                      <p className="text-xs text-gray-500">points</p>
                    </div>
                  </div>

                  <div className="mt-4 h-2 rounded-full bg-gray-200">
                    <div
                      className="h-2 rounded-full bg-green-600 transition-all"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <div className="mt-2 flex justify-between text-xs text-gray-500">
                    <span>Progress</span>
                    <span>{percentage}%</span>
                  </div>

                  <div className="mt-5 space-y-2">
                    {dayTasks.map((task) => {
                      const isExpanded = expandedTask === task.task_id;

                      return (
                        <div
                          key={task.task_id}
                          className={`overflow-hidden rounded-lg border ${
                            task.completed
                              ? "border-green-100 bg-green-50"
                              : "border-gray-100 bg-gray-50"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-3 px-4 py-3">
                            <div className="flex min-w-0 items-center gap-3">
                              <div
                                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs ${
                                  task.completed
                                    ? "bg-green-600 text-white"
                                    : "border-2 border-gray-300"
                                }`}
                              >
                                {task.completed && "✓"}
                              </div>

                              <span
                                className={`break-words ${
                                  task.completed
                                    ? "text-gray-400 line-through"
                                    : "text-gray-800"
                                }`}
                              >
                                {task.task_text}
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-3">
                              <span
                                className={`text-xs font-medium ${
                                  task.completed
                                    ? "text-green-600"
                                    : "text-gray-400"
                                }`}
                              >
                                {task.completed ? "Completed" : "Pending"}
                              </span>

                              <button
                                type="button"
                                onClick={() =>
                                  setExpandedTask(
                                    isExpanded ? null : task.task_id,
                                  )
                                }
                                className="flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-xs font-medium text-gray-700 transition hover:bg-gray-100"
                              >
                                Notes
                                <svg
                                  className={`h-4 w-4 transition-transform duration-300 ${
                                    isExpanded ? "rotate-180" : ""
                                  }`}
                                  viewBox="0 0 20 20"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="1.8"
                                >
                                  <path
                                    d="m5 7.5 5 5 5-5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </button>
                            </div>
                          </div>

                          <div
                            className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                              isExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                            }`}
                          >
                            <div className="overflow-hidden">
                              <div className="border-t border-gray-200/80 px-4 py-3">
                                <p className="mb-1 text-xs font-medium text-gray-500">
                                  Task notes
                                </p>

                                <p className="whitespace-pre-wrap break-words text-sm text-gray-700">
                                  {task.task_notes?.trim() ||
                                    "No notes added for this task."}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {!loading && !error && !selectedDate && (
          <div className="py-6 text-center">
            {visibleDays < allDates.length ? (
              <p className="text-sm text-gray-500">
                {loadingMore
                  ? "Loading more history..."
                  : "Scroll down to load older history"}
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                You have reached the end of your history.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
