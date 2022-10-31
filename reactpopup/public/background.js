chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
        if (request.query == "timeup"){
            chrome.runtime.sendMessage({
                package: "lock"
            })
        } else {
            var channelpageurl = 
            fetch(request.channelurl)
            .then(x => {
                if (x.ok){
                    return x.text()
                }
            })    
            .then(y => /"canonicalBaseUrl":"(.*?)"/.exec(y))
            .then(z => z[z.length-1])
            .then(a => {return "https://www.youtube.com"+a});

            var channelid = 
            fetch(request.channelurl)
            .then(x => {
                if (x.ok){
                    return x.text()
                }
            })    
            .then(y => /"canonical" href="(.*?)"><link/.exec(y))
            .then(z => z[z.length-1])
            .then(a => {return a});

            var link = fetch(request.channelurl)
            .then(x=> x.text())
            //TODO
            .then(y=>  /,{"url":"https:\/\/yt3(.*?)"/.exec(y))
            .then(z => z[z.length-1])   
            .then(a => {return `yt3${a}`})

            var channelname = fetch(request.channelurl)
            .then(x=> x.text())
            .then (y=> [/"title":{"accessibility":{"accessibilityData":{"label":"(.*?)ago/g.exec(y),/"accessibilityData":{"label":"(.*?)ago/g.exec(y)])
            .then(b=>{
                if (typeof(b[0]) != "object"){
                    return b[0]
                } else {
                    return b[0]
                }
            })
            .then(b => b[b.length-1])
            .then(c=> c.split(" by "))
            .then(d => d[d.length-1])
            .then(e => e.split(" "))
            .then(f => f.splice(0,f.length-3))
            .then(g => {
                var name = "";
                for (i of g){
                    name += `${i} `;
                }
                return name.replace("Streamed","")
            });
            Promise.all([channelid, channelname,link,channelpageurl]).then((values) => {
                if (request.query == "popup"){
                    chrome.runtime.sendMessage({
                        package: "channelinfo",value: {channelid: values[0],channelname: values[1], link: values[2],channelpageurl:values[3]}
                    });
                } else if (request.query == "contentScript"){
                    chrome.storage.sync.get(['blockedchannelids'], function(result) {
                        if (!result.blockedchannelids.some(object => object.channelid == values[0]) || result.blockedchannelids == []){
                            var tempblockedchannelids = result.blockedchannelids 
                            tempblockedchannelids.push({channelid: values[0], channelname: values[1], link: values[2], channelpageurl:values[3]})
                            chrome.storage.sync.set({blockedchannelids: tempblockedchannelids})
                            chrome.runtime.sendMessage({
                                package: "refresh", value: {channelid: values[0],channelname: values[1], link: values[2],channelpageurl:values[3]}
                            });
                        }
                    })
                }
            })
        }      
    })