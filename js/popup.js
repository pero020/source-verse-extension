const getDomain = (url) => {
  try {
    url = url.split("//")
    url = url[url.length-1]
    url = url.split("/")[0]
    url = url.split(".")
    url = url[url.length-2] + "." + url[url.length-1]

    if (!url) {
      url="nourl"
    }

    return url
  } catch (e) {
    return url
  }
  
}

$(function() {
  $("#save-url-btn").click(function(){
    chrome.storage.sync.get(["trustworthyList"], function (result) {
      if (!result.trustworthyList) {
        result.trustworthyList = [];
      }
      console.log(result.trustworthyList)
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        let currUrl = tabs[0].url;
        console.log(currUrl)
        let currDomain = getDomain(currUrl)
        console.log(currDomain)
        result.trustworthyList.push(currDomain)
        chrome.storage.sync.set({"trustworthyList": result.trustworthyList})
        return;
      });
    })
  })
  $("#remove-url-btn").click(function() {
    chrome.storage.sync.get(["trustworthyList"], function (result) {
      if (!result.trustworthyList) {
        result.trustworthyList = [];
      }
      console.log(result.trustworthyList)
      chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        let currUrl = tabs[0].url;
        console.log(currUrl)
        let currDomain = getDomain(currUrl)
        console.log(currDomain)
        for(let i = 0; i < result.trustworthyList.length; i++) {
          if (result.trustworthyList[i] = currDomain) {
            result.trustworthyList.splice(i, 1);
          }
        }
        console.log(result.trustworthyList)
        chrome.storage.sync.set({"trustworthyList": result.trustworthyList})
        return;
      });
    })
  })
});
