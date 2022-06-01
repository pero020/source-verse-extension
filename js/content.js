checkmarkSvg = '<svg id="checkmark-svg" xmlns="http://www.w3.org/2000/svg" width="448" height="512"><rect id="backgroundrect" width="100%" height="100%" x="0" y="0" fill="none" stroke="none"/><!--! Font Awesome Pro 6.1.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2022 Fonticons, Inc. --><g class="currentLayer" style=""><title>Layer 1</title><path d="M438.6,105.4C451.1,117.9 451.1,138.1 438.6,150.6L182.6,406.6C170.1,419.1 149.9,419.1 137.4,406.6L9.372,278.6C-3.124,266.1 -3.124,245.9 9.372,233.4C21.87,220.9 42.13,220.9 54.63,233.4L159.1,338.7L393.4,105.4C405.9,92.88 426.1,92.88 438.6,105.4L438.6,105.4z" id="svg_1" class="" fill="#50eb82" fill-opacity="1"/></g></svg>'

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
      <h2 id="domain-h2">Domain review:</h2>
      <div>
        <p class='hovered-rating'>No Specialist Score yet</p>
      </div>
      <div>
        <h4 id="community-approved-h4">Community Approved by:</h4> <h4 id="community-score-h4">${data.communityVotes.length}</h4> <h4 id="community-approved-h4"> ${data.communityVotes.length === 1 ? "user": "users"}</h4>
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
      <div style="position: fixed; ${$(link).offset().left < 1256 ? "right" : "left"}: 50px; bottom: 50px" id="rating-div">
        <h2 id="domain-h2">Domain review:</h2>
        <hr/>
        <div>
          <h4 id="specialists-score">Specialist's score:</h4> <h4 id="score-h4">${data.score} </h4><h4 id="out-of-five-h4"> / 5</h4>
        </div>
        <div>
          <h4 id="community-approved-h4">Community Approved by:</h4> <h4 id="community-score-h4">${data.communityVotes.length}</h4> <h4 id="community-approved-h4"> ${data.communityVotes.length === 1 ? "user": "users"}</h4>
        </div>
      </div>
      
      `)

    if (data.score > 4) {
      $("#score-h4").css({"color": "#50eb82"})
    } else if (data.score > 2.5) {
      $("#score-h4").css({"color": "orange"})
    } else {
      $("#score-h4").css({"color": "#f44336"})
    }

    if (data.communityVotes.length > 100) {
      $("#community-score-h4").css({"color": "#50eb82"})
    } else if (data.communityVotes.length > 20) {
      $("#community-score-h4").css({"color": "orange"})
    } else {
      $("#community-score-h4").css({"color": "#f44336"})
    }
    
    if (data.reviews.length != 0) {
      $("#rating-div").append(`<p class='hovered-rating'><strong>Recent reviews:</strong></p><hr>`)
    }
    count = 0;
    for (const review of data.reviews) {
      if (count>2) break;
      $("#rating-div").append(`<p class='hovered-rating'>${review.description}</p><hr>`)
      count++
    }
    }, function() {
      $("#rating-div").remove();
    });

    
}

const setLinks = async () => {

  blackList = ["google.com", "google.hr"]

  let found = false
  let currDomain = getDomain(window.location.href);

    let dataList = []
    for (const link of linksList) {
      found = false;
      let url = getDomain(link.href);
      if (!url || url == currDomain) {
        continue;
      }

      if (blackList.includes(url)) {
        dataList.push(
          {
            "url": url,
            "score": -1
          }
        )
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
