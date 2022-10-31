import React, {useCallback, useEffect, useState} from 'react';
// import ReactDOM from 'react-dom/client';
import {Lock, Unlock} from 'react-bootstrap-icons'
import './authenticate.css'

function LockBox(props){
    if (props.unlocked){
        return(
            <Unlock onClick={() => props.setUnlocked(false)} className="lock-icon"/>
        )  
    } else {
        return(
            <Lock className="lock-icon"/>
        )
    }
}

function PasswordBox(props){
    if (props.unlocked) {
        return (
            <input disabled type="password" className={`password-box${props.failed}`} value={props.value} onChange={(e) => props.setPasswordValue(e)}></input>
        )
    } else {
        return (
            <input type="password" className={`password-box${props.failed}`} value={props.value} onChange={(e) => props.setPasswordValue(e)}></input>
        )
    }
}

function Authenticate(props){
    const [passwordValue,setPasswordValue] = useState("");
    const [failed, setFailed] = useState("");

    function handlePassword(password){
        setPasswordValue(password)
        setFailed("")
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Enter" && document.activeElement.getAttribute("class") === "password-box"){
            if (passwordValue === "password"){
                props.setUnlocked(true)
            } else {
                setFailed(" shake")
            }
            setPasswordValue("")
        }
    }, [passwordValue,props])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return() => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction])

        return(
            <div className="authenticate-wrapper">
                <p className='authenticate-text'>Enter password to change settings</p>
                <div className='password-box-wrapper'>
                    <div className='authenticate-offset'></div>
                    <PasswordBox unlocked={props.unlocked} failed={failed} value={passwordValue} setPasswordValue={(e) => handlePassword(e.target.value)}/>
                    <LockBox unlocked={props.unlocked} setUnlocked={(e) => props.setUnlocked(e)}/>
                </div>
            </div>
        )
}

export default Authenticate