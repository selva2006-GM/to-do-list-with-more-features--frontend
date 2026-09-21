import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import "./CreateTask.css";
import { Link } from "react-router-dom";

export default function UCreateTask() {
    const [tasks, setTasks] = useState([]);
    const [session, setSession] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [loaded, setLoaded] = useState(false);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        const savedTasks = localStorage.getItem("tasks");
        const savedSession = localStorage.getItem("taskSession");

        if (savedTasks) {
            setTasks(JSON.parse(savedTasks));
        }

        if (savedSession) {
            setSession(JSON.parse(savedSession));
        }

        setLoaded(true);
    }, []);

    useEffect(() => {
        if (!loaded) {
            return;
        }

        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
    }, [tasks, loaded]);

    useEffect(() => {
        if (!loaded) {
            return;
        }

        if (session) {
            localStorage.setItem(
                "taskSession",
                JSON.stringify(session)
            );
        }
    }, [session, loaded]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    const todayTasks = tasks.filter(
        (task) => task.date === today
    );

    const todaySession =
        session?.date === today ? session : null;

    const sessionStarted = !!todaySession?.startTime;

    const sessionFinished = !!todaySession?.completedAt;

    function addTask() {
        if (sessionStarted) {
            alert("Today's session has already started.");
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            text: "",
            date: today,
            submitted: false,
            completed: false,
            editing: true,
        };

        setTasks((prev) => [...prev, newTask]);
    }

    function updateTask(id, value) {
        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          text: value,
                      }
                    : task
            )
        );
    }

    function submitTask(id) {
        const task = todayTasks.find(
            (task) => task.id === id
        );

        if (!task?.text.trim()) {
            alert("Please enter a task.");
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          text: task.text.trim(),
                          submitted: true,
                          editing: false,
                      }
                    : task
            )
        );
    }

    function editTask(id) {
        if (sessionStarted) {
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          editing: true,
                          submitted: false,
                      }
                    : task
            )
        );
    }

    function saveTask(id) {
        const task = todayTasks.find(
            (task) => task.id === id
        );

        if (!task?.text.trim()) {
            alert("Task cannot be empty.");
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          text: task.text.trim(),
                          submitted: true,
                          editing: false,
                      }
                    : task
            )
        );
    }

    function deleteTask(id) {
        if (sessionStarted) {
            return;
        }

        setTasks((prev) =>
            prev.filter((task) => task.id !== id)
        );
    }

    function startSession() {
        if (todayTasks.length === 0) {
            alert("Please create at least one task.");
            return;
        }

        const unsubmittedTask = todayTasks.some(
            (task) => !task.submitted
        );

        if (unsubmittedTask) {
            alert(
                "Please submit all tasks before starting."
            );
            return;
        }

        const confirmStart = window.confirm(
            "Start today's task session?"
        );

        if (!confirmStart) {
            return;
        }

        setSession({
            date: today,
            startTime: Date.now(),
            completedAt: null,
        });
    }

    function completeTask(id) {
        if (
            !todaySession?.startTime ||
            sessionFinished
        ) {
            return;
        }

        setTasks((prev) =>
            prev.map((task) =>
                task.id === id
                    ? {
                          ...task,
                          completed: !task.completed,
                      }
                    : task
            )
        );
    }

    useEffect(() => {
        if (
            sessionStarted &&
            !sessionFinished &&
            todayTasks.length > 0
        ) {
            const allCompleted = todayTasks.every(
                (task) => task.completed
            );

            if (allCompleted) {
                setSession((prev) => ({
                    ...prev,
                    completedAt: Date.now(),
                }));
            }
        }
    }, [
        tasks,
        sessionStarted,
        sessionFinished,
        todayTasks.length,
    ]);

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

        return `${String(hours).padStart(
            2,
            "0"
        )}:${String(minutes).padStart(
            2,
            "0"
        )}:${String(secs).padStart(
            2,
            "0"
        )}`;
    }

    const completedTasks = todayTasks.filter(
        (task) => task.completed
    ).length;

    return (
        <div className="create-task-page">
            <div className="create-task-header">
                <Link
                    to="/"
                    className="home-button"
                >
                    Home
                </Link>

                <div>
                    <p className="small-title">
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            }
                        )}
                    </p>

                    <h1>Today's Tasks</h1>

                    <p className="subtitle">
                        Plan your work and stay focused.
                    </p>
                </div>

                <div className="task-progress">
                    <span>
                        {completedTasks}/
                        {todayTasks.length}
                    </span>

                    <small>
                        {" "}
                        completed
                    </small>
                </div>
            </div>

            <div className="task-container">
                {todayTasks.length === 0 ? (
                    <div className="empty-task">
                        <h2>No tasks yet</h2>

                        <p>
                            Create your first task
                            to start today's session.
                        </p>

                        <button
                            type="button"
                            className="primary-button"
                            onClick={addTask}
                        >
                            + Create Task
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="task-list">
                            {todayTasks.map(
                                (task, index) => (
                                    <div
                                        className={`task-item ${
                                            task.completed
                                                ? "task-completed"
                                                : ""
                                        }`}
                                        key={task.id}
                                    >
                                        <div className="task-number">
                                            {index + 1}
                                        </div>

                                        <div className="task-content">
                                            {task.editing ? (
                                                <input
                                                    type="text"
                                                    value={
                                                        task.text
                                                    }
                                                    onChange={(e) =>
                                                        updateTask(
                                                            task.id,
                                                            e.target.value
                                                        )
                                                    }
                                                    placeholder="What do you want to accomplish?"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span>
                                                    {
                                                        task.text
                                                    }
                                                </span>
                                            )}

                                            {!task.editing && (
                                                <small>
                                                    {task.completed
                                                        ? "Completed"
                                                        : task.submitted
                                                        ? "Ready to work"
                                                        : "Draft"}
                                                </small>
                                            )}
                                        </div>

                                        <div className="task-actions">
                                            {task.editing && (
                                                <button
                                                    type="button"
                                                    className="save-button"
                                                    onClick={() =>
                                                        task.submitted
                                                            ? saveTask(
                                                                  task.id
                                                              )
                                                            : submitTask(
                                                                  task.id
                                                              )
                                                    }
                                                >
                                                    Save
                                                </button>
                                            )}

                                            {!task.editing &&
                                                !sessionStarted && (
                                                    <button
                                                        type="button"
                                                        className="edit-button"
                                                        onClick={() =>
                                                            editTask(
                                                                task.id
                                                            )
                                                        }
                                                    >
                                                        Edit
                                                    </button>
                                                )}

                                            {!task.editing &&
                                                sessionStarted && (
                                                    <input
                                                        type="checkbox"
                                                        checked={
                                                            task.completed
                                                        }
                                                        onChange={() =>
                                                            completeTask(
                                                                task.id
                                                            )
                                                        }
                                                        disabled={
                                                            sessionFinished
                                                        }
                                                    />
                                                )}

                                            {!sessionStarted && (
                                                <button
                                                    type="button"
                                                    className="delete-button"
                                                    onClick={() =>
                                                        deleteTask(
                                                            task.id
                                                        )
                                                    }
                                                >
                                                    ×
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                )
                            )}
                        </div>

                        {!sessionStarted && (
                            <button
                                type="button"
                                className="add-task-button"
                                onClick={addTask}
                            >
                                +
                            </button>
                        )}

                        <div className="session-section">
                            {!sessionStarted && (
                                <button
                                    type="button"
                                    className="start-button"
                                    onClick={
                                        startSession
                                    }
                                >
                                    Start Today's Session
                                </button>
                            )}

                            {sessionStarted &&
                                !sessionFinished && (
                                    <div className="working-box">
                                        <span className="status-dot"></span>

                                        <div>
                                            <strong>
                                                Working...
                                            </strong>

                                            <p>
                                                {formatTime(
                                                    getElapsedTime()
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                )}

                            {sessionFinished && (
                                <div className="completed-box">
                                    <span>✓</span>

                                    <div>
                                        <strong>
                                            Day Completed
                                        </strong>

                                        <p>
                                            Total time:{" "}
                                            {formatTime(
                                                getElapsedTime()
                                            )}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}