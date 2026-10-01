import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "./Nav";

const API_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
    const [ranks, setRanks] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("leaderboard") || "[]"
            );
        } catch {
            return [];
        }
    });

    const [myRank, setMyRank] = useState(() => {
        try {
            return JSON.parse(
                localStorage.getItem("myRank") || "null"
            );
        } catch {
            return null;
        }
    });

    const [loading, setLoading] = useState(() => {
        return !localStorage.getItem("leaderboard");
    });

    const [error, setError] = useState("");

    useEffect(() => {
        async function loadLeaderboard() {
            try {
                /*
                 * Fetch top users
                 */
                const rankResponse = await fetch(
                    `${API_URL}/api/tasks/rank`
                );

                if (!rankResponse.ok) {
                    throw new Error(
                        `Leaderboard error: ${rankResponse.status}`
                    );
                }

                const rankData = await rankResponse.json();

                const leaderboard = rankData.ranks || [];

                setRanks(leaderboard);

                // Save leaderboard
                localStorage.setItem(
                    "leaderboard",
                    JSON.stringify(leaderboard)
                );

                /*
                 * Fetch logged-in user's rank
                 */
                const token = localStorage.getItem("token");

                if (token) {
                    const myRankResponse = await fetch(
                        `${API_URL}/api/tasks/my-rank`,
                        {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (myRankResponse.ok) {
                        const myRankData =
                            await myRankResponse.json();

                        setMyRank(myRankData.rank);

                        // Save user's rank
                        localStorage.setItem(
                            "myRank",
                            JSON.stringify(myRankData.rank)
                        );
                    }
                }

                setError("");
            } catch (err) {
                console.error(
                    "Leaderboard error:",
                    err
                );

                /*
                 * If cached data exists,
                 * keep showing it.
                 */
                if (
                    ranks.length === 0 &&
                    !myRank
                ) {
                    setError(
                        "Unable to load leaderboard."
                    );
                }
            } finally {
                setLoading(false);
            }
        }

        /*
         * Only fetch if we don't already
         * have leaderboard data.
         */
        if (!localStorage.getItem("leaderboard")) {
            loadLeaderboard();
        } else {
            setLoading(false);
        }
    }, []);

    /*
     * Loading screen only on first-ever load
     */
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Nav />

                <main className="mx-auto max-w-5xl px-6 py-10">
                    <div className="rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
                        <div className="animate-pulse space-y-5">
                            <div className="h-7 w-56 rounded bg-gray-200" />
                            <div className="h-4 w-72 rounded bg-gray-200" />

                            <div className="grid gap-4 md:grid-cols-3">
                                <div className="h-36 rounded-2xl bg-gray-100" />
                                <div className="h-44 rounded-2xl bg-gray-100" />
                                <div className="h-36 rounded-2xl bg-gray-100" />
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50">
                <Nav />

                <main className="mx-auto max-w-5xl px-6 py-10">
                    <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
                        <h2 className="text-xl font-semibold text-gray-900">
                            Tracker Leaderboard
                        </h2>

                        <p className="mt-2 text-sm text-red-500">
                            {error}
                        </p>
                    </div>
                </main>
            </div>
        );
    }

    const first = ranks[0];
    const second = ranks[1];
    const third = ranks[2];

    const remaining = ranks.slice(3);

    return (
        <div className="min-h-screen bg-gray-50">
            <Nav />

            <main className="mx-auto max-w-5xl px-6 py-8">

                {/* Back */}
                <Link
                    to="/dashboard"
                    className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-gray-900"
                >
                    ← Back to Dashboard
                </Link>

                {/* Header */}
                <div className="mb-8 flex items-end justify-between">
                    <div>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-gray-400">
                            Community
                        </p>

                        <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                            Tracker Leaderboard
                        </h1>

                        <p className="mt-2 text-sm text-gray-500">
                            Stay consistent. Keep climbing.
                        </p>
                    </div>

                    <div className="hidden rounded-xl border border-gray-200 bg-white px-5 py-3 text-right shadow-sm sm:block">
                        <p className="text-xs text-gray-400">
                            Players
                        </p>

                        <p className="text-lg font-bold text-gray-900">
                            {ranks.length}
                        </p>
                    </div>
                </div>

                {/* TOP 3 */}
                {ranks.length > 0 && (
                    <div className="mb-8 grid items-end gap-4 md:grid-cols-3">

                        {/* SECOND */}
                        {second && (
                            <div className="order-2 md:order-1">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">

                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700">
                                        2
                                    </div>

                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                        {second.username
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {second.username}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-gray-700">
                                        {second.tracker_score ?? 0}
                                        <span className="ml-1 text-xs font-medium text-gray-400">
                                            pts
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* FIRST */}
                        {first && (
                            <div className="order-1 md:order-2">
                                <div className="relative rounded-2xl bg-gray-900 p-7 text-center text-white shadow-lg">

                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full border-4 border-gray-50 bg-gray-900 px-4 py-1 text-xs font-bold">
                                        #1
                                    </div>

                                    <div className="mx-auto mb-4 mt-2 flex h-16 w-16 items-center justify-center rounded-full bg-white text-xl font-bold text-gray-900">
                                        {first.username
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <p className="text-lg font-bold">
                                        {first.username}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-gray-300">
                                        {first.tracker_score ?? 0}
                                        <span className="ml-1 text-xs text-gray-400">
                                            pts
                                        </span>
                                    </p>

                                    <div className="mt-5 border-t border-white/10 pt-4 text-xs text-gray-400">
                                        Current leader
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* THIRD */}
                        {third && (
                            <div className="order-3">
                                <div className="rounded-2xl border border-gray-200 bg-white p-6 text-center shadow-sm">

                                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100 text-lg font-bold text-gray-700">
                                        3
                                    </div>

                                    <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-gray-900 text-sm font-bold text-white">
                                        {third.username
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <p className="font-semibold text-gray-900">
                                        {third.username}
                                    </p>

                                    <p className="mt-2 text-sm font-bold text-gray-700">
                                        {third.tracker_score ?? 0}
                                        <span className="ml-1 text-xs font-medium text-gray-400">
                                            pts
                                        </span>
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* REMAINING USERS */}
                {remaining.length > 0 && (
                    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">

                        <div className="border-b border-gray-100 px-5 py-4">
                            <p className="text-sm font-semibold text-gray-900">
                                Rankings
                            </p>

                            <p className="mt-1 text-xs text-gray-500">
                                Keep completing tasks to move up.
                            </p>
                        </div>

                        <div className="divide-y divide-gray-100">
                            {remaining.map((user) => (
                                <div
                                    key={user.user_id}
                                    className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50"
                                >
                                    <div className="w-10 text-center text-sm font-semibold text-gray-400">
                                        #{user.rank}
                                    </div>

                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-900 text-xs font-bold text-white">
                                        {user.username
                                            ?.slice(0, 2)
                                            .toUpperCase()}
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900">
                                            {user.username}
                                        </p>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-bold text-gray-900">
                                            {user.tracker_score ?? 0}
                                            <span className="ml-1 text-xs font-medium text-gray-400">
                                                pts
                                            </span>
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* YOUR RANK */}
                {myRank && (
                    <div className="mt-6 rounded-2xl bg-gray-900 p-5 text-white shadow-lg">

                        <div className="flex items-center gap-4">

                            {/* Rank */}
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-gray-900">
                                #{myRank.rank}
                            </div>

                            {/* Name */}
                            <div className="flex-1">
                                <p className="text-xs font-medium uppercase tracking-widest text-gray-400">
                                    Your Rank
                                </p>

                                <p className="mt-1 font-semibold">
                                    {myRank.username}
                                </p>
                            </div>

                            {/* Points */}
                            <div className="text-right">
                                <p className="text-xl font-bold">
                                    {myRank.tracker_score ?? 0}
                                    <span className="ml-1 text-sm font-medium text-gray-400">
                                        pts
                                    </span>
                                </p>
                            </div>

                        </div>
                    </div>
                )}

            </main>
        </div>
    );
}