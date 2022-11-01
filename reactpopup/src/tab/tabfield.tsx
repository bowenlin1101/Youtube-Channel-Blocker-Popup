import React, {useState, useReducer, useCallback, useEffect} from 'react';
import './tabfield.css'
import BlockList from '../blocklist/blocklist';

function TabField(props:{unlocked:boolean}){
    const [activeTab, setActiveTab] = useState("blocklist")
    function handleClick(e:React.MouseEvent){
        if (e.target){
            setActiveTab(String((e.target as HTMLDivElement).getAttribute("data-name")))
        }
    }
        return(
            <div className='tabs-wrapper'>
                <TabWrapper activeTab={activeTab} unlocked={props.unlocked} onClick={(e:React.MouseEvent) => handleClick(e)}/>
            </div>
        )
}

function TabWrapper(props:{activeTab:string,onClick:Function,unlocked:boolean}){
    return(
        <div className='tab'>
            <div className='tab-navigation'>
                <div className='tab-underline'></div>
                <div className={props.activeTab === "blocklist" ? "active" : ""} id="tab-button" data-name="blocklist" onClick={(e) => props.onClick(e)}>Block List</div>
                <div className={props.activeTab === "settings" ? "active" : ""} id="tab-button" data-name="settings" onClick={(e) => props.onClick(e)}>Settings</div>
                <div className={props.activeTab === "additional" ? "active" : ""} id="tab-button" data-name="additional" onClick={(e) => props.onClick(e)}>Additional</div>
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

function Settings(props:{activeTab:string,unlocked:boolean}){
    if (props.activeTab === "settings"){
        return(
            <h3>Settings</h3>
        )
    } else {
        return(null)
    }
}

function Additional(props:{unlocked:boolean, activeTab:string}){
    if (props.activeTab === "additional"){
        return(
            <h3>Additional</h3>
        )
    } else {
        return(null)
    }
}

export default TabField