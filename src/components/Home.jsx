import React from "react";
import Nav from "./Nav";
import Leaderboard from "./Leaderboard";
export default function Home() {

    const token = localStorage.getItem("token");

    return (
        <>
            <Nav />

            {!token && (
                <section className="home">
                <h1>
                    Hello, what's your plan for today?
                    <button >Create Task</button>
                </h1>
                <Leaderboard />

                </section>
            )}

        </>
    );
}