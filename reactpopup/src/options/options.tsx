import {useState, useEffect, useRef,ChangeEvent} from 'react'
import { Button, Modal } from 'react-bootstrap'
import './options.css'
//TODO create the modal for them to confirm

interface Channel {
    channelid: string,
    channelname: string,
    channelpageurl: string,
    link: string
}

function Options(){
    const [fileValue, setFileValue] = useState("")
    const [data, setData] = useState<Channel[] | null>(null)
    const reader = new FileReader()
    const inputFile = useRef<HTMLInputElement | null>(null)
    const [show, setShow] = useState(false)
    const [error, setError] = useState(false)
    function showModal(){
        setShow(true)
    }

    function hideModal(){
        setShow(false)
    }

    function escFunction(event:ProgressEvent<FileReader>){
        if (event && event.target){
            if (typeof(event.target.result) == 'string'){
                try{
                    const newData:[{channelid:string, channelname:string, channelpageurl: string, link: string}] = JSON.parse(event.target.result)
                    if (newData.every((object) => object.channelid && object.channelname && object.channelpageurl && object.link)){
                        setData(newData)
                        setError(false)
                        setFileValue("")
                        showModal()
                    } else {
                       throw Error("Bad File Format")
                    }
                } catch (e) {
                    setError(true)
                    showModal()
                    setFileValue("")
                }
            }
        }
    }
    function handleChange(e:ChangeEvent<HTMLInputElement>){
        if(e.target.files !=null && e.target.value.includes('settings')){            
            reader.readAsText(e.target.files[0])
        }
    }

    function handleSave(){
        chrome.storage.sync.set({blockedchannelids: data})
        hideModal()
    }

    function handleClick(){
        if (document){
            if (document.querySelector('#file')){
                (document.querySelector("#file")as HTMLInputElement).click() 
            }
        }
    }

    useEffect(() => {
        reader.addEventListener('load', escFunction,false)
        return() => {
            reader.removeEventListener("load", escFunction, false);
        }
    })
    if (error){
        return(
            <div className='upload-container'>
                <input value={fileValue} type='file' id='file' accept=".json" onChange={(e) => handleChange(e)} ref={inputFile} style={{display:'none'}}></input>
                <Button onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload load-icon" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    Upload
                    </Button>
                <Modal show={show} onHide={hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>File Error</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal-body'>
                            <p>The file uploaded does not fit the required format. Please try again</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        )
    } else {
        return(
            <div className='upload-container'>
                <input value={fileValue} type='file' id='file' accept=".json" onChange={(e) => handleChange(e)} ref={inputFile} style={{display:'none'}}></input>
                <Button onClick={handleClick}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-upload load-icon" viewBox="0 0 16 16">
                        <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                        <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    Upload
                </Button>
                <Modal show={show} onHide={hideModal}>
                    <Modal.Header closeButton>
                        <Modal.Title>Confirm Upload</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className='modal-body'>
                            <p>Are you sure you want to DELETE the current channel list and replace it with the channel list on file?</p>
                        </div>
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={hideModal}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSave}>
                        Save Changes
                    </Button>
                    </Modal.Footer>
                </Modal>
            </div>
            )
    }
}

export default Options