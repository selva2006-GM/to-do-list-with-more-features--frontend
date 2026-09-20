import React, { useEffect, useState } from "react";
import "./CreateTask.css";
import API_URL from "../config/api";

export default function CreateTask() {
    const [tasks, setTasks] = useState([]);
    const [session, setSession] = useState(null);
    const [currentTime, setCurrentTime] = useState(Date.now());
    const [loading, setLoading] = useState(true);

    const today = new Date().toISOString().split("T")[0];

    useEffect(() => {
        loadTasks();

        const savedSession = localStorage.getItem("taskSession");

        if (savedSession) {
            setSession(JSON.parse(savedSession));
        }
    }, []);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(Date.now());
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        if (session) {
            localStorage.setItem(
                "taskSession",
                JSON.stringify(session)
            );
        }
    }, [session]);

    async function loadTasks() {
        try {
            const token = localStorage.getItem("token");

            if (!token) {
                alert("Please login first.");
                setLoading(false);
                return;
            }

            const response = await fetch(
                `${API_URL}/api/tasks`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to load tasks");
                setLoading(false);
                return;
            }

            const formattedTasks = data.map(task => ({
                id: task.task_id,
                text: task.task_text,
                date: task.task_date,
                submitted: task.submitted,
                completed: task.completed,
                editing: false
            }));

            setTasks(formattedTasks);
        } catch (error) {
            console.error("LOAD TASKS ERROR:", error);
            alert("Unable to connect to server.");
        } finally {
            setLoading(false);
        }
    }

    const todayTasks = tasks.filter(
        task => task.date === today
    );

    const todaySession =
        session?.date === today ? session : null;

    const sessionStarted =
        !!todaySession?.startTime;

    const sessionFinished =
        !!todaySession?.completedAt;

        async function addTask() {
            if (sessionStarted) {
                return;
            }
        
            try {
                const token = localStorage.getItem("token");
        
                if (!token) {
                    alert("Please login first.");
                    return;
                }
        
                const response = await fetch(
                    `${API_URL}/api/tasks`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`
                        },
                        body: JSON.stringify({
                            task_text: "New Task",
                            task_date: today
                        })
                    }
                );
        
                const data = await response.json();
        
                if (!response.ok) {
                    alert(data.message || "Failed to create task");
                    return;
                }
        
                const serverTask = data.task;
        
                setTasks(prev => [
                    ...prev,
                    {
                        id: serverTask.task_id,
                        text: serverTask.task_text,
                        date: serverTask.task_date,
                        submitted: serverTask.submitted,
                        completed: serverTask.completed,
                        editing: true
                    }
                ]);
        
            } catch (error) {
                console.error("CREATE TASK ERROR:", error);
                alert("Unable to connect to server.");
            }
        }

    function updateTask(id, value) {
        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? {
                        ...task,
                        text: value
                    }
                    : task
            )
        );
    }

    async function submitTask(id) {
        const task = todayTasks.find(
            task => task.id === id
        );

        if (!task?.text.trim()) {
            alert("Please enter a task.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tasks`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        task_text: task.text.trim(),
                        task_date: today
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to create task");
                return;
            }

            const serverTask = data.task;

            setTasks(prev =>
                prev.map(task =>
                    task.id === id
                        ? {
                            id: serverTask.task_id,
                            text: serverTask.task_text,
                            date: serverTask.task_date,
                            submitted: serverTask.submitted,
                            completed: serverTask.completed,
                            editing: false
                        }
                        : task
                )
            );
        } catch (error) {
            console.error("CREATE TASK ERROR:", error);
            alert("Unable to connect to server.");
        }
    }

    function editTask(id) {
        if (sessionStarted) {
            return;
        }

        setTasks(prev =>
            prev.map(task =>
                task.id === id
                    ? {
                        ...task,
                        editing: true
                    }
                    : task
            )
        );
    }

    async function saveTask(id) {
        const task = todayTasks.find(
            task => task.id === id
        );

        if (!task?.text.trim()) {
            alert("Task cannot be empty.");
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        task_text: task.text.trim()
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update task");
                return;
            }

            const updatedTask = data.task;

            setTasks(prev =>
                prev.map(task =>
                    task.id === id
                        ? {
                            ...task,
                            text: updatedTask.task_text,
                            submitted: updatedTask.submitted,
                            completed: updatedTask.completed,
                            editing: false
                        }
                        : task
                )
            );
        } catch (error) {
            console.error("UPDATE TASK ERROR:", error);
            alert("Unable to connect to server.");
        }
    }

    async function deleteTask(id) {
        if (sessionStarted) {
            return;
        }

        if (String(id).startsWith("temp-")) {
            setTasks(prev =>
                prev.filter(task => task.id !== id)
            );

            return;
        }

        const confirmDelete = window.confirm(
            "Delete this task?"
        );

        if (!confirmDelete) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tasks/${id}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to delete task");
                return;
            }

            setTasks(prev =>
                prev.filter(task => task.id !== id)
            );
        } catch (error) {
            console.error("DELETE TASK ERROR:", error);
            alert("Unable to connect to server.");
        }
    }

    function startSession() {
        if (todayTasks.length === 0) {
            alert("Please create at least one task.");
            return;
        }

        const unsubmittedTask = todayTasks.some(
            task => !task.submitted
        );

        if (unsubmittedTask) {
            alert("Please submit all tasks before starting.");
            return;
        }

        const confirmStart = window.confirm(
            "Start today's task session?"
        );

        if (!confirmStart) {
            return;
        }

        const newSession = {
            date: today,
            startTime: Date.now(),
            completedAt: null
        };

        setSession(newSession);
    }

    async function completeTask(id) {
        if (!todaySession?.startTime || sessionFinished) {
            return;
        }

        const task = todayTasks.find(
            task => task.id === id
        );

        if (!task) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                `${API_URL}/api/tasks/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        completed: !task.completed
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update task");
                return;
            }

            setTasks(prev =>
                prev.map(task =>
                    task.id === id
                        ? {
                            ...task,
                            completed: !task.completed
                        }
                        : task
                )
            );
        } catch (error) {
            console.error("COMPLETE TASK ERROR:", error);
            alert("Unable to connect to server.");
        }
    }

    useEffect(() => {
        if (
            sessionStarted &&
            !sessionFinished &&
            todayTasks.length > 0
        ) {
            const allCompleted = todayTasks.every(
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
        sessionStarted,
        sessionFinished,
        todayTasks.length
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
        const hours = Math.floor(seconds / 3600);

        const minutes = Math.floor(
            (seconds % 3600) / 60
        );

        const secs = seconds % 60;

        return `${String(hours).padStart(2, "0")}:${String(
            minutes
        ).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }

    const completedTasks = todayTasks.filter(
        task => task.completed
    ).length;

    if (loading) {
        return (
            <div className="create-task-page">
                <div className="task-container">
                    <div className="empty-task">
                        <h2>Loading tasks...</h2>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="create-task-page">

            <div className="create-task-header">

                <div>
                    <p className="small-title">
                        {new Date().toLocaleDateString(
                            "en-IN",
                            {
                                weekday: "long",
                                day: "numeric",
                                month: "long"
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
                        {completedTasks}/{todayTasks.length}
                    </span>

                    <small>
                        {" "}completed
                    </small>
                </div>

            </div>

            <div className="task-container">

                {todayTasks.length === 0 ? (

                    <div className="empty-task">

                        <div className="empty-icon">
                            📝
                        </div>

                        <h2>No tasks yet</h2>

                        <p>
                            Create your first task to start
                            today's session.
                        </p>

                        <button
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
                                                    value={task.text}
                                                    onChange={e =>
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
                                                    {task.text}
                                                </span>

                                            )}

                                            {!task.editing && (
                                                <small>
                                                    {task.completed
                                                        ? "Completed"
                                                        : "Ready to work"}
                                                </small>
                                            )}

                                        </div>

                                        <div className="task-actions">

                                            {task.editing && (

                                                <button
                                                    className="save-button"
                                                    onClick={() =>
                                                        task.id.toString().startsWith("temp-")
                                                            ? submitTask(task.id)
                                                            : saveTask(task.id)
                                                    }
                                                >
                                                    Save
                                                </button>

                                            )}

                                            {!task.editing &&
                                                !sessionStarted && (

                                                    <button
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
                                className="add-task-button"
                                onClick={addTask}
                            >
                                +
                            </button>

                        )}

                        <div className="session-section">

                            {!sessionStarted && (

                                <button
                                    className="start-button"
                                    onClick={startSession}
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

                                    <span>
                                        ✓
                                    </span>

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