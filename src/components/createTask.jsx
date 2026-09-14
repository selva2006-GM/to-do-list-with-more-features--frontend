
import React, { useEffect, useState } from "react";
import "./createTask.css";

export default function CreateTask() {

    const today = new Date().toISOString().split("T")[0];

    const [tasks, setTasks] = useState(() => {
        const savedTasks = localStorage.getItem("tasks");

        return savedTasks
            ? JSON.parse(savedTasks)
            : [];
    });

    const [session, setSession] = useState(() => {
        const savedSession = localStorage.getItem("taskSession");

        return savedSession
            ? JSON.parse(savedSession)
            : null;
    });

    const [currentTime, setCurrentTime] = useState(Date.now());

    useEffect(() => {
        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
    }, [tasks]);

    useEffect(() => {
        if (session?.startTime && !session?.completedAt) {

            const timer = setInterval(() => {
                setCurrentTime(Date.now());
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [session]);

    useEffect(() => {
        if (session) {
            localStorage.setItem(
                "taskSession",
                JSON.stringify(session)
            );
        }
    }, [session]);


    const todayTasks = tasks.filter(
        task => task.date === today
    );

    const todaySession =
        session?.date === today
            ? session
            : null;


    function addTask() {

        if (todaySession?.startTime) {
            return;
        }

        const newTask = {
            id: crypto.randomUUID(),
            text: "",
            date: today,
            submitted: false,
            completed: false,
            editing: false
        };

        setTasks(prevTasks => [
            ...prevTasks,
            newTask
        ]);
    }


    function updateTask(id, value) {

        if (todaySession?.startTime) {
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        text: value
                    }
                    : task
            )
        );
    }


    function submitTask(id) {

        if (todaySession?.startTime) {
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        submitted: true
                    }
                    : task
            )
        );
    }


    function editTask(id) {

        if (todaySession?.startTime) {
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        editing: true
                    }
                    : task
            )
        );
    }


    function saveTask(id) {

        if (todaySession?.startTime) {
            return;
        }

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        editing: false
                    }
                    : task
            )
        );
    }


    function completeTask(id) {

        setTasks(prevTasks =>
            prevTasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        completed: !task.completed
                    }
                    : task
            )
        );
    }


    function startSession() {

        if (todayTasks.length === 0) {
            return;
        }

        const confirmStart = window.confirm(
            "Once you start, you cannot edit or add tasks. Start the timer?"
        );

        if (!confirmStart) {
            return;
        }

        setSession({
            date: today,
            startTime: Date.now(),
            completedAt: null
        });
    }


    useEffect(() => {

        if (
            todaySession?.startTime &&
            !todaySession?.completedAt &&
            todayTasks.length > 0
        ) {

            const allCompleted =
                todayTasks.every(
                    task => task.completed
                );

            if (allCompleted) {

                setSession(prev => ({
                    ...prev,
                    completedAt: Date.now()
                }));
            }
        }

    }, [
        tasks,
        todaySession
    ]);


    function getElapsedTime() {

        if (!todaySession?.startTime) {
            return 0;
        }

        const endTime =
            todaySession.completedAt || currentTime;

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


    const sessionStarted =
        todaySession?.startTime;

    const sessionFinished =
        todaySession?.completedAt;


    return (
        <div className="task-container">

            {todayTasks.length === 0 && (
                <button
                    className="create-button"
                    onClick={addTask}
                >
                    Start Today
                </button>
            )}


            {todayTasks.length > 0 && (
                <>

                    {sessionStarted && (
                        <div className="total-timer">
                            ⏱️ {formatTime(getElapsedTime())}
                        </div>
                    )}


                    {todayTasks.map((task, index) => (

                        <div
                            className="task"
                            key={task.id}
                        >

                            <span className="task-id">
                                {index + 1}
                            </span>


                            {!task.submitted &&
                                !task.editing && (
                                    <>
                                        <input
                                            type="text"
                                            placeholder="Enter your task"
                                            value={task.text}
                                            disabled={sessionStarted}
                                            onChange={(e) =>
                                                updateTask(
                                                    task.id,
                                                    e.target.value
                                                )
                                            }
                                        />

                                        {!sessionStarted && (
                                            <button
                                                onClick={() =>
                                                    submitTask(task.id)
                                                }
                                            >
                                                Enter
                                            </button>
                                        )}
                                    </>
                                )}


                            {task.submitted &&
                                !task.editing && (
                                    <>
                                        <span
                                            className={
                                                task.completed
                                                    ? "task-text completed"
                                                    : "task-text"
                                            }
                                        >
                                            {task.text}
                                        </span>

                                        <input
                                            type="checkbox"
                                            checked={task.completed}
                                            disabled={
                                                !sessionStarted ||
                                                sessionFinished
                                                    ? false
                                                    : false
                                            }
                                            onChange={() =>
                                                completeTask(
                                                    task.id
                                                )
                                            }
                                        />

                                        {!sessionStarted && (
                                            <button
                                                onClick={() =>
                                                    editTask(task.id)
                                                }
                                            >
                                                Edit
                                            </button>
                                        )}
                                    </>
                                )}


                            {task.editing && (
                                <>
                                    <input
                                        type="text"
                                        value={task.text}
                                        disabled={sessionStarted}
                                        onChange={(e) =>
                                            updateTask(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    {!sessionStarted && (
                                        <button
                                            onClick={() =>
                                                saveTask(task.id)
                                            }
                                        >
                                            Save
                                        </button>
                                    )}
                                </>
                            )}

                        </div>

                    ))}


                    {!sessionStarted && (
                        <button
                            className="start-button"
                            onClick={startSession}
                        >
                            Start
                        </button>
                    )}


                    {sessionStarted &&
                        !sessionFinished && (
                            <div className="session-status">
                                Working...
                            </div>
                        )}


                    {sessionFinished && (
                        <div className="session-status">
                            Completed in {formatTime(
                                getElapsedTime()
                            )}
                        </div>
                    )}

                </>
            )}

        </div>
    );
}
