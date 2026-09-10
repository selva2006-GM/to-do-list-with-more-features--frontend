
import React, { useState } from "react";

export default function CreateTask() {

    const [showInput, setShowInput] = useState(false);
    const [task, setTask] = useState("");

    const URL = "http://localhost:5000/createtask";

    function saveTask(event) {

        event.preventDefault();

        console.log("Task:", task);

        const date = new Date();
        const taskid = date.getTime();

        console.log(`taskid = ${taskid}`);

        const options = {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                taskid: taskid,
                task: task
            })
        };

        fetch(URL, options)
            .then(response => response.json())
            .then(data => console.log(data))
            .catch(error => console.error("Error:", error));

        setTask("");
        setShowInput(false);
    }

    return (
        <>
            <button onClick={() => setShowInput(true)}>
                CreateButton
            </button>

            {showInput && (
                <form onSubmit={saveTask} id="tasks">

                    <label>
                        Enter the task:

                        <input
                            type="text"
                            value={task}
                            onChange={(e) => setTask(e.target.value)}
                        />
                    </label>

                    <button type="submit">
                        submit
                    </button>

                </form>
            )}
        </>
    );
}
