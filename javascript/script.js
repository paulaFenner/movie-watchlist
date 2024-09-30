const API_KEY = '941f3a17';
let movies = [];
let watchlistArr = JSON.parse(localStorage.getItem('watchlist')) || [];

const movieContainerEl = document.getElementById('movie-container');

movieContainerEl.addEventListener('click', handleAddOrRemoveSelected);

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
      const movieResults = data.Search;
      const promises = movieResults.map((movie) => {
        return fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movie.imdbID}`)
          .then((res) => res.json())
          .then((movieData) => {
            console.log(movieData);
            return { ...movie, ...movieData };
          })
          .catch((error) => renderErrorMessage(error));
      });
      Promise.all(promises)
        .then((fetchedMovies) => {
          movies = fetchedMovies;
          renderMovieList(movies);
        })
        .catch((error) => renderErrorMessage(error));
    });
}

function handleAddOrRemoveSelected(e) {
  const movieId = e.target.dataset.add;
  const movie = movies.find((m) => m.imdbID === movieId);

  if (e.target.dataset.add) {
    appendMovieToList(movie);
  }
}

function appendMovieToList(movie) {
  if (movie && !watchlistArr.some((m) => m.imdbID === movie.imdbID)) {
    watchlistArr.push(movie);
    localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
    updateButtonState(movie);

    // Dispatch a custom event
    window.dispatchEvent(new CustomEvent('watchlistUpdated'));
  }
}

function updateButtonState(movie) {
  const button = document.querySelector(`[data-add="${movie.imdbID}"]`);
  if (button) {
    button.innerHTML = '<i class="fa-solid fa-circle-check"></i>Added';
    button.style.color = 'green';
    button.dataset.remove = movie.imdbID;
    delete button.dataset.add;
  }
}

// GENERATING HTML
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
              <button class="add-btn" data-add="${movie.imdbID}"><i class="fa-solid fa-circle-plus"></i>Watchlist</button>
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
