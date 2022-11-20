import {useState} from "react";
import Button from 'react-bootstrap/Button'
import './additional.css'

function Additional(props:{unlocked:boolean, activeTab:string}){

    if (props.activeTab === "additional"){
        return(
            <div className="import-export-container">
                <ExportList/>
                <ImportList/>
            </div>    
        )
    } else {
        return(null)
    }
}

function ExportList(){

    const [data,setData] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    function handleExport(){
        setIsLoading(true);
        (document.querySelector('.export-link') as HTMLAnchorElement).click()
    }

    function updateData(){
        chrome.storage.sync.get('blockedchannelids', (result) => {
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