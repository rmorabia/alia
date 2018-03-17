// Global variables because I don't understand how to handle this without making everything a nested hellscape

let date
let release
let aliaRequest
let credits
let releaseIndex
let movieRequest
let movieCredits
let movieVideo

// Initial http request

;
(() => {
  aliaRequest = new XMLHttpRequest()
  aliaRequest.open('GET', 'https://api.themoviedb.org/3/person/1108120/movie_credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
  aliaRequest.send()
  aliaRequest.onreadystatechange = getReleaseDate
})()

// Date-related functions

function getReleaseDate() {
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
    release = releaseDate.find(nextReleaseDate)
    releaseIndex = releaseDate.findIndex(nextReleaseDate) + 1
    if (date < release) {
      movieAjaxCall()
    } else {
      document.getElementById('stylesheet').href = '/style.css'
      document.querySelector('section').innerHTML = '<div class="container"> <div class="flex-left"> <h1> Alia Bhatt has no movies with a release date announced coming up!</h1></div> <div class="flex-right"></div></div>'
    }
    countdown()
    setInterval(countdown, 1000)
  }
}

function getDate() {
  let getDate = new Date()
  let year = getDate.getFullYear()
  let month = 1 + getDate.getMonth()
  let monthDate = getDate.getDate()
  month = ('0' + month).slice(-2)
  monthDate = ('0' + monthDate).slice(-2)
  date = (year + '-' + month + '-' + monthDate)
}

// Used above for Array.find

function nextReleaseDate(element) {
  return element > date
}

// Get & print movie data after the above functions run

function movieAjaxCall() {
  const movieID = credits.cast[releaseIndex].id
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

function getMovieInfo() {
  if (movieRequest.readyState === XMLHttpRequest.DONE) {
    let movieInfo = JSON.parse(movieRequest.response)
    document.body.style.backgroundImage = 'url(https://image.tmdb.org/t/p/w533_and_h300_bestv2' + movieInfo.backdrop_path + ')'
    document.querySelectorAll('[data-title]').forEach(function (i) {
      i.textContent = movieInfo.title
    })
    document.querySelector('[data-description]').textContent = movieInfo.overview
    document.querySelector('[data-link]').innerHTML = '<a href="http://imdb.com/title/' + movieInfo.imdb_id + '">IMDb</a>'
  }
}

function getMovieCredits() {
  if (movieCredits.readyState === XMLHttpRequest.DONE) {
    let creditsInfo = JSON.parse(movieCredits.response)
    document.querySelector('[data-director]').textContent = creditsInfo.crew[0].name

    let cast = creditsInfo.cast
    let aliaIndex = cast.findIndex(function (element) {
      return element.name === 'Alia Bhatt'
    })
    cast.splice(aliaIndex, 1)
    document.querySelector('[data-stars').textContent = cast[0].name + ', ' + cast[1].name + ', and ' + cast[2].name
  }
}

function getMovieVideo() {
  if (movieVideo.readyState === XMLHttpRequest.DONE) {
    const videoObject = JSON.parse(movieVideo.response)
    const videoInfo = videoObject.results
    if (videoInfo[0] !== undefined) {
      const trailer = document.createElement('p')
      const trailerText = document.createTextNode('Watch the trailer on YouTube below:')
      trailer.appendChild(trailerText)
      document.querySelector('#youtube').parentElement.insertBefore(trailer, document.querySelector('#youtube'))
      document.querySelector('#youtube').classList.add('video-container')
      document.querySelector('#youtube').innerHTML = '<iframe src="https://www.youtube.com/embed/' + videoInfo[0].key + '" frameborder="0" allowfullscreen</iframe>'
    }
  }
}

// Countdown timer

function countdown() {
  const t = Date.parse(release) - Date.parse(new Date())
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  const hours = Math.floor(t / (1000 * 60 * 60) % 24)
  const minutes = Math.floor((t / 1000 / 60) % 60)
  const seconds = Math.floor((t / 1000) % 60)

  function printClock() {
    document.querySelector('[data-days]').textContent = ('0' + days).slice(-2)
    document.querySelector('[data-hours]').textContent = ('0' + hours).slice(-2)
    document.querySelector('[data-minutes]').textContent = ('0' + minutes).slice(-2)
    document.querySelector('[data-seconds]').textContent = ('0' + seconds).slice(-2)
  }
  printClock()
}