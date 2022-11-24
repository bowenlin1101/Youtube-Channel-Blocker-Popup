import {ChangeEventHandler, useState} from 'react'
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'
import 'bootstrap/dist/css/bootstrap.min.css';
import './settings.css'


function Settings(props:{activeTab:string,unlocked:boolean}){
    const [blacklist, setBlackList] = useState(false)
    const [blockShorts, setBlockShorts] = useState(true)
    const [blockSearch, setBlockSearch] = useState(true)
    const [hideChannels, setHideChannels] = useState(true)
    const [autoLock, setAutoLock] = useState(false)
    const [blacklistInfo, setBlacklistInfo] = useState(false)
    const [shortsInfo, setShortsInfo] = useState(false)
    const [searchInfo, setSearchInfo] = useState(false)
    const [channelInfo, setChannelInfo] = useState(false)
    const [autoLockInfo, setAutoLockInfo] = useState(false)

    chrome.storage.sync.get(['blacklisted', 'blockShorts','blockChannels','blockSearch','autoLock'], (result) => {
        setBlackList(result.blacklisted)
        setBlockShorts(result.blockShorts)
        setBlockSearch(result.blockSearch)
        setHideChannels(result.blockChannels)
        setAutoLock(result.autoLock)
    })

    function showBlackListInfo(){
        setBlacklistInfo(true)
    }

    function showShortsInfo(){
        setShortsInfo(true)
    }

    function showSearchInfo(){
        setSearchInfo(true)
    }
    function showChannelInfo(){
        setChannelInfo(true)
    }
    function showAutoLockInfo(){
        setAutoLockInfo(true)
    }

    function hideBlackListInfo(){
        setBlacklistInfo(false)
    }

    function hideShortsInfo(){
        setShortsInfo(false)
    }

    function hideSearchInfo(){
        setSearchInfo(false)
    }
    function hideChannelInfo(){
        setChannelInfo(false)
    }
    function hideAutoLockInfo(){
        setAutoLockInfo(false)
    }

    function handleAutoLock(){
        if (props.unlocked){
            chrome.storage.sync.set({autoLock: !autoLock})
            if (!autoLock){
                var today = new Date()
                today.setMinutes(today.getMinutes() + 5)
                console.log("lockTime set")
                chrome.storage.sync.set({lockTime: today.getTime()})
            } else {
                chrome.storage.sync.set({lockTime: false})
            }
            setAutoLock(!autoLock)
        }
    }

    function handleDropDown(){
        if (props.unlocked){
            chrome.storage.sync.set({blacklisted: !blacklist})
            setBlackList(!blacklist)
        }
    }

    function handleShorts(){
        if (props.unlocked){
            chrome.storage.sync.set({blockShorts: !blockShorts})
            setBlockShorts(!blockShorts)
        }
    }
    
    function handleSearch(){
        if (props.unlocked){
            chrome.storage.sync.set({blockSearch: !blockSearch})
            setBlockSearch(!blockSearch)
        }
    }

    function handleChannels() {
        if (props.unlocked){
            chrome.storage.sync.set({blockChannels: !hideChannels})
            setHideChannels(!hideChannels)
        }
    }

    if (props.activeTab === "settings"){
        return(
            <>
                <BlackWhiteListToggle blacklistInfo={blacklistInfo} showBlacklistInfo={showBlackListInfo} hideBlacklistInfo={hideBlackListInfo} blacklist={blacklist} handleDropDown={handleDropDown}/>
                <BlockRecommended channelInfo={channelInfo} showChannelInfo={showChannelInfo} hideChannelInfo={hideChannelInfo} searchInfo={searchInfo} showSearchInfo={showSearchInfo} hideSearchInfo={hideSearchInfo} shortsInfo={shortsInfo} showShortsInfo={showShortsInfo} hideShortsInfo={hideShortsInfo} disabled={!props.unlocked} blockShorts={blockShorts} blockSearch = {blockSearch} hideChannels={hideChannels} handleShorts={handleShorts} handleSearch={handleSearch} handleChannels={handleChannels}/>
                <AutoLock autoLockInfo={autoLockInfo} showAutoLockInfo={showAutoLockInfo} hideAutoLockInfo={hideAutoLockInfo}  autoLock={autoLock} handleAutoLock={handleAutoLock}/>
            </>

        )
    } else {
        return(null)
    }
}

function BlackWhiteListToggle(props:{blacklistInfo:boolean, showBlacklistInfo:()=>void, hideBlacklistInfo:()=>void,blacklist:boolean, handleDropDown:()=>void}) {
    
        return(
            <div className='dropdown-container'>
                <div>
                    Mode
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showBlacklistInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble mode-info-bubble" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <Modal show={props.blacklistInfo} onHide={props.hideBlacklistInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Mode</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal-body'>
                                Blacklist mode will block all channels on the list
                                <br/>
                                (ie. if MrBeast is on the list with <strong>blacklist</strong> mode, all videos from MrBeast will be blocked)
                                <br></br>
                                <br></br>
                                Whitelist mode will block all channels that are NOT on the list
                                <br/>
                                (ie. if MrBeast is the only channel on the list with <strong>whitelist</strong> mode, the videos from MrBeast will be the only videos not blocked)
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={props.hideBlacklistInfo}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
                <DropdownButton id="dropdown-basic-button" className={props.blacklist ? 'blacklisted' : 'whitelisted'} title={props.blacklist ? "Blacklist" : "Whitelist"}>
                    <div className={'dropdown-item-container'}>
                        <Dropdown.Item className='dropdown-item' onClick={props.handleDropDown}>{props.blacklist ? "Whitelist" : "Blacklist"}</Dropdown.Item>
                    </div>
                </DropdownButton>
            </div>
        ) 
}

function BlockRecommended(props: { channelInfo:boolean, showChannelInfo:()=>void, hideChannelInfo:()=>void, searchInfo:boolean, showSearchInfo:()=>void, hideSearchInfo:()=>void, shortsInfo:boolean, showShortsInfo:()=>void, hideShortsInfo:()=>void, disabled:boolean, blockShorts:boolean, blockSearch:boolean, hideChannels:boolean, handleShorts:ChangeEventHandler, handleSearch:ChangeEventHandler,handleChannels:ChangeEventHandler}){

    return(
        <div className="interface-box">
            <div className='shorts-box'>
                <div className={props.blockShorts ? `shorts-indicator checkbox-width-control active`: `shorts-indicator checkbox-width-control`}>
                    Block Shorts
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showShortsInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble shorts-info-bubble" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <Modal show={props.shortsInfo} onHide={props.hideShortsInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Block Shorts</Modal.Title>
                        </Modal.Header>
                            <div className='modal-body'>
                                <p>{`Currently: ${props.blockShorts ? 'On' : 'Off'}`}</p>
                                <br/>
                                <p>{`Blocks all Youtube shorts from blocked channels`}</p>
                            </div>

                        <Modal.Footer>
                        <Button variant="secondary" onClick={props.hideShortsInfo}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    </div>
                <label className='switch'>
                    <input className='block-checkbox' type="checkbox" checked={props.blockShorts} onChange={props.handleShorts}></input>
                    <span className='slider'></span>
                </label>
            </div>
            <div className='search-box'>
                <div className={props.blockSearch ? `search-indicator checkbox-width-control active` : `search-indicator checkbox-width-control`}>
                    Block Search
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showSearchInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble search-info-bubble" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <Modal show={props.searchInfo} onHide={props.hideSearchInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Block Search</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal-body'>
                                <p>{`Currently: ${props.blockSearch ? 'On' : 'Off'}`}</p>
                                <br/>
                                <p>{`Blocks all Youtube videos from blocked channels in the search page`}</p>
                            </div>
                           
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={props.hideSearchInfo}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    </div>
                <label className='switch'>
                    <input className='block-checkbox' type="checkbox" checked={props.blockSearch} onChange={props.handleSearch}></input>
                    <span className='slider'></span>
                </label>
            </div>
            <div className='channel-box'>
                <div className={props.hideChannels ? `channel-indicator checkbox-width-control active` : `channel-indicator checkbox-width-control`}>
                    Hide Channels
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showChannelInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble channel-info-bubble" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <Modal show={props.channelInfo} onHide={props.hideChannelInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Hide Channels</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className='modal-body'>
                                <div>{`Currently: ${props.hideChannels ? 'On' : 'Off'}`}</div>
                                <br/>
                                <p>{`Hides all blocked channels on from the sidebar, search results, and hides content on the channel page`}</p>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={props.hideChannelInfo}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    </div>
                <label className='switch'>
                    <input className='block-checkbox' type="checkbox" checked={props.hideChannels} onChange={props.handleChannels}></input>
                    <span className='slider'></span>
                </label>
            </div>
        </div>
    )
}

function AutoLock(props:{autoLockInfo:boolean, showAutoLockInfo:()=>void, hideAutoLockInfo:()=>void, autoLock:boolean, handleAutoLock: () => void}) {
    return (
        <div className='autoLock-box'>
                <div className={props.autoLock ? `autoLock-indicator checkbox-width-control active` : `autoLock-indicator checkbox-width-control`}>
                    Auto-Lock
                    <svg xmlns="http://www.w3.org/2000/svg" onClick={props.showAutoLockInfo} width="16" height="16" fill="currentColor" className="bi bi-info-circle info-bubble autoLock-info-bubble" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/>
                        <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z"/>
                    </svg>
                    <Modal show={props.autoLockInfo} onHide={props.hideAutoLockInfo}>
                        <Modal.Header closeButton>
                            <Modal.Title>Auto-Lock</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                        <div className='modal-body'>
                            <p>{`Currently: ${props.autoLock ? 'On' : 'Off'}`}</p>
                            <br/>
                            <p>{`Automatically locks popup after 5 minutes`}</p>
                        </div>
                            
                        </Modal.Body>
                        <Modal.Footer>
                        <Button variant="secondary" onClick={props.hideAutoLockInfo}>
                            Close
                        </Button>
                        </Modal.Footer>
                    </Modal>
                    </div>
                <label className='switch'>
                    <input className='block-checkbox' type="checkbox" checked={props.autoLock} onChange={props.handleAutoLock}></input>
                    <span className='slider'></span>
                </label>
            </div>
    )

}

export default Settings