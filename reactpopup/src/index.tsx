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
    console.log(chrome.storage.sync.get(['unlocked', 'blacklisted','blockSearch','blockShorts','blockChannels']))

    chrome.storage.sync.get(['unlocked', 'blacklisted','blockShorts', 'blockSearch', 'blockChannels', 'autoLock'], (result) => {
      if(result.unlocked === undefined) {
        chrome.storage.sync.set({unlocked: false})
      }
      if(result.blacklisted === undefined) {
        chrome.storage.sync.set({blacklisted: true})
      }
      if(result.blockShorts === undefined) {
        chrome.storage.sync.set({blockShorts: true})
      }
      if(result.blockSearch === undefined) {
        chrome.storage.sync.set({blockSearch: true})
      }
      if(result.blockChannels === undefined) {
        chrome.storage.sync.set({blockChannels: true})
      }
      if(result.autoLock === undefined) {
        chrome.storage.sync.set({autoLock: false})
      }
      setUnlocked(result.unlocked)

      setInterval(() => {
        chrome.storage.sync.get(["lockTime","password"], (result) => {
            if (result.lockTime){
                if (result.lockTime < new Date().getTime()){
                    chrome.storage.sync.set({lockTime: false})
                    chrome.storage.sync.set({unlocked: false})
                    setUnlocked(false)
                    console.log("Lock")
                }
            }
        })
    }, 1000)   
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
      <Header showModal={showModal}>
        <Modal handleClose={hideModal} handleShow={showModal} show={show}/>
      </Header>
      <Authenticate unlocked={unlocked} setUnlocked={(e:boolean) => setUnlocked(e)}/>
      <TabField unlocked={unlocked}></TabField>
      <ResetPassword></ResetPassword>
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

