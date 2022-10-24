import React, {useState, useReducer, useCallback, useEffect} from 'react';
import './blocklist.css'

function BlockList(props){

    const [channelName, setChannelName] = useState("")
    const [blockList, addChannelList] = useReducer(reducer, [])

    function handleChannelChange(e){
        setChannelName(e.target.value)
    }

    function reducer(state, action){        
        var newState = [...state,action.name]
        return newState
    }

    function handleClick(){
        if (channelName.length <31 && channelName.replace(/ /g,"") != "") {
            addChannelList({name: channelName})
        }
        setChannelName("")
    }

    const escFunction = useCallback((event) => {
        if (event.key === "Enter" && document.activeElement.getAttribute("class") === "channel-box" && props.unlocked){
            handleClick()
        }
    }, [channelName,props])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return() => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction])

    if (props.activeTab === "blocklist"){
        if (!props.unlocked) {
            return(
                    <div className="blocklist-wrapper">
                        <BlockTextBox disabled={true} channelName={channelName} onChange={(e) => handleChannelChange(e)}/>
                        <BlockTextDisplay disabled={true} blockList={blockList}/>
                    </div>
            )
        } else {
            return(
                        <div className="blocklist-wrapper">
                            <BlockTextBox channelName={channelName} onChange={(e) => handleChannelChange(e)}/>
                            <BlockTextDisplay blockList={blockList}/>
                        </div>
            )
        }
    } else{
        return(null)
    }
}

function BlockTextBox(props){
    if (props.disabled) {
        return(
            <input className='channel-box' disabled placeholder='Enter a Channel...' value={""} onChange={(e) => props.onChange(e)} type="text"></input>
        )
    } else {
        return(
            <input className='channel-box' placeholder='Enter a Channel...' value={props.channelName} onChange={(e) => props.onChange(e)} type="text"></input>
        )
    }
    
}

function BlockTextDisplay(props){
    return(
        <div className='list-container'>
            {props.blockList.map((n,i) =>
                <BlockTextItem key={i} channelname={n} id={i}/>
            )}
        </div>
    )
}

function BlockTextItem(props){
    console.log(props)
    return(
        <div className='channel-item' key={props.id}>
            <p className='channel-text'>{props.channelname}</p>
            <div className='remove-channel-button'>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" className="bi bi-x" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    )
}

export default BlockList