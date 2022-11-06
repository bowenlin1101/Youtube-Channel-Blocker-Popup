import React, {ChangeEvent, useCallback, useEffect, useState} from 'react';
// import ReactDOM from 'react-dom/client';
import {Lock, Unlock} from 'react-bootstrap-icons'
import './authenticate.css'

function LockBox(props:{unlocked:boolean,setUnlocked:Function}){
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

function PasswordBox(props:{unlocked:boolean,failed:string,value:string,setPasswordValue:Function}){
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

function Authenticate(props:{unlocked:boolean ,setUnlocked:Function}){
    const [password, setPassword] = useState("password")
    const [passwordValue,setPasswordValue] = useState("");
    const [failed, setFailed] = useState("");

    function handlePassword(password:string){
        setPasswordValue(password)
        setFailed("")
    }

    const escFunction = useCallback((event:KeyboardEvent) => {
        if (document.activeElement){
            if (event.key === "Enter" && document.activeElement.getAttribute("class") === "password-box"){
                console.log(password)
                if (password !== ""){
                    if (passwordValue === password){
                        props.setUnlocked(true)
                    } else {
                        setFailed(" shake")
                    }
                    setPasswordValue("")
                } else {
                    if (passwordValue.replace(/ /g,'') !== ""){
                        setPassword(passwordValue)
                        console.log(password)
                        alert(`Your password is: ${passwordValue}`)
                        setPasswordValue("")
                    }
                }
            }
        }
    }, [passwordValue,props])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return() => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction])

        if (password === ""){
            return(
                <div className="authenticate-wrapper">
                    <p className='authenticate-text'>Set a password</p>
                    <div className='password-box-wrapper'>
                        <div className='authenticate-offset'></div>
                        <PasswordBox unlocked={props.unlocked} failed={failed} value={passwordValue} setPasswordValue={(e:React.ChangeEvent<HTMLInputElement>) => handlePassword(e.target.value)}/>
                        <LockBox unlocked={props.unlocked} setUnlocked={(e:MouseEvent) => props.setUnlocked(e)}/>
                    </div>
                </div>
            )
        } else {
            return(
                <div className="authenticate-wrapper">
                    <p className='authenticate-text'>Enter password to change settings</p>
                    <div className='password-box-wrapper'>
                        <div className='authenticate-offset'></div>
                        <PasswordBox unlocked={props.unlocked} failed={failed} value={passwordValue} setPasswordValue={(e:React.ChangeEvent<HTMLInputElement>) => handlePassword(e.target.value)}/>
                        <LockBox unlocked={props.unlocked} setUnlocked={(e:MouseEvent) => props.setUnlocked(e)}/>
                    </div>
                </div>
            )
        }
}

export default Authenticate