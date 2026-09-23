import React, { useEffect, useState } from "react";

const API_URL = import.meta.env.VITE_API_URL;

export default function Leaderboard() {
  const [ranks, setRanks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getRank() {
      try {
        const response = await fetch(
          `${API_URL}/api/tasks/rank`
        );

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
    <section>
      <div>
        <h2>Tracker Leaderboard</h2>

        <p>Top users by tracker score</p>
      </div>

      <div>
        {ranks.map((user) => (
          <div key={user.user_id}>
            {/* Rank */}
            <span>
              {user.rank}
            </span>

            {/* Avatar */}
            <span>
              {user.username.slice(0, 2).toUpperCase()}
            </span>

            {/* Username */}
            <span>
              {user.username}
            </span>

            {/* Score */}
            <span>
              {user.tacker_score}
            </span>
          </div>
        ))}
      </div>

      <div>
        <p>
          Showing top {ranks.length} users
        </p>
      </div>
    </section>
  );
}