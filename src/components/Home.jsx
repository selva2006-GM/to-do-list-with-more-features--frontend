import React from "react";
import Nav from "./Nav";


export default function Home() {
    const token = localStorage.getItem("token");
    const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

    const today = new Date().toISOString().split("T")[0];

    const todayTasks = tasks.filter(
        (task) => task.date === today
    );

    return (
        <>
            <Nav />
        </>
    );
}