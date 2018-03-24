// Initial promise initialization

function get (url) {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest()
    request.open('GET', url)
    request.onload = () => {
      if (request.status === 200) {
        resolve(request.response)
      }
    }
    request.onerror = () => {
      reject(Error(reject))
    }
    request.send()
  })
}

// Get credits & sort them

get('https://api.themoviedb.org/3/person/1108120/movie_credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
  .then((response) => {
    const credits = JSON.parse(response)
    let releaseDate = credits.cast.map((i) => {
      return i.release_date
    })
    releaseDate = releaseDate.filter((i) => {
      return !(i === '')
    })
    releaseDate = releaseDate.sort()
    return {
      releaseDate: releaseDate,
      credits: credits.cast
    }
  })
// Compare releaseDate array to current date
  .then((Object) => {
    const date = getDate()
    const release = Object.releaseDate.find((element) => {
      return element > date
    })
    const releaseIndex = Object.releaseDate.findIndex((element) => {
      return element > date
    }) + 1
    if (date < release) {
// Run countdown timer + Return for next promise
      countdown(release)
      setInterval(() => {
        countdown(release)
      }, 1000)
      return Object.credits[releaseIndex].id
    } else {
// Tell the user there are no upcoming movies
      document.getElementById('stylesheet').href = '/style.css'
      document.querySelector('section').innerHTML = '<div class="container"> <div class="flex-left"> <h1> Alia Bhatt has no movies with a release date announced coming up!</h1></div> <div class="flex-right"></div></div>'
    }
  })
  .then((movieID) => {
// Get & change movie data
    get('https://api.themoviedb.org/3/movie/' + movieID + '?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
      .then((response) => {
        const movieInfo = JSON.parse(response)
        document.body.style.backgroundImage = 'url(https://image.tmdb.org/t/p/w533_and_h300_bestv2' + movieInfo.backdrop_path + ')'
        document.querySelectorAll('[data-title]').forEach(function (i) {
          i.textContent = movieInfo.title
        })
        document.querySelector('[data-description]').textContent = movieInfo.overview
        document.querySelector('[data-link]').innerHTML = '<a href="http://imdb.com/title/' + movieInfo.imdb_id + '">IMDb</a>'
      })
// Get & change "It also stars..."
    get('https://api.themoviedb.org/3/movie/' + movieID + '/credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
      .then((response) => {
        const creditsInfo = JSON.parse(response)
        document.querySelector('[data-director]').textContent = creditsInfo.crew[0].name
        const cast = creditsInfo.cast
        let aliaIndex = cast.findIndex(function (element) {
          return element.name === 'Alia Bhatt'
        })
        cast.splice(aliaIndex, 1)
        document.querySelector('[data-stars').textContent = cast[0].name + ', ' + cast[1].name + ', and ' + cast[2].name
      })
// Get YouTube trailer IF it exists
    get('https://api.themoviedb.org/3/movie/' + movieID + '/videos?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
      .then((response) => {
        const videoInfo = JSON.parse(response)
        const video = videoInfo.results[0]
        if (video !== undefined) {
          const trailer = document.createElement('p')
          const trailerText = document.createTextNode('Watch the trailer on YouTube below:')
          trailer.appendChild(trailerText)
          document.querySelector('#youtube').parentElement.insertBefore(trailer, document.querySelector('#youtube'))
          document.querySelector('#youtube').classList.add('video-container')
          document.querySelector('#youtube').innerHTML = '<iframe src="https://www.youtube.com/embed/' + video.key + '" frameborder="0" allowfullscreen</iframe>'
        }
      })
  })

// Rewrite document to tell the user to attempt a refresh
  .catch(() => {
    document.getElementById('stylesheet').href = '/style.css'
    document.querySelector('section').innerHTML = "<div class='container'> <div class='flex-left'> <h1>Uh oh! Your request didn't load. Try a refresh! </h1></div> <div class='flex-right'></div></div>"
  })

// Used above to compare dates
function getDate () {
  let getDate = new Date()
  let year = getDate.getFullYear()
  let month = 1 + getDate.getMonth()
  let monthDate = getDate.getDate()
  month = ('0' + month).slice(-2)
  monthDate = ('0' + monthDate).slice(-2)
  return (year + '-' + month + '-' + monthDate)
}

// Countdown timer
function countdown (release) {
  const t = Date.parse(release) - Date.parse(new Date())
  const days = Math.floor(t / (1000 * 60 * 60 * 24))
  const hours = Math.floor(t / (1000 * 60 * 60) % 24)
  const minutes = Math.floor((t / 1000 / 60) % 60)
  const seconds = Math.floor((t / 1000) % 60)

  document.querySelector('[data-days]').textContent = ('0' + days).slice(-2)
  document.querySelector('[data-hours]').textContent = ('0' + hours).slice(-2)
  document.querySelector('[data-minutes]').textContent = ('0' + minutes).slice(-2)
  document.querySelector('[data-seconds]').textContent = ('0' + seconds).slice(-2)
  
}
