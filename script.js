let date

;(function ajaxCall () {
  getDate()
  const httpRequest = new XMLHttpRequest()
  httpRequest.open('GET', 'https://api.themoviedb.org/3/person/1108120/movie_credits?api_key=f8e4d97cbdd172b25e1dd31546263dcd&language=en-US')
  httpRequest.send()
  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      let credits = JSON.parse(httpRequest.response)
      let releaseDate = []
      for (let i = 0; i < credits.cast.length; i++) {
        releaseDate[i] = credits.cast[i].release_date
      }
      releaseDate = releaseDate.filter(function (i) {
        return !(i === '')
      })
      releaseDate = releaseDate.sort()
      let release = releaseDate.find(red)
      if (date < release) {
        document.write("Alia's next movie is on " + release + '!')
      }
    }
  }
})()

function red (element) {
  return element > date
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
