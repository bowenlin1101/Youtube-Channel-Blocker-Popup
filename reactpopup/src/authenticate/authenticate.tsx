/*global chrome*/
import React, {useCallback, useEffect, useState} from 'react';
import {Lock, Unlock} from 'react-bootstrap-icons'
import Button from 'react-bootstrap/Button'
import Modal from 'react-bootstrap/Modal'
import 'font-awesome/css/font-awesome.min.css';
import './authenticate.css'

function LockBox(props:{unlocked:boolean,setUnlocked:Function}){
    function handleClick(){
        props.setUnlocked(false)
        chrome.storage.local.set({unlocked:false})
        chrome.storage.local.set({lockTime:false})
    }
    if (props.unlocked){
        return(
            <div className='lock-icon-container'>
                <Unlock onClick={handleClick} className="lock-icon unlock-offset"/>
            </div>
        )  
    } else {
        return(
            <div className='lock-icon-container'>
                <Lock className="lock-icon"/>
            </div>
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
    const [password, setPassword] = useState<string | null | undefined>()
    const [passwordValue,setPasswordValue] = useState("");
    const [failed, setFailed] = useState("");
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [modalPasswordValue, setModalPasswordValue] = useState("")
    const [modalConfirmValue, setModalConfirmValue] = useState("")
    const [modalFailed, setModalFailed] = useState('')
    useEffect(() => {

        chrome.storage.local.get(['password'], (result) => {
            setPassword(result.password)
        })     
    })

    function changeModalPasswordValue(password:string){
        setModalPasswordValue(password)
        setModalFailed('')
    }

    function changeModalConfirmValue(password:string){
        setModalConfirmValue(password)
        setModalFailed('')
    }

    function handlePassword(password:string){
        setPasswordValue(password)
        setFailed("")
    }

    function showSetPassword(){
        setShowPasswordModal(true)
    }

    function hideSetPassword(){
        setShowPasswordModal(false)
        setModalPasswordValue('')
        setModalConfirmValue('')
    }

    function handleSetPassword(){
        if (modalPasswordValue.replace(/ /g, '') !== '' && modalPasswordValue === modalConfirmValue){
            setShowPasswordModal(false)
            setPassword(modalConfirmValue)
            chrome.storage.local.set({password:modalConfirmValue})
        } else {
            setModalFailed(' shake')
        }
    }

    const escFunction = useCallback((event:KeyboardEvent) => {
        if (document.activeElement){
            if (event.key === "Enter" && document.activeElement.getAttribute("class") === "password-box"){
                console.log(password)
                    if (passwordValue === password){
                        props.setUnlocked(true)
                        chrome.storage.local.set({unlocked:true})
                        chrome.storage.local.get(['autoLock'], (result) => {
                            if (result.autoLock){
                                var today = new Date()
                                today.setMinutes(today.getMinutes() + 5)
                                chrome.storage.local.set({lockTime: today.getTime()} )
                            }
                        })
                    } else {
                        setFailed(" shake")
                    }
                    setPasswordValue("")
            }
        }
    }, [passwordValue, password,props])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return() => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction])

        if (password === ""){
            return(
                <div className="authenticate-wrapper">
                    <div className='set-password-wrapper'>
                        <Button className='set-password-button' onClick={showSetPassword}>Set Password</Button>
                        <Modal show={showPasswordModal} onHide={hideSetPassword}>
                            <Modal.Header closeButton>
                                <Modal.Title>Set Password</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <div className='modal-body'>
                                    <p>Password</p>
                                    <input type='password' className={`modal-password-box${modalFailed}`} value={modalPasswordValue} onChange={(e) => changeModalPasswordValue(e.target.value)}></input>
                                    <br/>
                                    <br/>
                                    <p>Type password again</p>
                                    <input type='password' className={`modal-password-box${modalFailed}`} value={modalConfirmValue} onChange={(e) => changeModalConfirmValue(e.target.value)}></input>
                                </div>
                            </Modal.Body>
                            <Modal.Footer>
                            <Button variant="secondary" onClick={hideSetPassword}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSetPassword}>
                                Save Changes
                            </Button>
                            </Modal.Footer>
                        </Modal>
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