// Global variables because I don't understand how to handle this without making everything a nested hellscape

let date
let aliaRequest
let credits
let releaseIndex
let movieRequest
let movieCredits
let movieVideo

// Just a little CSS-related function

window.onresize = () => {
  location.reload()
}

// Initial http request

;
(() => {
  aliaRequest = new XMLHttpRequest()
  aliaRequest.open('GET', 'https://api.themoviedb.org/3/person/1108120/movie_credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
  aliaRequest.send()
  aliaRequest.onreadystatechange = getReleaseDate
})()

// App functionality

function getReleaseDate () {
  if (aliaRequest.readyState === XMLHttpRequest.DONE) {
    getDate()
    credits = JSON.parse(aliaRequest.response)
    let releaseDate = []
    for (let i = 0; i < credits.cast.length; i++) {
      releaseDate[i] = credits.cast[i].release_date
    }
    releaseDate = releaseDate.filter(function (i) {
      return !(i === '')
    })
    releaseDate = releaseDate.sort()
    let release = releaseDate.find(nextReleaseDate)
    releaseIndex = releaseDate.findIndex(nextReleaseDate) + 1
    if (date < release) {
      console.log("Alia's next movie is on " + release + '!')
      console.log(credits)
      movieAjaxCall()
    }
  }
}

function getDate () {
  let getDate = new Date()
  let year = getDate.getFullYear()
  let month = 1 + getDate.getMonth()
  let monthDate = getDate.getDate()
  month = ('0' + month).slice(-2)
  monthDate = ('0' + monthDate).slice(-2)
  date = (year + '-' + month + '-' + monthDate)
}

function nextReleaseDate (element) {
  return element > date
}

function movieAjaxCall () {
  console.log(credits.cast[releaseIndex].id)
  const movieID = credits.cast[2].id
  movieRequest = new XMLHttpRequest()
  movieRequest.open('GET', ('https://api.themoviedb.org/3/movie/' + movieID + '?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US'))
  movieRequest.send()
  movieRequest.onreadystatechange = getMovieInfo

  movieCredits = new XMLHttpRequest()
  movieCredits.open('GET', ('https://api.themoviedb.org/3/movie/' + movieID + '/credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US'))
  movieCredits.send()
  movieCredits.onreadystatechange = getMovieCredits

  movieVideo = new XMLHttpRequest()
  movieVideo.open('GET', ('https://api.themoviedb.org/3/movie/' + movieID + '/videos?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US'))
  movieVideo.send()
  movieVideo.onreadystatechange = getMovieVideo
}

function getMovieInfo () {
  if (movieRequest.readyState === XMLHttpRequest.DONE) {
    let movieInfo = JSON.parse(movieRequest.response)
    console.log(movieInfo)
    document.body.style.backgroundImage = 'url(https://image.tmdb.org/t/p/w533_and_h300_bestv2' + movieInfo.backdrop_path + ')'
    document.querySelectorAll('[data-title]').forEach(function (i) {
      i.textContent = movieInfo.title
    })
    document.querySelector('[data-description]').textContent = movieInfo.overview
    document.querySelector('[data-link]').innerHTML = '<a href="http://imdb.com/title/' + movieInfo.imdb_id + '">IMDB</a>'
  }
}

function getMovieCredits () {
  if (movieCredits.readyState === XMLHttpRequest.DONE) {
    let creditsInfo = JSON.parse(movieCredits.response)
    console.log(creditsInfo)
    document.querySelector('[data-director]').textContent = creditsInfo.crew[0].name

    let cast = creditsInfo.cast
    let aliaIndex = cast.findIndex(function (element) {
      return element.name === 'Alia Bhatt'
    })
    cast.splice(aliaIndex, 1)
    console.log(cast)
    document.querySelector('[data-stars').textContent = cast[0].name + ', ' + cast[1].name + ', and ' + cast[2].name
  }
}

function getMovieVideo () {
  if (movieVideo.readyState === XMLHttpRequest.DONE) {
    const videoObject = JSON.parse(movieVideo.response)
    const videoInfo = videoObject.results
    console.log(videoInfo)
    if (videoInfo[0] !== undefined) {
      const trailer = document.createElement('p')
      const trailerText = document.createTextNode('<a href="http://youtube.com/watch?v=' + videoInfo[0].key + '">Watch the trailer on YouTube.</a>')
      trailer.appendChild(trailerText)
      console.log(trailer)
      document.querySelector('div').parentElement.insertBefore(trailer, document.querySelector('div'))
      document.body.style.removeProperty('height');
      document.querySelector('div').innerHTML = '<iframe src="https://www.youtube.com/embed/z9Ul9ccDOqE" frameborder="0" allowfullscreen</iframe>'
    }
  }
}
