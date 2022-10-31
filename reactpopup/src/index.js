/*global chrome*/
import React, {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Authenticate from "./authenticate/authenticate.js"
import TabField from './tab/tabfield.js';
import Header from './header/header.js'
import Modal from './modal/Modal.js'

function Dashboard() {
  const [show, setShow] = useState(false);
  const [unlocked, setUnlocked] = useState(false)

useEffect(() => {
  chrome.storage.sync.get(['unlocked'], (result) => {
    if(result.unlocked === undefined) {
      chrome.storage.sync.set({unlocked: true})
    }
    setUnlocked(result.unlocked)
  })
},[])

  function showModal() {
    setShow(true)
  }

  function hideModal() {
    setShow(false)
  }

  return (
    <div className='dashboard'>
      <Header showModal={showModal}/>
      <Authenticate unlocked={unlocked} setUnlocked={(e) => setUnlocked(e)}/>
      <TabField unlocked={unlocked}></TabField>
      <ResetPassword></ResetPassword>
      <Modal handleClose={hideModal} show={show} children={""} />
    </div>
  )
}

function ResetPassword(props){
  
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Dashboard/>
  </React.StrictMode>
);


