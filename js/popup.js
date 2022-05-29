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
  $("#save-url-img").click(function(){

    chrome.identity.getProfileUserInfo({"accountStatus": "ANY"}, async function(info) {
      chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        let currUrl = tabs[0].url;
        console.log(currUrl)
        let currDomain = getDomain(currUrl)
        console.log(currDomain)

        const res = await fetch("https://source-verse.herokuapp.com/api/domainReviews/newCommunityVote/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": info.email,
            "vote": 1,
            "url": currDomain
          })
        })
        if (!res.ok) {
          console.log(res)
        }
        window.close()
        return;
        
      });
    })
  })
  $("#remove-url-img").click(function() {

    chrome.identity.getProfileUserInfo({"accountStatus": "ANY"}, async function(info) {
      chrome.tabs.query({currentWindow: true, active: true}, async function(tabs){
        let currUrl = tabs[0].url;
        console.log(currUrl)
        let currDomain = getDomain(currUrl)
        console.log(currDomain)

        const res = await fetch("https://source-verse.herokuapp.com/api/domainReviews/newCommunityVote/", {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            "email": info.email,
            "vote": -1,
            "url": currDomain
          })
        })
        if (!res.ok) {
          console.log(res)
        }
        window.close()
        return;

      });
    })
  })
});
