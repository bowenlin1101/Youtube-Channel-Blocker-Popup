import React, {useState, useReducer, useCallback, useEffect} from 'react';
import './tabfield.css'
import BlockList from '../blocklist/blocklist.js';

function TabField(props){
    const [activeTab, setActiveTab] = useState("blocklist")
    function handleClick(e){
        setActiveTab(e.target.getAttribute("name"))
    }
        return(
            <div className='tabs-wrapper'>
                <TabWrapper activeTab={activeTab} unlocked={props.unlocked} onClick={(e) => handleClick(e)}/>
            </div>
        )
}

function TabWrapper(props){
    return(
        <div className='tab'>
            <div className='tab-navigation'>
                <div className='tab-underline'></div>
                <div className={props.activeTab === "blocklist" ? "active" : ""} id="tab-button" name="blocklist" onClick={(e) => props.onClick(e)}>Block List</div>
                <div className={props.activeTab === "settings" ? "active" : ""} id="tab-button" name="settings" onClick={(e) => props.onClick(e)}>Settings</div>
                <div className={props.activeTab === "additional" ? "active" : ""} id="tab-button" name="additional" onClick={(e) => props.onClick(e)}>Additional</div>
                <div className='tab-underline'></div>
            </div>
            <div className='tab-content'>
                    <BlockList unlocked={props.unlocked} activeTab={props.activeTab}/>
                    <Settings unlocked={props.unlocked} activeTab={props.activeTab}/>
                    <Additional unlocked={props.unlocked} activeTab={props.activeTab}/>
            </div>
        </div>
    )
}

function Settings(props){
    if (props.activeTab === "settings"){
        return(
            <h3>Settings</h3>
        )
    } else {
        return(null)
    }
}

function Additional(props){
    if (props.activeTab === "additional"){
        return(
            <h3>Additional</h3>
        )
    } else {
        return(null)
    }
}

export default TabField