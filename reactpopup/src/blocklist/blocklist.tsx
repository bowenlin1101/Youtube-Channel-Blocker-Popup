/*global chrome*/
import {useState, useReducer, useCallback, useEffect, ChangeEvent} from 'react';
import './blocklist.css'

const BlockList = (props:{unlocked:boolean, activeTab: string}) => {
    const [channelName, setChannelName] = useState("")
    const [blockListId, setChannelIdList] = useReducer((state:[{channelid:string,channelname:string,channelpageurl:string,link:string}], action:any) => {//TODO remove any type 
        var newState;
        switch(action.type){
            case "REMOVE":
                newState = state.filter((channel) => channel.channelname !== action.name)
                chrome.storage.sync.set({blockedchannelids:newState})
                return newState
            case "SET":
                newState = action.name
                return newState
            default:
                return state
        }      
    }, [])
    const [isError, setIsError] = useState(false)

    useEffect(() => {
        chrome.storage.sync.get(['blockedchannelids','blockedchannelnames', 'unlocked'], (result) => {
            if (result.blockedchannelids === undefined){
                chrome.storage.sync.set({blockedchannelids: []})
            }
            chrome.storage.sync.get(['blockedchannelids'], (result2) => {
                setChannelIdList({type: "SET", name: result2.blockedchannelids})
            })

                if (result.blockedchannelnames.length > 0){
                    result.blockedchannelnames.forEach((channelName:string) => {chrome.runtime.sendMessage({channelurl:`https://www.youtube.com/@${channelName.replace(/ /g,'').toLowerCase()}/featured`, query:'contentScript'})
                    chrome.storage.sync.set({blockedchannelnames:[]})
                })
            }
        })
    },[])

    function handleChannelChange(e:ChangeEvent<HTMLInputElement>){
        setChannelName(e.target.value)
        setIsError(false)
    }

    const handleEnter = useCallback(
        () => {
            if (channelName.replace(/ /g,'').length === 24 && channelName.replace(/ /g,'')[0] === 'U' && channelName.replace(/ /g,'')[1] === 'C') {
                if (blockListId.some((id:{channelid:string}) => id.channelid === `https://www.youtube.com/channel/${channelName.replace(/ /g,"")}`)){
                    setIsError(true)
                } else {
                    chrome.runtime.sendMessage({channelurl:`https://www.youtube.com/channel/${channelName}`, query:'contentScript'})
                }
            } else {
                console.log(`https://www.youtube.com/@${channelName.replace(/ /g,"").toLowerCase()}`)
                chrome.runtime.sendMessage({channelurl:`https://www.youtube.com/@${channelName.replace(/ /g,"").toLowerCase()}/featured`, query:'contentScript'})
            }
        setChannelName("")
    }, [channelName,blockListId]
)

    const escFunction = useCallback((event:KeyboardEvent) => {
        if (document.activeElement)
        if (event.key === "Enter" && document.activeElement.getAttribute("class") === "channel-input-box" && props.unlocked){
            handleEnter()
        }
    }, [props, handleEnter])


    const clickEscFunction = useCallback((event:MouseEvent):any => {
        if (event.target){
            if ((event.target as HTMLDivElement).className === "remove-channel-button" && props.unlocked){
                setChannelIdList({type: "REMOVE", name: (event.target as HTMLDivElement).id})
            }
        }
    }, [props])

    useEffect(() => {
        document.addEventListener("click", clickEscFunction, false);
        return() => {
            document.removeEventListener("click", clickEscFunction, false);
        }
    }, [clickEscFunction])

    useEffect(() => {
        document.addEventListener("keydown", escFunction, false);

        return() => {
            document.removeEventListener("keydown", escFunction, false);
        }
    }, [escFunction])

    useEffect(() => {
        chrome.runtime.onMessage.addListener((request,sender,sendResponse) => {
            console.log("HERE")
            if (request.package === "refresh") {
                chrome.storage.sync.get(['blockedchannelids'], (result) => {
                    setChannelIdList({type:"SET",name:result.blockedchannelids})
                })
            } else if (request.package === "error"){
                setIsError(true)
            }
        })
    },[])

    if (props.activeTab === "blocklist"){
        if (!props.unlocked) {
            return(
                <div className="blocklist-wrapper">
                    <BlockTextBox isError={isError} disabled={true} channelName={channelName} onChange={(e:ChangeEvent<HTMLInputElement>) => handleChannelChange(e)}/>
                    <BlockTextDisplay data-disabled={true} blockListId={blockListId}/>
                </div>
            )
        } else {
            return(
                <div className="blocklist-wrapper">
                    <BlockTextBox isError={isError} disabled={false} channelName={channelName} onChange={(e:ChangeEvent<HTMLInputElement>) => handleChannelChange(e)}/>
                    <BlockTextDisplay blockListId={blockListId}/>
                </div>
            )
        }
    } else{
        return(null)
    }
}

function BlockTextBox(props:{isError:boolean,disabled:boolean,channelName:string,onChange:Function}){
    var styles = ""
    if (props.isError){
        styles = " shake"
    }

    if (props.disabled) {
        return(
            <div className='channel-box-wrapper'>
                <input className={`channel-input-box${styles}`} disabled placeholder='Enter a Channel Id...' value={""} onChange={(e) => props.onChange(e)} type="text"></input>
            </div>
        )
    } else {
        return(
            <div className='channel-box-wrapper'>
                <input className={`channel-input-box${styles}`} placeholder='Enter a Channel Id...' value={props.channelName} onChange={(e) => props.onChange(e)} type="text"></input>
            </div>
        )
    }
}

function BlockTextDisplay(props:{blockListId:[{channelid:string,channelname:string,link:string}]}){
    return(
        <div className='list-container'>
            {props.blockListId.map((n,i) => 
                <BlockTextItemId id={i} key={i} channelname={n.channelname} link={`https://${n.link}`}/>
            )}
        </div>
    )
}

function BlockTextItemId(props:{id:number,link:string,channelname:string}){
    return(
        <div className='channel-item' key={props.id}>
            <img alt='' className='channel-id-image' src={props.link}></img>
            <p className='channel-id-text'>{props.channelname}</p>
            <div className='remove-channel-button' data-type="id" id={props.channelname}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className='remove-channel-icon' viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
        </div>
    )
}

export default BlockList