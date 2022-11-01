/*global chrome*/
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Authenticate from "./authenticate/authenticate"
import TabField from './tab/tabfield';
import Header from './header/header'
import Modal from './modal/Modal'
import { Dash } from 'react-bootstrap-icons';

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
      <Authenticate unlocked={unlocked} setUnlocked={(e:boolean) => setUnlocked(e)}/>
      <TabField unlocked={unlocked}></TabField>
      <ResetPassword></ResetPassword>
      <Modal handleClose={hideModal} show={show} children={""} />
    </div>
  )
}

function ResetPassword(){
  return <div>{}</div>
}

const root = ReactDOM.createRoot(document.getElementById('root') as Element);
root.render(
 <Dashboard></Dashboard>
);


