chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse){
            var channelpageurl = 
            fetch(request.channelurl)
            .then(x => {
                if (x.ok){
                    return x.text()
                }
            })    
            .then(y => /"canonicalBaseUrl":"(.*?)"/.exec(y))
            .then(z => z[z.length-1])
            .then(a => {return "https://www.youtube.com"+a})
            .catch(() => {
                chrome.runtime.sendMessage({package: "error"});
            })
            

            var channelIdandName = 
            fetch(request.channelurl)
            .then(x => {
                if (x.ok){
                    return x.text()
                }
            })    
            .then(y => /"canonical" href="(.*?)"><link/.exec(y))
            .then(z => z[z.length-1])
            .then(a => {
                var cId = a.split('/')[a.split('/').length-1]
                var cNamePromise = fetch(request.channelurl)
                .then(x => {
                    if (x.ok){
                        return x.text()
                    }
                })
                .then(y => new RegExp(`"channelId":"${cId}","title":"\(\.\*\?\)"`).exec(y))
                .then(z => z[z.length-1])
                return cNamePromise.then((value) => {
                    return([a,value])
                })
            })
            .catch(() => {
                chrome.runtime.sendMessage({package: "error"});
            });

            var link = fetch(request.channelurl)
            .then(x=> x.text())
            //TODO
            .then(y=>  /,{"url":"https:\/\/yt3(.*?)"/.exec(y))
            .then(z => z[z.length-1])   
            .then(a => {return `yt3${a}`})
            .catch(() => {
                chrome.runtime.sendMessage({package: "error"});
            });
            Promise.all([channelIdandName,link,channelpageurl]).then((values) => {
                console.log(values)
                var channelid = values[0][0]
                var channelname = values[0][1]
                var link = values[1]
                var channelpageurl = values[2]
                if (request.query == "popup"){
                    chrome.runtime.sendMessage({
                        package: "channelinfo",value: {channelid: channelid,channelname: channelname, link: link,channelpageurl:channelpageurl}
                    });
                } else if (request.query == "contentScript"){
                    console.log(channelid)
                    console.log(channelname)
                    console.log(link)
                    console.log(channelpageurl)
                    if (channelname && link && channelpageurl)
                    chrome.storage.sync.get(['blockedchannelids'], function(result) {
                        if (!result.blockedchannelids.some(object => object.channelid == channelid) || result.blockedchannelids == []){
                            var tempblockedchannelids = result.blockedchannelids 
                            tempblockedchannelids.push({channelid: channelid, channelname: channelname, link: link, channelpageurl:channelpageurl})
                            chrome.storage.sync.set({blockedchannelids: tempblockedchannelids})
                            chrome.runtime.sendMessage({
                                package: "refresh", value: {channelid: channelid,channelname: channelname, link: link,channelpageurl:channelpageurl}
                            });
                        }
                    })
                }
            })    
    })