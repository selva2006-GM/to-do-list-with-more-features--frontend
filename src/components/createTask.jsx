import React, { useEffect, useState } from "react";

import "./createTask.css"
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


    const todayTasks = tasks.filter(
        task => task.date === today
    );


    function createTask() {

        const newTask = {
            id: crypto.randomUUID(),
            text: "",
            date: today,
            submitted: false,
            completed: false,
            editing: false
        };

        setTasks([
            ...tasks,
            newTask
        ]);
    }

    function updateTask(id, value) {

        setTasks(
            tasks.map(task =>
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

        setTasks(
            tasks.map(task =>
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

        setTasks(
            tasks.map(task =>
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

        setTasks(
            tasks.map(task =>
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

        setTasks(
            tasks.map(task =>
                task.id === id
                    ? {
                        ...task,
                        completed: !task.completed
                    }
                    : task
            )
        );
    }


    function addTask() {

        const newTask = {
            id: crypto.randomUUID(),
            text: "",
            date: today,
            submitted: false,
            completed: false,
            editing: false
        };

        setTasks([
            ...tasks,
            newTask
        ]);
    }


    return (
        <div className="task-container">

            {todayTasks.length === 0 && (

                <button
                    className="create-button"
                    onClick={createTask}
                >
                    Start Today
                </button>

            )}

            {todayTasks.length > 0 && (

                <>
                    {todayTasks.map(task => (

                        <div
                            className="task"
                            key={task.id}
                        >

                            {/* Task ID */}

                            <span className="task-id">
                                {task.id.slice(0, 4)}
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
                                            onChange={() =>
                                                completeTask(
                                                    task.id
                                                )
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


                    {/* Add task */}

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