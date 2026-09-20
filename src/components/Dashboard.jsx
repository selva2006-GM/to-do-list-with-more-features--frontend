import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";

export default function Dashboard() {
    const [tasks, setTasks] = useState([]);
    const [session, setSession] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());

    const today = new Date().toISOString().split("T")[0];

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    useEffect(() => {
        loadData();

        const interval = setInterval(() => {
            loadData();
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    function loadData() {
        const savedTasks = localStorage.getItem("tasks");
        const savedSession = localStorage.getItem("taskSession");

        setTasks(
            savedTasks
                ? JSON.parse(savedTasks)
                : []
        );

        setSession(
            savedSession
                ? JSON.parse(savedSession)
                : null
        );
    }

    const todayTasks = tasks.filter(
        task => task.date === today
    );

    const totalTasks = todayTasks.length;

    const completedTasks = todayTasks.filter(
        task => task.completed
    ).length;

    const pendingTasks =
        totalTasks - completedTasks;

    const completionPercentage =
        totalTasks === 0
            ? 0
            : Math.round(
                (completedTasks / totalTasks) * 100
            );

    const todaySession =
        session?.date === today
            ? session
            : null;

    function getElapsedTime() {
        if (!todaySession?.startTime) {
            return 0;
        }

        const endTime =
            todaySession.completedAt ||
            currentTime;

        return Math.floor(
            (endTime - todaySession.startTime) / 1000
        );
    }

    function formatTime(seconds) {
        const hours = Math.floor(
            seconds / 3600
        );

        const minutes = Math.floor(
            (seconds % 3600) / 60
        );

        const secs = seconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    return (
        <div className="dashboard">

            <div className="dashboard-header">

                <div>
                    <p className="welcome-small">
                        Welcome back
                    </p>

                    <h1>
                        {user?.username || "User"}
                    </h1>

                    <p className="dashboard-date">
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            }
                        )}
                    </p>
                </div>

                <Link
                    to="/create-task"
                    className="dashboard-create"
                >
                    + Create Task
                </Link>

            </div>


            <div className="stats-grid">

                <div className="stat-card">
                   

                    <div>
                        <p>Total Tasks</p>
                        <h2>{totalTasks}</h2>
                    </div>
                </div>


                <div className="stat-card">
                   

                    <div>
                        <p>Completed</p>
                        <h2>{completedTasks}</h2>
                    </div>
                </div>


                <div className="stat-card">
                   
                    <div>
                        <p>Pending</p>
                        <h2>{pendingTasks}</h2>
                    </div>
                </div>


                <div className="stat-card">
                    

                    <div>
                        <p>Progress</p>
                        <h2>{completionPercentage}%</h2>
                    </div>
                </div>

            </div>


            <div className="dashboard-grid">

                <div className="dashboard-card progress-card">

                    <div className="card-header">
                        <h2>Today's Progress</h2>
                        <span>
                            {completedTasks}/{totalTasks}
                        </span>
                    </div>

                    <div className="progress-container">

                        <div className="progress-bar">

                            <div
                                className="progress-fill"
                                style={{
                                    width: `${completionPercentage}%`
                                }}
                            />

                        </div>

                        <p>
                            {completionPercentage === 100
                                ? "All tasks completed! 🎉"
                                : `${completionPercentage}% of today's tasks completed`}
                        </p>

                    </div>

                </div>


                <div className="dashboard-card timer-card">

                    <div className="card-header">
                        <h2>Focus Session</h2>
                        <span>
                            {todaySession?.completedAt
                                ? "Completed"
                                : todaySession?.startTime
                                    ? "Working"
                                    : "Not Started"}
                        </span>
                    </div>

                    <div className="timer">

                     

                        <strong>
                            {formatTime(
                                getElapsedTime()
                            )}
                        </strong>

                    </div>

                </div>

            </div>


            <div className="dashboard-card tasks-card">

                <div className="card-header">

                    <h2>
                        Today's Tasks
                    </h2>

                    <Link to="/create-task">
                        View All →
                    </Link>

                </div>


                {todayTasks.length === 0 ? (

                    <div className="empty-tasks">

                     

                        <h3>
                            No tasks for today
                        </h3>

                        <p>
                            Start your day by creating
                            your first task.
                        </p>

                        <Link
                            to="/create-task"
                            className="empty-button"
                        >
                            Create Task
                        </Link>

                    </div>

                ) : (

                    <div className="task-list">

                        {todayTasks.map(
                            (task, index) => (

                                <div
                                    className="dashboard-task"
                                    key={task.id}
                                >

                                    <span className="task-number">
                                        {index + 1}
                                    </span>

                                    <span
                                        className={
                                            task.completed
                                                ? "dashboard-task-text completed"
                                                : "dashboard-task-text"
                                        }
                                    >
                                        {task.text ||
                                            "Untitled task"}
                                    </span>

                                    <span className="task-status">

                                        {task.completed
                                            ? "Completed"
                                            : task.submitted
                                                ? "Pending"
                                                : "Draft"}

                                    </span>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>
    );
}