import React from "react";
import Nav from "./Nav";
import Leaderboard from "./Leaderboard";

export default function Home() {

    const token = localStorage.getItem("token");

    return (
        <>
            <Nav />

            {!token && (
                <h1>
                    Hello, what's your plan for today?
                </h1>
            )}

            <Leaderboard />
        </>
    );
}