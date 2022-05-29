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
  if (data.score === -1) {
    return 1;
  }

  if (data.score === 0) {
    $(link).hover(function() {
      $("body").append(`
      <div style="position: fixed; right: 50px; bottom: 50px" id="rating-div">
        <h4 id="no-reviews-h4">No Specialist Reviews Yet</h4>
        <h4 id="community-approved-h4">Community Approved: ${data.communityVotes.length}</h4>
        </div>
        `)

    }, function() {
      $("#rating-div").remove();
    });

    return 1;
  }

  if (data.score > 4) {
    $(link).css({"color": "#3ebd66"})
  } else if (data.score > 2.5) {
    $(link).css({"color": "orange"})
  } else {
    $(link).css({"color": "#f44336"})
  }
  
  $(link).hover(function() {
    $("body").append(`
      <div style="position: fixed; right: 50px; bottom: 50px" id="rating-div">
      <h4>Score: ${data.score}</h4>
      <h4 id="community-approved-h4">Community Approved: ${data.communityVotes.length}</h4>
      </div>
      
      `)
    data.reviews.forEach((review) => {
      $("#rating-div").append(`<hr><p class='hovered-rating'>${review.description}</p>`)
    });
    }, function() {
      $("#rating-div").remove();
    });
    
}

const setLinks = async () => {

  let found = false

    let dataList = []
    for (const link of linksList) {
      found = false;
      let url = getDomain(link.href);
      if (!url) {
        continue;
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
      renderReview(data, link)
    }

  // })
 
}


let linksList = []
$("a").each( async function() {

linksList.push(this)
  
})
setLinks()
