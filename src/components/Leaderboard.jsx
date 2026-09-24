import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
    const [ranks, setRanks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function getRank() {
            try {
                const url = `${API_URL}/api/tasks/rank`;

                console.log("Fetching:", url);

                const response = await fetch(url);

                console.log("Status:", response.status);

                if (!response.ok) {
                    throw new Error(
                        `Server returned ${response.status}`
                    );
                }

                const data = await response.json();

                console.log("Leaderboard:", data);

                setRanks(data.ranks || []);
            } catch (error) {
                console.error(
                    "Failed to fetch leaderboard:",
                    error
                );

                setError("Unable to load leaderboard.");
            } finally {
                setLoading(false);
            }
        }

        getRank();
    }, []);

    if (loading) {
        return (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <p className="text-sm text-gray-500">
                    Loading leaderboard...
                </p>
            </section>
        );
    }

    if (error) {
        return (
            <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-gray-900">
                    Tracker Leaderboard
                </h2>

                <p className="mt-2 text-sm text-red-500">
                    {error}
                </p>
            </section>
        );
    }

    return (
        <section className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                    Tracker Leaderboard
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Top users by tracker score
                </p>
            </div>

            <div className="space-y-3">
                {ranks.map((user) => (
                    <div
                        key={user.user_id}
                        className="flex items-center gap-4 rounded-lg border border-gray-100 px-4 py-3 transition hover:bg-gray-50"
                    >
                        <div className="w-8 text-center">
                            <span className="text-sm font-semibold text-gray-500">
                                {user.rank}
                            </span>
                        </div>

                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-900 text-sm font-semibold text-white">
                            {user.username
                                .slice(0, 2)
                                .toUpperCase()}
                        </div>

                        <div className="flex-1">
                            <p className="font-medium text-gray-900">
                                {user.username}
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                                {user.tacker_score}
                            </p>

                            <p className="text-xs text-gray-500">
                                points
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {ranks.length === 0 && (
                <p className="py-6 text-center text-sm text-gray-500">
                    No users found.
                </p>
            )}

            <div className="mt-6 border-t border-gray-100 pt-4">
                <p className="text-center text-xs text-gray-500">
                    Showing top {ranks.length} users
                </p>
            </div>

        </section>
    );
}