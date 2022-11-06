import './settings.css'
import {ChangeEventHandler, useState} from 'react'

function Settings(props:{activeTab:string,unlocked:boolean}){
    const [blacklist, setBlackList] = useState(true)
    const [blockShorts, setBlockShorts] = useState(true)
    const [blockSearch, setBlockSearch] = useState(true)
    const [hideChannels, setHideChannels] = useState(true)
    const [autoLock, setAutoLock] = useState(false)
    function handleCheckBox(){
        if (props.unlocked){
            setBlackList(!blacklist)
        }
    }

    function handleShorts(){
        if (props.unlocked){
            setBlockShorts(!blockShorts)
        }
    }
    
    function handleSearch(){
        if (props.unlocked){
            setBlockSearch(!blockSearch)
        }
    }

    function handleChannels() {
        if (props.unlocked){
            setHideChannels(!hideChannels)
        }
    }

    if (props.activeTab === "settings"){
        return(
            <>
                <BlackWhiteListToggle blacklist={blacklist} handleCheckBox={handleCheckBox}/>
                <BlockRecommended disabled={!props.unlocked} blockShorts={blockShorts} blockSearch = {blockSearch} hideChannels={hideChannels} handleShorts={handleShorts} handleSearch={handleSearch} handleChannels={handleChannels}/>
                <AutoLock/>
            </>

        )
    } else {
        return(null)
    }
}

function BlackWhiteListToggle(props:{blacklist:boolean, handleCheckBox:ChangeEventHandler}) {
    if (props.blacklist){
        return(
            <div  className="toggle-box">
                <div className='toggle-width-control'>
                    <p className='blacklist-indicator active'>Blacklisted</p>
                </div>
                <label className='switch'>
                    <input type='checkbox' checked={!props.blacklist} onChange={props.handleCheckBox}/>
                    <span className='slider'></span>
                </label>
                <div className='toggle-width-control'>
                    <p className='whitelist-indicator'>Whitelisted</p>
                </div>
            </div>
        ) 
    } else {
        return(
            <div  className="toggle-box">
            <div className='toggle-width-control'>
                <p className='blacklist-indicator'>Blacklisted</p>
            </div>
            <label className='switch'>
                <input type='checkbox' checked={!props.blacklist} onChange={props.handleCheckBox}/>
                <span className='slider'></span>
            </label>
            <div className='toggle-width-control'>
                <p className='whitelist-indicator active'>Whitelisted</p>
            </div>
        </div>
        ) 
    }

}

function BlockRecommended(props: {disabled:boolean, blockShorts:boolean, blockSearch:boolean, hideChannels:boolean, handleShorts:ChangeEventHandler, handleSearch:ChangeEventHandler,handleChannels:ChangeEventHandler}){

    var shortsClass = ''
    var searchClass = ''
    var channelClass = ''

    if (props.blockShorts) {
        shortsClass = ' active'
    }

    if (props.blockSearch){
        searchClass = ' active'
    }

    if (props.hideChannels){
        channelClass = ' active'
    }
    if (props.disabled){
        return(
            <div className="interface-box">
                <div className='shorts-box'>
                    <p className={`shorts-indicator checkbox-width-control${shortsClass}`}>Block Shorts</p>
                    <input disabled className='block-checkbox' type="checkbox" checked={props.blockShorts} onChange={props.handleShorts}></input>
                </div>
                <div className='search-box'>
                    <p className={`search-indicator checkbox-width-control${searchClass}`}>Block Search</p>
                    <input disabled className='block-checkbox' type="checkbox" checked={props.blockSearch} onChange={props.handleSearch}></input>
                </div>
                <div className='channel-box'>
                    <p className={`channel-indicator checkbox-width-control${channelClass}`}>Hide Channels</p>
                    <input disabled className='block-checkbox' type="checkbox" checked={props.hideChannels} onChange={props.handleChannels}></input>
                </div>
            </div>
        )
    } else {
        return(
            <div className="interface-box">
                <div className='shorts-box'>
                    <p className={`shorts-indicator checkbox-width-control${shortsClass}`}>Block Shorts</p>
                    <input className='block-checkbox' type="checkbox" checked={props.blockShorts} onChange={props.handleShorts}></input>
                </div>
                <div className='search-box'>
                    <p className={`search-indicator checkbox-width-control${searchClass}`}>Block Search</p>
                    <input className='block-checkbox' type="checkbox" checked={props.blockSearch} onChange={props.handleSearch}></input>
                </div>
                <div className='channel-box'>
                    <p className={`channel-indicator checkbox-width-control${channelClass}`}>Hide Channels</p>
                    <input className='block-checkbox' type="checkbox" checked={props.hideChannels} onChange={props.handleChannels}></input>
                </div>
            </div>
        )
    }
}

function AutoLock() {
    return <div></div>

}

export default Settings