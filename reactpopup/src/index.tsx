/*global chrome*/
import {useState, useEffect} from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Authenticate from "./authenticate/authenticate"
import TabField from './tab/tabfield';
import Header from './header/header'
import Modal from './modal/modal'
import Options from './options/options';

var views = chrome.extension.getViews({ type: "popup" });

function Dashboard() {
  const [show, setShow] = useState(false);
  const [unlocked, setUnlocked] = useState(false)
  useEffect(() => {
    chrome.storage.sync.get(['unlocked', 'blacklisted','blockShorts', 'blockSearch', 'blockChannels', 'autoLock', "password",'removeBlockedElements'], (syncResult) => {
      chrome.storage.local.get(['unlocked', 'blacklisted','blockShorts', 'blockSearch', 'blockChannels', 'autoLock', "password",'removeBlockedElements'], (localResult) => {
        
        if(syncResult.unlocked === undefined && localResult.unlocked === undefined) {
          chrome.storage.local.set({unlocked: false})
        } else if (syncResult.unlocked !== undefined && localResult.unlocked === undefined) {
          chrome.storage.local.set({unlocked: syncResult.unlocked})
        }
        if(syncResult.blacklisted === undefined && localResult.blacklisted === undefined) {
          chrome.storage.local.set({blacklisted: true})
        } else if (syncResult.blacklisted !== undefined && localResult.blacklisted === undefined) {
          chrome.storage.local.set({blacklisted: syncResult.blacklisted})
        }
        if(syncResult.blockShorts === undefined && localResult.blockShorts === undefined) {
          chrome.storage.local.set({blockShorts: true})
        } else if (syncResult.blockShorts !== undefined && localResult.blockShorts === undefined) {
          chrome.storage.local.set({blockShorts: syncResult.blockShorts})
        }
        if(syncResult.blockSearch === undefined && localResult.blockSearch === undefined) {
          chrome.storage.local.set({blockSearch: true})
        } else if (syncResult.blockSearch !== undefined && localResult.blockSearch === undefined) {
          chrome.storage.local.set({blockSearch: syncResult.blockSearch})
        }
        if(syncResult.blockChannels === undefined && localResult.blockChannels === undefined) {
          chrome.storage.local.set({blockChannels: true})
        } else if (syncResult.blockChannels !== undefined && localResult.blockChannels === undefined) {
          chrome.storage.local.set({blockChannels: syncResult.blockChannels})
        }
        if(syncResult.autoLock === undefined && localResult.autoLock === undefined) {
          chrome.storage.local.set({autoLock: false})
        } else if (syncResult.autoLock !== undefined && localResult.autoLock === undefined) {
          chrome.storage.local.set({autoLock: syncResult.autoLock})
        }
        if(syncResult.password === undefined && localResult.password === undefined) {
          chrome.storage.local.set({password: ""})
        } else if (syncResult.password !== undefined && localResult.password === undefined) {
          chrome.storage.local.set({password: syncResult.password})
        }
        if(syncResult.removeBlockedElements === undefined && localResult.removeBlockedElements === undefined) {
          chrome.storage.local.set({removeBlockedElements: false})
        } else if (syncResult.removeBlockedElements !== undefined && localResult.removeBlockedElements === undefined) {
          chrome.storage.local.set({removeBlockedElements: syncResult.removeBlockedElements})
        }

        setUnlocked(localResult.unlocked)
        setInterval(() => {
          chrome.storage.local.get(["lockTime"], (result) => {
              if (result.lockTime){
                  if (result.lockTime < new Date().getTime()){
                      chrome.storage.local.set({lockTime: false})
                      chrome.storage.local.set({unlocked: false})
                      setUnlocked(false)
                      console.log("Lock")
                  }
              }
          })
        }, 1000)
      })
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
if (views.length > 0){
  root.render(
    <Dashboard></Dashboard>
  );
} else {
  root.render(<Options/>)
}



