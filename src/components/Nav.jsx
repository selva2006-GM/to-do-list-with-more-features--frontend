import React from "react";


import "./Nav.css"

export default function Nav(){
    return(
        <>
        <div className="Nav">
            <div className="logo">Tracker</div>
            <div className="Links">

            <a href="">Login</a>
            <a href="">Register</a>
            <a href="">create Task</a>
            </div>
        </div>
        </>
    )
}