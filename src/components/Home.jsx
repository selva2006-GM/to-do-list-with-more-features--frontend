
import React from "react";
import { useNavigate } from "react-router-dom";
import Nav from "./Nav";
import Leaderboard from "./Leaderboard";


const features = [
  {
    number: "01",
    title: "Every Task, Saved",
    description:
      "Your tasks and progress are stored in the database, letting you revisit your work and track your accomplishments over time.",
    color: "border-blue-200",
  },
  {
    number: "02",
    title: "Visualize Your Consistency",
    description:
      "Explore your activity through a GitHub-style heatmap. Identify productive streaks and build better daily habits.",
    color: "border-green-200",
  },
  {
    number: "03",
    title: "Compete With Friends",
    description:
      "Compare scores on the leaderboard, celebrate achievements, and motivate your friends to stay productive.",
    color: "border-amber-200",
  },
  {
    number: "04",
    title: "Track Your Time",
    description:
      "Measure the time you spend on tasks and understand how you use your day.",
    color: "border-purple-200",
  },
  {
    number: "05",
    title: "Review Your Progress",
    description:
      "Look back at completed tasks, discover patterns, and see how your daily efforts add up over time.",
    color: "border-pink-200",
  },
  {
    number: "06",
    title: "Turn Goals Into Action",
    description:
      "Break your plans into manageable tasks, celebrate progress, and build a routine you can maintain.",
    color: "border-orange-200",
  },
];


export default function Home() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  function handleCreateTask() {
    navigate(token ? "/ucreatetask" : "/register");
  }
  
function HeatmapPreview() {
    const cells = Array.from({ length: 7 * 20 }, (_, i) => ({
        id: i,
        level: Math.floor(Math.random() * 5),
      }));

  return (
    <div className="mx-auto max-w-6xl  rounded-2xl border border-gray-200 bg-white p-6 text-gray-700 shadow-sm ">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-3xl font-medium text-gray-950">0</span>
        <span className="text-lg text-gray-500">
          tasks since your start date
        </span>
        <button
          type="button"
          title="Your completed task activity over time"
          className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-400 text-sm text-gray-500"
        >
          i
        </button>
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-x-8 gap-y-4">
        <p>
          Total active days:{" "}
          <span className="font-medium text-gray-950">0</span>
        </p>

        <p>
          Max streak:{" "}
          <span className="font-medium text-gray-950">0</span>
        </p>

        <select
          aria-label="Heatmap date range"
          defaultValue="current"
          className="rounded-xl border border-gray-300 bg-white px-4 py-3 text-gray-800 outline-none focus:border-green-600"
        >
          <option value="current">Current</option>
          <option value="last-month">Last month</option>
          <option value="last-year">Last year</option>
        </select>
      </div>

      <div className="mt-8 overflow-x-auto pb-3">
        <div className="min-w-[620px]">
          <div className="mb-2 ml-12 grid grid-cols-20 gap-1">
            {Array.from({ length: 20 }, (_, i) => (
              <span key={i} className="text-xs text-gray-500">
                {i % 4 === 0 ? "Oct" : ""}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-[36px_1fr] gap-3">
            <div className="grid grid-rows-7 gap-1 text-[11px] text-gray-400">
              <span className="flex items-center">Mon</span>
              <span />
              <span className="flex items-center">Wed</span>
              <span />
              <span className="flex items-center">Fri</span>
              <span />
              <span />
            </div>

            <div className="grid grid-flow-col grid-rows-7 gap-1">
              {cells.map((cell) => (
                <div
                  key={cell.id}
                  title="No activity"
                  className="h-[11px] w-[11px] rounded-[2px] bg-gray-100"
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5 flex items-center justify-end gap-2 text-xs text-gray-500">
        <span className="mr-1">Less</span>
        {[
          "bg-gray-100",
          "bg-green-200",
          "bg-green-300",
          "bg-green-500",
          "bg-green-700",
        ].map((color) => (
          <span
            key={color}
            className={`h-5 w-5 rounded-sm ${color}`}
          />
        ))}
        <span className="ml-1">More</span>
      </div>
    </div>
  );
}


  return (
    <>
      <Nav />

      <main className="min-h-screen bg-gray-50 text-gray-900">
        {/* Hero */}
        <section className="relative overflow-hidden bg-white">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-green-100 opacity-60 blur-3xl" />
          <div className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-blue-100 opacity-60 blur-3xl" />

          <div className="relative mx-auto max-w-6xl px-6 py-20 text-center sm:py-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-medium text-green-800">
              <span className="h-2 w-2 rounded-full bg-green-600" />
              Plan better. Do more. Grow every day.
            </span>

            <h1 className="mx-auto mt-6 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Make every day
              <span className="block text-green-800">
                count.
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-600 sm:text-lg">
              Your goals deserve more than a to-do list. Organize your tasks,
              visualize your consistency, track your progress, and compete
              with friends — all in one place.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <button
                onClick={handleCreateTask}
                className="rounded-xl bg-green-800 px-7 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-700 active:scale-[0.98]"
              >
                Get Started →
              </button>

              <button
                onClick={() => navigate("/leaderboard")}
                className="rounded-xl border border-gray-300 bg-white px-7 py-3.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-100"
              >
                Explore Leaderboard
              </button>
            </div>

            <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-3 text-sm text-gray-500">
              <span>✓ Keep a record of your work</span>
              <span>✓ Visualize daily activity</span>
              <span>✓ Grow together</span>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-6xl px-6 py-20 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-green-800">
              Everything in one place
            </p>

            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
              More than just a task manager
            </h2>

            <p className="mt-4 leading-7 text-gray-600">
              Build consistency, understand your progress, and turn everyday
              effort into lasting results.
            </p>
          </div>

          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <article
                key={feature.title}
                className="group rounded-2xl border border-gray-200 bg-white p-7 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-green-300 hover:shadow-lg"
              >
                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${feature.color}`}
                >
                  {feature.icon}
                </div>

                <h3 className="mt-5 text-lg font-semibold">
                  {feature.title}
                </h3>

                <p className="mt-3 text-sm leading-6 text-gray-600">
                  {feature.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        {/* Heatmap Showcase */}
        <HeatmapPreview />

        {/* Leaderboard */}
        <section className="mx-auto max-w-6xl px-6 py-20">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-sm font-bold uppercase tracking-widest text-green-800">
                Friendly competition
              </p>

              <h2 className="mt-2 text-3xl font-bold">
                Make progress together
              </h2>

              <p className="mt-3 max-w-xl text-gray-600">
                Celebrate achievements, compare scores, and motivate one
                another to keep showing up.
              </p>
            </div>

            <button
              onClick={() => navigate("/leaderboard")}
              className="self-start rounded-lg border border-gray-300 px-5 py-2.5 text-sm font-semibold transition hover:bg-gray-100 sm:self-auto"
            >
              Full Leaderboard →
            </button>
          </div>

          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
            <Leaderboard />
          </div>
        </section>

        {/* Final CTA */}
        <section className="px-6 pb-20">
          <div className="mx-auto max-w-5xl rounded-3xl bg-green-800 px-6 py-12 text-center text-white sm:px-12 sm:py-16">
            <h2 className="text-3xl font-bold sm:text-4xl">
              Your next productive day starts here.
            </h2>

            <p className="mx-auto mt-4 max-w-xl leading-7 text-green-100">
              Start with one task. Keep showing up. Let your progress tell
              the story.
            </p>

            <button
              onClick={handleCreateTask}
              className="mt-7 rounded-xl bg-white px-7 py-3.5 text-sm font-bold text-green-900 transition hover:bg-green-50"
            >
              Start Building Better Habits →
            </button>
          </div>
        </section>
      </main>
    </>
  );
}
