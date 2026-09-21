import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRank() {
      try {
        const response = await fetch("http://localhost:5000/api/tasks/rank");

        const data = await response.json();
        console.log(data);
        setRanks(data.ranks || []);
      } catch (error) {
        console.error("Failed to fetch leaderboard:", error);
      } finally {
        setLoading(false);
      }
    }

    getRank();
  }, []);

  if (loading) {
    return <p>Loading leaderboard...</p>;
  }

  return (
    <section className="mx-auto max-w-2xl px-6 py-14">
      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white">
        {/* Header */}

        <div className="flex flex-wrap items-center justify-between gap-3 px-6 py-5">
          <div>
            <h2 className="text-lg font-semibold text-neutral-900">
              Tracker Leaderboard
            </h2>

            <p className="mt-0.5 text-sm text-neutral-500">
              Top users by tracker score
            </p>
          </div>
        </div>

        {/* Users */}

        <div className="divide-y divide-neutral-100 border-t border-neutral-200">
          {ranks.map((user) => (
            <div
              key={user.user_id}
              className={`flex items-center gap-4 px-6 py-3.5 ${
                user.rank === 1 ? "bg-amber-50/40" : "bg-white"
              }`}
            >
              {/* Rank */}

              <span className="flex w-8 shrink-0 items-center gap-1.5">
                {user.rank === 1 && (
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
                )}

                <span className="font-mono text-sm text-neutral-900">
                  {user.rank}
                </span>
              </span>

              {/* Avatar */}

              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-neutral-900 text-[11px] font-medium text-white">
                {user.username.slice(0, 2).toUpperCase()}
              </span>

              {/* Username */}

              <span className="min-w-0 flex-1">
                <span className="flex items-center gap-2">
                  <span className="truncate text-sm font-medium text-neutral-900">
                    {user.username}
                  </span>
                </span>
              </span>

              {/* Score */}

              <span className="shrink-0 text-right">
                <span className="block font-mono text-sm font-medium text-neutral-900">
                  {user.tacker_score}
                </span>
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}

        <div className="border-t border-neutral-200 bg-neutral-50 px-6 py-4">
          <p className="text-sm text-neutral-600">
            Showing top {ranks.length} users
          </p>
        </div>
      </div>
    </section>
  );
}
