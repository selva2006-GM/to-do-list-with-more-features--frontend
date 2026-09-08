import React from "react";
import { useState } from "react";

export default function CreateTask(){

    const [showInput, setShowInput] = useState(false);
    const [task, setTask] = useState("");

    function saveTask(event){

        event.preventDefault();
        console.log("Task:", task);

        setTask("");

        setShowInput(false);
    
    }

    return(
        <>
        <button onClick={()=>setShowInput(true)}>CreateButton

        </button>


        {showInput && (
            <form onSubmit={saveTask} id="tasks">
                <label>Enter the task:
                    <input type="text" 
                    value={task} 
                    onChange={(e)=>setTask(e.target.value)}/>
                </label>
                <button type="submit">submit</button>
            </form>
        )}
        </>
    );
};