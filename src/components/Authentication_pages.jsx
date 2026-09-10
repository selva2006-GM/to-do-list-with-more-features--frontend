import React from "react";
import { useState } from "react";

export default function Authentication_pages(){

    const [username, setusername] = useState("");
    const [password, setpassword] = useState("");
    const [email, setemail] = useState("");
    const [repeatpassword, setrepeatpassword] = useState("");

    function show(){

        document.getElementById("password").type ="text";
        console.log(email);
    }
    function senddata(){

    }
    return(
        <>
        <form onSubmit={senddata}>

            <label> 
            Username <input type="text" name="username" 
            required/>
            </label>
            <label >
                Email 
                <input type="email" name="email" required/>
            </label>
            <label > 
                Password 
                <input type="password" name="password" id="password" required/>
                <button onClick={show}>show</button>
            </label>
            <label >
                repeat 
                <input type="password"
                name="repeatpassword"
                id="password"
                required/>
            </label>
            <button type="submit">submit</button>
        </form>
        </>
    )
}