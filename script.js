const API_KEY = '941f3a17';

const movieContainerEl = document.getElementById('movie-container');

document.querySelector('form').addEventListener('submit', function (e) {
  e.preventDefault();
  removeInitialText();
  handleSearchRequest();
});

function handleSearchRequest() {
  const searchInput = document.getElementById('search-input');

  fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${searchInput.value}`)
    .then((res) => res.json())
    .then((data) => {
      if (data.Response === 'False') {
        renderNoResultsMessage();
        return;
      }
      fetchMovieDetails(data.Search)
        .then((movies) => renderMovieList(movies))
        .catch((error) => renderErrorMessage(error));
    })
    .catch((error) => renderErrorMessage(error));
}

function fetchMovieDetails(movies) {
  const promises = movies.map((movie) => fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`));
  return Promise.all(promises).then((responses) => {
    return Promise.all(responses.map((res) => res.json()));
  });
}

function renderMovieList(movies) {
  const html = movies
    .map(
      (movie) => `
      <div class="movie-wrapper">
        <img class="poster" src="${movie.Poster}" alt="" />

        <div class="movie">
          <div class="movie-header">
            <h2 class="movie-title">${movie.Title}</h2>
            <i class="fa-solid fa-star"></i>
            <p class="rating">${movie.imdbRating}</p>
          </div>
          <div class="movie-info">
            <p>${movie.Runtime}</p>
            <p>${movie.Genre}</p>
            <p><i class="fa-solid fa-circle-plus"></i>Watchlist</p>
          </div>
          <p class="plot">${movie.Plot}</p>
        </div>
      </div>
`
    )
    .join('');

  movieContainerEl.innerHTML = html;
}

function renderNoResultsMessage() {
  movieContainerEl.innerHTML = `
    <i class="fa-solid fa-face-sad-tear background"></i>
    <p class="background">
      Unable to find what you're looking for. <br/>
      Please try another search.
    </p>
  `;
}

function renderErrorMessage(error) {
  movieContainerEl.innerHTML = `
  <p>An error occurred: ${error.message} <br/> 
  Please try again later.</p>
  `;
}

function removeInitialText() {
  document.getElementById('main-text').style.display = 'none';
}
