import React from "react";
import { useState } from "react";
import { authService} from "fbase";

import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    } from 'firebase/auth';

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const onChange = (event) => {
        const {target: {name, value}} = event;
        if(name === "email"){
            setEmail(value)
        }else if(name === "password"){
            setPassword(value)
        }
    }
    const onSubmit = async(event) => {
        event.preventDefault();
        try {
            let data;
            if(newAccount){
                //create account
                data = await createUserWithEmailAndPassword(authService, email, password);
            } else{
                //log in
                data = await signInWithEmailAndPassword(authService, email, password);
            }    
            console.log(data)
        } catch (error) {
            setError(error.message);
        }
    };

    const toggleAccount = () => setNewAccount((prev) => !prev);

    return (
        <>
            <form onSubmit={onSubmit}>
                <input name="email" type="text" placeholder="Email" required value={email} onChange={onChange}/>
                <input name="password" type="password" placeholder="Password" required value={password} onChange={onChange}/>
                <input type="submit" value={newAccount ? "Create Account" : "Log In"} />
                {error}
            </form>
            <span onClick={toggleAccount}>{newAccount ? "Sign in" : "Create Account"}</span>
        </>
    );
};

export default AuthForm;