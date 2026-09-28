import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Nav from "./Nav";
import API_URL from "../config/api";

export default function Heatmap() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("Please login first.");
          setLoading(false);
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
          throw new Error(data.message || "Failed to fetch tasks");
        }

        setTasks(data);
      } catch (error) {
        console.error("HEATMAP ERROR:", error);
        setError(error.message || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const todayString = formatDate(today);

  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  startDate.setDate(startDate.getDate() - startDate.getDay());

  const heatmapDays = [];
  let currentDate = new Date(startDate);

  while (currentDate <= today) {
    heatmapDays.push({
      date: formatDate(currentDate),
      dateObject: new Date(currentDate),
    });

    currentDate.setDate(currentDate.getDate() + 1);
  }

  const weeks = [];

  for (let i = 0; i < heatmapDays.length; i += 7) {
    const week = heatmapDays.slice(i, i + 7);

    while (week.length < 7) {
      week.push(null);
    }

    weeks.push(week);
  }

  const activity = {};

  tasks.forEach((task) => {
    if (!task.task_date) return;

    const date = String(task.task_date).split("T")[0];

    if (date > todayString) return;

    if (!activity[date]) {
      activity[date] = {
        total: 0,
        completed: 0,
      };
    }

    activity[date].total += 1;

    const completed =
      task.completed === true ||
      task.completed === 1 ||
      task.completed === "true";

    if (completed) {
      activity[date].completed += 1;
    }
  });

  const getHeatmapColor = (date) => {
    const day = activity[date];

    if (!day || day.total === 0) {
      return "bg-gray-100";
    }

    const percentage = day.completed / day.total;

    if (percentage === 1) return "bg-green-600";
    if (percentage >= 0.75) return "bg-green-500";
    if (percentage >= 0.5) return "bg-green-400";
    if (percentage > 0) return "bg-green-200";

    return "bg-gray-100";
  };

  const totalTasks = tasks.filter((task) => {
    if (!task.task_date) return false;

    const date = String(task.task_date).split("T")[0];

    return (
      date >= formatDate(startDate) &&
      date <= todayString
    );
  }).length;

  const activeDays = Object.keys(activity).filter(
    (date) => activity[date].completed > 0
  ).length;

  const calculateMaxStreak = () => {
    const completedDates = Object.keys(activity)
      .filter((date) => activity[date].completed > 0)
      .sort();

    let maxStreak = 0;
    let currentStreak = 0;
    let previousDate = null;

    completedDates.forEach((date) => {
      const currentDate = new Date(`${date}T00:00:00`);

      if (previousDate) {
        const difference =
          (currentDate - previousDate) /
          (1000 * 60 * 60 * 24);

        if (difference === 1) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
      } else {
        currentStreak = 1;
      }

      maxStreak = Math.max(maxStreak, currentStreak);
      previousDate = currentDate;
    });

    return maxStreak;
  };

  const maxStreak = calculateMaxStreak();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <Nav />

        <main className="mx-auto max-w-7xl px-6 py-8">
          <Link
            to="/dashboard"
            className="text-sm font-medium text-gray-600 hover:text-gray-900"
          >
            ← Back to Dashboard
          </Link>

          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-10 text-center">
            <p className="text-sm text-gray-500">
              Loading activity...
            </p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div >
   

      <main >
        <button
          onClick={() => navigate(-1)}
          className="text-sm font-medium text-gray-600 hover:text-gray-900"
        >
          ← Back
        </button>

        <div className="mt-6 overflow-hidden rounded-xl border border-gray-200 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-5 px-5 py-5">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-semibold text-gray-900">
                {totalTasks}
              </span>

              <span className="text-lg text-gray-500">
                tasks in the past one year
              </span>

              <span
                title="Total tasks during the past year"
                className="flex h-5 w-5 items-center justify-center rounded-full border border-gray-400 text-xs text-gray-500"
              >
                i
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-7">
              <div className="text-sm text-gray-500">
                Total active days:{" "}
                <span className="font-medium text-gray-700">
                  {activeDays}
                </span>
              </div>

              <div className="text-sm text-gray-500">
                Max streak:{" "}
                <span className="font-medium text-gray-700">
                  {maxStreak}
                </span>
              </div>

              <select
                defaultValue="current"
                className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 outline-none"
              >
                <option value="current">Current</option>
                <option value="previous">Previous Year</option>
              </select>
            </div>
          </div>

          {error && (
            <div className="mx-5 mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-600">
              {error}
            </div>
          )}

          <div className="px-5 pb-5">
            <div className="overflow-x-auto">
              <div className="min-w-max">
                <div className="flex">
                  <div className="mr-2 w-8 shrink-0" />

                  <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => {
                      const firstDay = week.find(
                        (day) => day !== null
                      );

                      if (!firstDay) {
                        return (
                          <div
                            key={weekIndex}
                            className="w-4"
                          />
                        );
                      }

                      const currentMonth =
                        firstDay.dateObject.getMonth();

                      const previousWeek =
                        weeks[weekIndex - 1];

                      const previousDay =
                        previousWeek?.find(
                          (day) => day !== null
                        );

                      const previousMonth =
                        previousDay?.dateObject.getMonth();

                      const showMonth =
                        weekIndex === 0 ||
                        currentMonth !== previousMonth;

                      return (
                        <div
                          key={weekIndex}
                          className="w-4 text-[11px] text-gray-500"
                        >
                          {showMonth
                            ? firstDay.dateObject.toLocaleDateString(
                                "en-IN",
                                {
                                  month: "short",
                                }
                              )
                            : ""}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="mt-1 flex">
                  <div className="mr-2 grid w-8 shrink-0 grid-rows-7 gap-1">
                    <div className="h-4" />
                    <div className="h-4 text-[9px] text-gray-400">
                      Mon
                    </div>
                    <div className="h-4" />
                    <div className="h-4 text-[9px] text-gray-400">
                      Wed
                    </div>
                    <div className="h-4" />
                    <div className="h-4 text-[9px] text-gray-400">
                      Fri
                    </div>
                    <div className="h-4" />
                  </div>

                  <div className="flex gap-1">
                    {weeks.map((week, weekIndex) => (
                      <div
                        key={weekIndex}
                        className="flex w-4 flex-col gap-1"
                      >
                        {week.map((item, dayIndex) => {
                          if (!item) {
                            return (
                              <div
                                key={`empty-${dayIndex}`}
                                className="h-4 w-4"
                              />
                            );
                          }

                          const date = item.date;

                          if (date > todayString) {
                            return (
                              <div
                                key={date}
                                className="h-4 w-4"
                              />
                            );
                          }

                          const day = activity[date];
                          const completed =
                            day?.completed || 0;
                          const total =
                            day?.total || 0;

                          return (
                            <div
                              key={date}
                              title={`${formatDisplayDate(
                                date
                              )} — ${completed}/${total} completed`}
                              className={`
                                h-4
                                w-4
                                cursor-pointer
                                rounded-[2px]
                                ${getHeatmapColor(date)}
                                transition
                                hover:ring-2
                                hover:ring-gray-400
                              `}
                            />
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-5 flex items-center justify-end gap-2 text-xs text-gray-500">
                  <span>Less</span>

                  <div className="h-4 w-4 rounded-[2px] bg-gray-100" />
                  <div className="h-4 w-4 rounded-[2px] bg-green-200" />
                  <div className="h-4 w-4 rounded-[2px] bg-green-400" />
                  <div className="h-4 w-4 rounded-[2px] bg-green-500" />
                  <div className="h-4 w-4 rounded-[2px] bg-green-600" />

                  <span>More</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDisplayDate(dateString) {
  const date = new Date(`${dateString}T00:00:00`);

  return date.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}