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

const renderReview = (data, link) => {
  if (data === "trustworthy") {
    console.log("rendering trustworthy")
    $(link).css({"color": "#50eb82"})
    return 1;
  }

  if (data.score === -1) {
    return 1;
  }

  if (data.score > 4) {
    $(link).css({"color": "#50eb82"})
  } else if (data.score > 3) {
    $(link).css({"color": "orange"})
  } else {
    console.log("rendering red")
    $(link).css({"color": "#f44336"})
  }
  $(link).hover(function() {
    $(link).append(`
      <div id="rating-div"><h4>Score: ${data.score}</h4></div>`)
    data.reviews.forEach((review) => {
      $("#rating-div").append(`<p class='hovered-rating'>${review.description}</p>`)
    });
    }, function() {
      $("#rating-div").remove();
    });
    
}

const setLinks = () => {
  let trustworthyList
  let found = false
  chrome.storage.sync.get(["trustworthyList"], async function (result) {
    trustworthyList = result.trustworthyList

    let dataList = []
    for (const link of linksList) {
      found = false;
      let url = getDomain(link.href);
      if (!url) {
        continue;
      }
      if (trustworthyList) {
        for (const domain of trustworthyList) {
          if (domain === url) {
            renderReview("trustworthy", link)
            found = true;
            break;
          }
        }
        if (found) {
          continue;
        }
      }
      

      for (const data of dataList) {
        if (data.url === url) {
          renderReview(data, link)
          found = true;
          break;
        }
      }
      if (found) {
        continue;
      }

      const res = await fetch("https://source-verse.herokuapp.com/api/domainReviews/getDomainData/" + url)
      if (res.status === 404) {
        dataList.push(
          {
            "url": url,
            "score": -1
          }
        )
        continue;
      }
      const data = await res.json();
      dataList.push(data)
      console.log(data + "123")
      renderReview(data, link)
    }

  })
 
}


let linksList = []
$("a").each( async function() {

linksList.push(this)
  
})
setLinks()
