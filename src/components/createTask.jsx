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

    useEffect(() => {
        localStorage.setItem(
            "tasks",
            JSON.stringify(tasks)
        );
    }, [tasks]);


    // Only today's tasks
    const todayTasks = tasks.filter(
        task => task.date === today
    );


    // Create a new task
    function addTask() {

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


    // Update task text
    function updateTask(id, value) {

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


    // Submit task
    function submitTask(id) {

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


    // Edit task
    function editTask(id) {

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


    // Save edited task
    function saveTask(id) {

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


    // Complete / uncomplete task
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


    return (
        <div className="task-container">

            {/* No tasks for today */}
            {todayTasks.length === 0 && (

                <button
                    className="create-button"
                    onClick={addTask}
                >
                    Start Today
                </button>

            )}


            {/* Today's tasks */}
            {todayTasks.length > 0 && (

                <>
                    {todayTasks.map((task, index) => (

                        <div
                            className="task"
                            key={task.id}
                        >

                            {/* Task number */}
                            <span className="task-id">
                                {index + 1}
                            </span>


                            {/* New task */}
                            {!task.submitted && !task.editing && (

                                <>
                                    <input
                                        type="text"
                                        placeholder="Enter your task"
                                        value={task.text}
                                        onChange={(e) =>
                                            updateTask(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            submitTask(task.id)
                                        }
                                    >
                                        Enter
                                    </button>
                                </>

                            )}


                            {/* Display submitted task */}
                            {task.submitted && !task.editing && (

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
                                        onChange={() =>
                                            completeTask(task.id)
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            editTask(task.id)
                                        }
                                    >
                                        Edit
                                    </button>
                                </>

                            )}


                            {/* Edit task */}
                            {task.editing && (

                                <>
                                    <input
                                        type="text"
                                        value={task.text}
                                        onChange={(e) =>
                                            updateTask(
                                                task.id,
                                                e.target.value
                                            )
                                        }
                                    />

                                    <button
                                        onClick={() =>
                                            saveTask(task.id)
                                        }
                                    >
                                        Save
                                    </button>
                                </>

                            )}

                        </div>

                    ))}


                    {/* Add another task */}
                    <button
                        className="plus-button"
                        onClick={addTask}
                    >
                        +
                    </button>

                </>

            )}

        </div>
    );
}

