var url;
var confirmedName;
var counter = 0;
var checker = "";

// Interval to run through channels
setInterval(function(){
    if (chrome.runtime?.id) {
    } else {
        history.pushState({}, window.title, window.url)
        window.location.replace(window.location)
    }

    chrome.storage.sync.get(['unlocked', 'blacklisted','blockShorts', 'blockSearch', 'blockChannels', 'autoLock', "password",'removeBlockedElements','blockedchannelids'], (syncResult) => {
        chrome.storage.local.get(['unlocked', 'blacklisted','blockShorts', 'blockSearch', 'blockChannels', 'autoLock', "password",'removeBlockedElements','blockedchannelids'], (localResult) => {
            if(syncResult.unlocked === undefined && localResult.unlocked === undefined) {
                chrome.storage.local.set({unlocked: false})
            } else if (syncResult.unlocked !== undefined && localResult.unlocked === undefined) {
                chrome.storage.local.set({unlocked: syncResult.unlocked})
            }
            if(syncResult.blacklisted === undefined && localResult.blacklisted === undefined) {
                chrome.storage.local.set({blacklisted: false})
            } else if (syncResult.blacklisted !== undefined && localResult.blacklisted === undefined) {
                chrome.storage.local.set({blacklisted: syncResult.blacklisted})
            }
            if(syncResult.blockShorts === undefined && localResult.blockShorts === undefined) {
                chrome.storage.local.set({blockShorts: false})
            } else if (syncResult.blockShorts !== undefined && localResult.blockShorts === undefined) {
                chrome.storage.local.set({blockShorts: syncResult.blockShorts})
            }
            if(syncResult.blockSearch === undefined && localResult.blockSearch === undefined) {
                chrome.storage.local.set({blockSearch: false})
            } else if (syncResult.blockSearch !== undefined && localResult.blockSearch === undefined) {
                chrome.storage.local.set({blockSearch: syncResult.blockSearch})
            }
            if(syncResult.blockChannels === undefined && localResult.blockChannels === undefined) {
                chrome.storage.local.set({blockChannels: false})
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
            if(syncResult.blockedchannelids === undefined && localResult.blockedchannelids === undefined) {
                chrome.storage.local.set({blockedchannelids: []})
            } else if (syncResult.blockedchannelids !== undefined && localResult.blockedchannelids === undefined) {
                alert("Bug Fixed: You can now add more than 28 channels!")
                chrome.storage.local.set({blockedchannelids: syncResult.blockedchannelids})
            }
        })
    })
    // get the current url location
    url = window.location.href;
    chrome.storage.local.get(['blacklisted','blockShorts','blockSearch','blockChannels','blockedchannelids','unlocked','removeBlockedElements'], function(result) {
        //initialize processed list for easy comparison
        var processedChannelList = [];

        var processedChannelIds = [];
        if (result.blockedchannelids != undefined && result.blockedchannelids != []){
            result.blockedchannelids.forEach(object => {
                processedChannelList.push(object.channelname.toLowerCase().replace(/ /g,''))
                processedChannelIds.push(object.channelid.toLowerCase().replace(/ /g,''));
                if (object.channelid.toLowerCase().replace(/ /g,'') != object.channelpageurl.toLowerCase().replace(/ /g,'')){
                    processedChannelIds.push(object.channelpageurl.toLowerCase().replace(/ /g,''));
                }
            });
        }
            //check if a video is being watched
        if (url.includes("/watch?v=")){
            var currentChannelName = ""
            var channelids = []
            //make sure the page is loaded by checking the video's src
            var loaded = false;
            var possibleVideoScreens = document.getElementsByTagName("video")
            for (video of possibleVideoScreens){
                if (video.src != ""){
                    loaded = true;
                }
            }

            if (loaded){
                // gets the channel name from the video screen and processes it
                for (i of document.querySelectorAll("#channel-name")){
                    if (i.parentElement.parentElement.tagName == "YTD-VIDEO-OWNER-RENDERER"){
                        var channelElement = i.querySelector('a')
                        currentChannelName = channelElement.innerHTML.toLowerCase().replace(/ /g,"")
                        console.log(currentChannelName)
                        channelids.push(channelElement.href)
                    }
                }
                //this is all an effort to reduce misfires - the channel name needs to appear 5 times in a row before name is set to checker
                if (currentChannelName != "" && currentChannelName != undefined && checker == currentChannelName){
                    counter++
                } else {
                    counter = 0;
                    confirmedName = undefined;
                    if (currentChannelName != "" && currentChannelName != undefined){
                        checker = currentChannelName
                    }
                }
                if (confirmedName != checker && counter >=3){    
                        confirmedName = checker
                        counter = 0;
                } 
                //after name is initialized we can see if the name is in the list
                if (confirmedName){
                    var possiblepausebuttons = document.querySelectorAll(".ytp-play-button")
                    function pause(){
                        for (buttons of possiblepausebuttons){
                            if (buttons.title.includes("Pause")){
                                buttons.click()
                            }
                        }
                    }
                    if (result.blacklisted){  
                        if (processedChannelList.includes(confirmedName)|| processedChannelIds.includes(channelids[channelids.length-1].toLowerCase().replace(/ /g,""))){
                            pause()
                            window.location.replace("https://www.youtube.com");
                            alert("this channel is blacklisted")
                        }
                    //if whitelisted is selected
                    } else {
                        if (!processedChannelList.includes(confirmedName) && !processedChannelIds.includes(channelids[channelids.length-1].toLowerCase().replace(/ /g,""))){
                            pause()
                            window.location.replace("https://www.youtube.com");
                            alert("this channel is not whitelisted")
                        }
                    } 
                }
                
                //blocks the Youtube videos on the sidebar
                if (result.blockedchannelids != undefined){
                    for (id of result.blockedchannelids){
                        processedChannelList.push(id.channelname.toLowerCase().replace(/ /g,''))
                    }
                }
                for (i of document.querySelectorAll("#text")) {
                    if(i.classList.contains("ytd-channel-name") ){
                        var parent = i.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode.parentNode
                        if (parent.tagName == "YTD-COMPACT-VIDEO-RENDERER" && parent.display != "none"){
                            if (result.blacklisted){
                                if (processedChannelList.includes(i.innerHTML.toLowerCase().replace(/ /g,''))){
                                    parent.style.display="none"
                                }
                            // if it is whitelisted, remove items not in the list
                            } else {
                                if (!processedChannelList.includes(i.innerHTML.toLowerCase().replace(/ /g,''))){
                                    parent.style.display="none"
                                }
                            }
                        }
                    }
                }
                //blocks the Youtube videos on the endscreen
                if (document.getElementsByClassName("ytp-endscreen-content")[0]){
                    if (document.getElementsByClassName("ytp-endscreen-content")[0].childNodes != []){
                        for (i of document.getElementsByClassName("ytp-endscreen-content")[0].childNodes){
                            var processedString = i.childNodes[1].childNodes[0].childNodes[0].childNodes[1].innerHTML.split("•")[0].toLowerCase().replace(/ /g, "")
                            if (result.blacklisted){
                                if (processedChannelList.includes(processedString)){
                                    i.remove()
                                }
                            } else {
                                if (!processedChannelList.includes(processedString)){
                                    i.remove()
                                }
                            }
                        }
                    }
                }
                //blocks the Autoplay Youtube video
                if (document.getElementsByClassName("ytp-autonav-endscreen-upnext-no-alternative-header")[0].style.display == ""){
                    if (result.blacklisted){                      
                        if (processedChannelList.includes(document.querySelector(".ytp-autonav-endscreen-upnext-author").innerText.toLowerCase().replace(/ /g,""))){
                            // TODO Have to check when it is actually displayed to signal a press
                            document.querySelector(".ytp-autonav-endscreen-upnext-cancel-button").click()
                            document.getElementsByClassName("ytp-autonav-endscreen-upnext-no-alternative-header")[0].style.display = "none"
                        } 
                    } else {
                        if (document.querySelector(".ytp-autonav-endscreen-upnext-author").innerHTML != ""){
                            if (!processedChannelList.includes(document.querySelector(".ytp-autonav-endscreen-upnext-author").innerText.toLowerCase().replace(/ /g,""))){
                                document.querySelector(".ytp-autonav-endscreen-upnext-cancel-button").click()
                                document.getElementsByClassName("ytp-autonav-endscreen-upnext-no-alternative-header")[0].style.display = "none"
                            } 
                        }
                    }   
                }  
            }
        // if the person is not actively watching a video
        } else if (url.includes("www.youtube.com/shorts/")){
            if (result.blockShorts){
                function blockShorts(playercontainer){
                    playercontainer.parentNode.remove()
                }
                for (i of document.querySelectorAll("#channel-name")){
                    var anchor = i.querySelectorAll("a")[0]
                    if (anchor){
                        if (anchor.closest("ytd-reel-video-renderer")){
                            var anchorName = anchor.innerHTML.toLowerCase().replace(/ /g,"")
                            var anchorid = anchor.href.toLowerCase().replace(/ /g, "")
                            var playercontainer = anchor.closest("ytd-reel-video-renderer").querySelector("#player-container")
                            console.log(anchorName)
                            if (result.blacklisted){
                                if (processedChannelList.includes(anchorName) || processedChannelIds.includes(anchorid)){
                                    blockShorts(playercontainer)
                                }
                            } else {
                                if (!processedChannelList.includes(anchorName) && !processedChannelIds.includes(anchorid)) {
                                    blockShorts(playercontainer)
                                }
                            }
                        }
                    }
                }
            }
            //Search queries
        } else if (url.includes("www.youtube.com/results?search_query")){
            if (result.blockShorts){
                var shortsContainer = document.querySelector("ytd-reel-shelf-renderer");
                if (shortsContainer){
                    shortsContainer.remove()
                }
            }

            if (result.blockSearch){     
               for (i of document.getElementsByTagName("YTD-VIDEO-RENDERER")) {
                    //put channel data a ytd renderers        
                    if (i.querySelector("#channel-name")&& i.getAttribute("data-sorted") == undefined){
                        var anchor = i.querySelector("#channel-name").querySelector("a")
                        var channelname = anchor.innerHTML
                        var channelid = anchor.href.split(".com")[1]
                        i.setAttribute("data-channelname", channelname)
                        i.setAttribute("data-channelid", channelid)
                    }
                }
                //block videos

                function blockVideosText(i){
                    for (j of i.querySelectorAll("a")){
                        j.remove()
                    }
                    //TODO Center the text
                    var blockedSign = document.createElement("h3");
                    blockedSign.innerHTML = "BLOCKED";
                    blockedSign.style.color = "	#C0C0C0";
                    blockedSign.style.fontSize = "3em";
                    blockedSign.style.verticalAlign = "middle";
                    blockedSign.style.lineHeight = i.querySelector("ytd-thumbnail").height;
                    blockedSign.style.textAlign = "center";
                    blockedSign.style.maxHeight = "240px"

                    i.querySelector("ytd-thumbnail").appendChild(blockedSign)
                    i.querySelector(".text-wrapper").remove()
                    i.setAttribute("data-sorted", "true")

                }
                function blockVideosDelete(i){
                    i.style.display = 'none';
                }

                for (i of document.getElementsByTagName("YTD-VIDEO-RENDERER")){
                    if (!result.removeBlockedElements){
                        if (i.getAttribute("data-sorted") == undefined){
                            if (result.blacklisted){
                                if (processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,"")) || processedChannelIds.some(id => id.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,"")))){
                                    blockVideosText(i)
                                    
                                }
                            } else {
                                if (!processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,"")) && !processedChannelIds.some(id => id.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,"")))){
                                    blockVideosText(i)
                                    
                                }
                            }
                        }
                    } else {
                        if (result.blacklisted){
                            if (processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,"")) || processedChannelIds.some(id => id.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,"")))){
                                blockVideosDelete(i);

                            }
                        } else {
                            if (!processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,"")) && !processedChannelIds.some(id => id.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,"")))){
                                blockVideosDelete(i)
                            }
                        }
                    }
                }
            }

            if (result.blockChannels){
                var channelElement = document.querySelectorAll("ytd-channel-renderer")
                for (var i = 0; i < channelElement.length; i++){
                    var channelAnchor = channelElement[i].querySelector("a#main-link")
                    var channelName = channelAnchor.querySelector("yt-formatted-string#text").innerHTML
                    if (result.blacklisted){
                        if (processedChannelList.includes(channelName.toLowerCase().replace(/ /g, ""))){
                            channelElement[i].remove()
                        }
                    } else {
                        if (!processedChannelList.includes(channelName.toLowerCase().replace(/ /g, ""))){
                            channelElement[i].remove()
                        }
                    }
                }
            }
            //Youtube Channel Pages
        } else {
            if (url.includes("www.youtube.com/c/") || url.includes("youtube.com/channel/")|| url.includes("youtube.com/user") || url.includes("youtube.com/@")){
                var header = document.querySelector("#inner-header-container")
                var channelNameContainer = document.querySelector("#channel-header-container");
                var channelName;
                if (channelNameContainer){
                    channelName = channelNameContainer.querySelector("#channel-name").querySelector("yt-formatted-string#text").innerText.replace(/ /g,"").toLowerCase()
                }
                console.log(channelName)
                if (document.querySelector("#addChannel") == null){
                    var buttonContainer = document.createElement("div")
                    buttonContainer.style.width = "20em"
                    buttonContainer.style.height = "3em"
                    buttonContainer.style.margin = "0 10px 0 100px"
                    var button = document.createElement("tp-yt-paper-button")
                    button.style.display="inline-block"
                    button.classList.add("style-scope")
                    button.classList.add("ytd-button-renderer")
                    button.style.backgroundColor = "#27283c"
                    button.style.color = "white"
                    button.innerHTML = "Add Channel to Block List"
                    button.setAttribute("id", "addChannel")
                    buttonContainer.appendChild(button)
                    if (header){
                        header.appendChild(buttonContainer)
                    }
                }
                var identifier = url.split("/")[url.split('/').length-1]
                if (identifier != "streams" && identifier != "videos" && identifier != "playlists" && identifier != "community" && identifier != "store" && identifier != "channels" && identifier != "channels" && identifier != "about") {
                    document.querySelector("#addChannel").style.display = "inline-block";
                } else {
                    document.querySelector("#addChannel").style.display = "none";
                }

                if (result.blockedchannelids != undefined){
                    var channelAdded = false;
                    for (i of result.blockedchannelids){
                         if ( //url.toLowerCase().includes(i.channelpageurl.toLowerCase()) || url.toLowerCase().includes(i.channelid.toLowerCase()) ||
                            processedChannelList.includes(channelName)){
                            channelAdded = true;
                        } 
                    }
                    if (!result.unlocked && header.querySelector("#addChannel").getAttribute("disabled") == null){
                        header.querySelector("#addChannel").setAttribute("disabled","")
                        header.querySelector("#addChannel").parentNode.style.cursor = "not-allowed";
                        header.querySelector("#addChannel").parentNode.title = "Authenticate on Popup"
                    } else if (result.unlocked && header.querySelector("#addChannel").getAttribute("disabled") == ""){
                        header.querySelector("#addChannel").removeAttribute("disabled")
                        header.querySelector("#addChannel").parentNode.style.cursor = "hand";
                        header.querySelector("#addChannel").title = ""
                    }

                    if (channelAdded){
                        if (header.querySelector("#addChannel").innerHTML != "Added to List"){
                            header.querySelector("#addChannel").innerHTML = "Added to List"
                        }
                    } else {
                        if (header.querySelector("#addChannel").innerHTML != "Add Channel to Block List"){
                            header.querySelector("#addChannel").innerHTML = "Add Channel to Block List"
                        }
                    }
                }

                if (result.blockChannels){
                    var shelves = document.querySelectorAll("ytd-shelf-renderer")
                    var sectionRenderers = document.querySelectorAll("ytd-item-section-renderer")
                    var richGridRenderers = document.querySelectorAll("ytd-rich-grid-renderer")
                    var pauseButton = document.querySelector("#primary") ? document.querySelector("#primary").querySelector(".ytp-play-button") : undefined
                    if (result.blacklisted){
                        if (processedChannelList.includes(channelName)){
                            
                            for (i of shelves){
                                i.style.display = 'none'
                            }

                            for (i of sectionRenderers){
                                i.style.display = 'none'
                            }

                            for (i of richGridRenderers){
                                i.style.display = 'none'
                            }
                            if (pauseButton)
                            if (pauseButton.getAttribute("title").includes("Pause")){
                                pauseButton.click()
                            }
                        } else {
                            for (i of shelves){
                                i.style.display = 'block'
                            }

                            for (i of sectionRenderers){
                                i.style.display = 'block'
                            }

                            for (i of richGridRenderers){
                                i.style.display = 'block'
                            }
                        }
                    } else {
                        if (!processedChannelList.includes(channelName)){
                            
                            for (i of shelves){
                                i.style.display = 'none'
                            }

                            for (i of sectionRenderers){
                                i.style.display = 'none'
                            }

                            for (i of richGridRenderers){
                                i.style.display = 'none'
                            }
                            if (pauseButton)
                            if (pauseButton.getAttribute("title").includes("Pause")){
                                pauseButton.click()
                            }
                        } else {
                            for (i of shelves){
                                i.style.display = 'block'
                            }

                            for (i of sectionRenderers){
                                i.style.display = 'block'
                            }

                            for (i of richGridRenderers){
                                i.style.display = 'block'
                            }
                        }
                    }
                }
                //Feed and Gaming pages
            } else if ((url.includes("youtube.com/feed") || url.includes("youtube.com/gaming")) && !url.includes("youtube.com/feed/history") && !url.includes("youtube.com/feed/library")&& !url.includes("youtube.com/feed/subscriptions")){
                var shelves = document.querySelectorAll("ytd-shelf-renderer")
                var sectionRenderers = document.querySelectorAll("ytd-item-section-renderer")
                var richGridRenderers = document.querySelectorAll("ytd-rich-grid-renderer")
                var pauseButton = document.querySelector("#primary") ? document.querySelector("#primary").querySelector(".ytp-play-button") : undefined
                    
                for (i of shelves){
                    i.style.display = 'none'
                }

                for (i of sectionRenderers){
                    i.style.display = 'none'
                }

                for (i of richGridRenderers){
                    i.style.display = 'none'
                }
                if (pauseButton)
                if (pauseButton.getAttribute("title").includes("Pause")){
                    pauseButton.click()
                }
                //Youtube Home page
            } else {
                //put the channel name and id of individual videos recommended on the Youtube home screen where it is easily accessible - up to the parent element
                for (i of document.querySelectorAll("#avatar-link")){
                    if (i.getAttribute("data-channelname") == undefined){
                        var channelname = i.title.toLowerCase().replace(/ /g,'')
                        i.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute("data-channelname", channelname)
                    }
                    if (i.getAttribute("data-channelid") == undefined){
                        var channelid = i.href;
                        i.parentNode.parentNode.parentNode.parentNode.parentNode.setAttribute("data-channelid", channelid)
                    }
                }
                
                //loop through the recommended videos on the home screen, get the elements that match names in the processed list and remove
                for (i of document.getElementsByTagName("ytd-rich-item-renderer")){
                    function hideVideoElements(){
                        //clone to remove hover event listeners that will prompt the auto-play feature
                        if (i.querySelector("#thumbnail")){
                            i.querySelector("#thumbnail").remove()
                        }
                        var videorenderer = i.querySelector("#dismissible").childNodes[0]
                        if (videorenderer.getAttribute('data-isClone') == undefined){
                            var clone = videorenderer.cloneNode(true)
                            clone.setAttribute("data-isClone",true)
                            videorenderer.parentNode.replaceChild(clone,videorenderer)
                            var parent = clone.parentElement.parentElement.parentElement.parentElement
                            //TODO fix the parent bug
                            if (parent.querySelector("#details") && parent.querySelector("#menu") && parent.querySelector("#meta")){
                                for (i of parent.querySelector("#details").getElementsByTagName("A")){
                                    i.style.display = 'none'
                                    // i.remove()
                                }
                                for (i of parent.querySelector("#menu").getElementsByTagName("A")){
                                    i.style.display = 'none'

                                    // i.remove()
                                }
                                for (i of parent.querySelector("#meta").getElementsByTagName("A")){
                                    i.style.display = 'none'
                                    // i.remove()
                                }
                                parent.querySelector("#details").style.display = 'none';
                            }
                            i.setAttribute("data-processed", true)
                            i.setAttribute("data-sort-type", result.blacklisted)
                        }
                    }

                    if (i.getAttribute("data-processed") == false || i.getAttribute("data-processed") == undefined || i.getAttribute("data-sort-type" != result.blacklisted)){
                        if (i.getAttribute("data-channelname")){
                            if (result.blacklisted){
                                if (processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,'')) || processedChannelIds.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,''))){
                                    if (result.removeBlockedElements){
                                        i.style.display = "none";
                                    } else {
                                        hideVideoElements()
                                    }
                                }
                            } else {
                                if (!processedChannelList.includes(i.getAttribute("data-channelname").toLowerCase().replace(/ /g,'')) && !processedChannelIds.includes(i.getAttribute("data-channelid").toLowerCase().replace(/ /g,''))){
                                    if (result.removeBlockedElements){
                                        i.style.display = "none";
                                    } else {
                                        hideVideoElements()
                                    }
                                }
                            }   
                        }
                    }
                }
            }
            // remove shorts sliders and side bar buttons
            if (result.blockShorts){
                if (document.querySelectorAll("ytd-rich-shelf-renderer[is-shorts]")[0])
                    document.querySelectorAll("ytd-rich-shelf-renderer[is-shorts]")[0].style.display = 'none';
                if (document.querySelectorAll("ytd-guide-section-renderer")){
                    var topSidebar = document.querySelectorAll("ytd-guide-section-renderer")[0]
                    if (topSidebar)
                    topSidebar.querySelector("#items").childNodes[1].style.display = 'none'
                }
                var shortsIcon = document.querySelector("ytd-mini-guide-entry-renderer[aria-label=Shorts]")
                if (shortsIcon)
                shortsIcon.remove()
            }
            // remove Explore section from sidebar
            if (document.querySelectorAll("ytd-guide-section-renderer")[2])
            document.querySelectorAll("ytd-guide-section-renderer")[2].style.display = "none";
                // check whether the player queue is open
            if (document.querySelector("ytd-miniplayer")){
                if (document.querySelector("ytd-miniplayer").querySelector("video")){
                    if (document.getElementById("info-bar").querySelector("yt-formatted-string#owner-name")) {
                        //make sure the video is playing by checking the video's src
                        if (document.querySelector("ytd-miniplayer").querySelector("video").src != ""){
                            // retrieve the ariaLabel to get the channel name and process it
                            var channelName = document.getElementById("info-bar").querySelector("yt-formatted-string#owner-name").innerHTML.replace(/ /g,"").toLowerCase()
                            // loop through strings in the refined list 
                            // process the channelname
                            function closeQueue(){
                                document.querySelector(".ytp-miniplayer-close-button").click()
                                document.querySelector("#confirm-button").click()
                                window.location.replace("https://www.youtube.com");
                            }
                            if (result.blacklisted){  
                                //check if the channel is in the list
                                if (processedChannelList.includes(channelName) && channelName != ""){
                                    closeQueue()
                                    alert("this channel is blacklisted")
                                }
                            // if whitelisted is selected
                            } else {    
                                if (!processedChannelList.includes(channelName) && channelName != ""){
                                    closeQueue()
                                    alert("this channel is not whitelisted")
                                }
                            }    
                        }
                    } 
                }
            }
        }
        //Hide blocked channels on side bar
        if (document.querySelectorAll("ytd-guide-section-renderer")) {
            if (document.querySelectorAll("ytd-guide-section-renderer")[1]){
                if (result.blockChannels){
                    var subscriptions = document.querySelectorAll("ytd-guide-section-renderer")[1]
                    var subscriptionBoxes = Array.from(subscriptions.querySelector("#items").querySelectorAll("ytd-guide-entry-renderer")).map((element) => element.querySelector("a[href]"))
                    var subscriptionList = subscriptionBoxes.filter((x) => {return x != null})
                    var subscriptionTitles = Array.from(subscriptionList.map((x) => x.querySelector("yt-formatted-string")))
                    for (var i = 0; i < subscriptionList.length; i++) {
                        if (result.blacklisted){
                            if (processedChannelIds.includes(`https://www.youtube.com${subscriptionList[i].getAttribute('href')}`.replace(/ /g,"").toLowerCase()) || processedChannelList.includes(subscriptionTitles[i].innerHTML.replace(/ /g,"").toLowerCase())){
                                subscriptionList[i].parentElement.style.display = "none"
                            } else {
                                subscriptionList[i].parentElement.style.display = "block"
                            }
                        } else {
                            if (!processedChannelIds.includes(`https://www.youtube.com${subscriptionList[i].getAttribute('href')}`.replace(/ /g,"").toLowerCase())&& !processedChannelList.includes(subscriptionTitles[i].innerHTML.replace(/ /g,"").toLowerCase())){
                                subscriptionList[i].parentElement.style.display = "none"
                            } else {
                                subscriptionList[i].parentElement.style.display = "block"
                            }
                        }
                    }

                } else {
                    var subscriptions = document.querySelectorAll("ytd-guide-section-renderer")[1]
                    var subscriptionBoxes = Array.from(subscriptions.querySelector("#items").querySelectorAll("ytd-guide-entry-renderer")).map((element) => element.querySelector("a[href]"))
                    var subscriptionList = subscriptionBoxes.filter((x) => {return x != null})
                    for (var i = 0; i < subscriptionList.length; i++){
                        subscriptionList[i].parentElement.style.display = "block"
                    }
                }
            }
        }
    })
    //If popup is not open but Youtube tab is, lock when locktime is up
    chrome.storage.local.get(["lockTime"], (result) => {
        if (result.lockTime){
            if (result.lockTime < new Date().getTime()){
                console.log("time up")
                chrome.storage.local.set({lockTime: false})
                chrome.storage.local.set({unlocked: false})
                chrome.runtime.sendMessage({query: "timeup"})
            }
        }
    })
}, 250)

const addChannelListener = document.addEventListener("click", (e) => {
    if (e.target.tagName = "BUTTON"){
        chrome.storage.local.get(["unlocked",'blockedchannelids'], (result) => {
            if (e.target.id == "addChannel" && result.unlocked){
                chrome.runtime.sendMessage({query:"contentScript", channelurl: url})
            }
        })
    }
})