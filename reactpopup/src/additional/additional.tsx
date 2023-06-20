import {ChangeEventHandler, useState} from "react";
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import './additional.css';

function Additional(props:{unlocked:boolean, activeTab:string}){
    const [removeElements,setRemoveElements] = useState(false)
    const [removeElementsInfo, setRemoveElementsInfo] = useState(false)
    chrome.storage.local.get(['removeBlockedElements'], (result) => {
        setRemoveElements(result.removeBlockedElements)
    })

    function showRemoveElementsInfo(){
        setRemoveElementsInfo(true)
    }

    function hideRemoveElementsInfo(){
        setRemoveElementsInfo(false)
    }

    function handleRemoveElements() {
        chrome.storage.local.set({removeBlockedElements: !removeElements})
        setRemoveElements(!removeElements)
    }

    if (props.activeTab === "additional"){
        return(
            <div className = "additional-container">
                <div className="hide-elements-container">
                    <RemoveBlockedElements removeElements={removeElements} removeElementsInfo={removeElementsInfo} hideRemoveElementsInfo = {hideRemoveElementsInfo} showRemoveElementsInfo = {showRemoveElementsInfo} handleRemoveElements={handleRemoveElements}/>
                </div>   
                <div className="import-export-container">
                    <ExportList/>
                    <ImportList/>
                </div>
            </div>
        )
    } else {
        return(null)
    }
}

function RemoveBlockedElements(props:{removeElements: boolean, removeElementsInfo: boolean, showRemoveElementsInfo: () => void, hideRemoveElementsInfo: () => void, handleRemoveElements: ChangeEventHandler}){


    return(
        <div className='channel-box'>
        <div className={props.removeElements ? `channel-indicator checkbox-width-control active` : `channel-indicator checkbox-width-control`}>
            Remove Elements
            <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showRemoveElementsInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble channel-info-bubble" viewBox="0 0 16 16">
                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
            </svg>
            <Modal show={props.removeElementsInfo} onHide={props.hideRemoveElementsInfo}>
                <Modal.Header closeButton>
                    <Modal.Title>Remove Elements</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className='modal-body'>
                        <div>{`Currently: ${props.removeElements ? 'On' : 'Off'}`}</div>
                        <br/>
                        <p>{`This setting is purely visual! Removes blocked video elements from view on the home screen and on search. (Note, this may result in a more laggy experience if you are using whitelist mode, as Youtube will continuously try to load in more videos which will get blocked)`}</p>
                    </div>
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={props.hideRemoveElementsInfo}>
                    Close
                </Button>
                </Modal.Footer>
            </Modal>
            </div>
        <label className='switch'>
            <input className='block-checkbox' type="checkbox" checked={props.removeElements} onChange={props.handleRemoveElements}></input>
            <span className='slider'></span>
        </label>
        </div>
    )
}

function ExportList(){

    const [data,setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    function handleExport(){
        setIsLoading(true);
        (document.querySelector('.export-link') as HTMLAnchorElement).click()
    }

    function updateData(){
        chrome.storage.local.get('blockedchannelids', (result) => {
            setData(result.blockedchannelids)
            setIsLoading(false)
        })
    }

    if (isLoading){
        return(
            <div className="export-container">
                <a className='export-link' href="/" style={{display:'none'}}>Export</a>
                <Button onClick={updateData} className='export-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download load-icon" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Export List
                </Button>
            </div>
        )
    } else {
        return(
            <div className="export-container">
                <a className='export-link' href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(data))}`} download={"settings.json"} style={{display:'none'}}>Export</a>
                <Button onClick={handleExport} className='export-button'>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-download load-icon" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 11.854a.5.5 0 0 0 .708 0l3-3a.5.5 0 0 0-.708-.708L8.5 10.293V1.5a.5.5 0 0 0-1 0v8.793L5.354 8.146a.5.5 0 1 0-.708.708l3 3z"/>
                    </svg>
                    Download
                </Button>
            </div>
        )
    }
}

function ImportList(){
    function handleUpload(){
        console.log("here")
        if (chrome.runtime.openOptionsPage) {
            chrome.runtime.openOptionsPage();
          } else {
            window.open(chrome.runtime.getURL('index.html'));
          } 
    }

    return(
        <div className="import-container">
            <Button onClick={handleUpload} className='import-button'>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload load-icon" viewBox="0 0 16 16">
                <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
            </svg>
            Upload List
            </Button>
            </div>
    )
}

export default Additional