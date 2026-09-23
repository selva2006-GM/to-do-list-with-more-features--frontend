import React from "react";
import Nav from "./Nav";
import Leaderboard from "./Leaderboard";
import { Navigate, useNavigate } from "react-router-dom";
export default function Home() {

    const token = localStorage.getItem("token");
    const navigate = useNavigate();
    function ucreatetask(){
        navigate("/ucreatetask")
    }
    return (
        <>
            <Nav />

            {!token && (
                <section className="home">
                <h1>
                    Hello, what's your plan for today?
                    <button class="bg-green-800 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"onClick={ucreatetask}>Create Task</button>
                </h1>
                <Leaderboard />

                </section>
            )}

        </>
    );
}