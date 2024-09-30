let watchlistArr = JSON.parse(localStorage.getItem('watchlist')) || [];

const movieContainerEl = document.getElementById('movie-container');
const mainTextEl = document.getElementById('main-text');

window.addEventListener('watchlistUpdated', renderWatchlist);

movieContainerEl.addEventListener('click', function (e) {
  const movieId = e.target.dataset.remove;
  if (e.target.dataset.remove) {
    removeFromWatchlist(movieId);
  }
});

function removeFromWatchlist(movieId) {
  watchlistArr = watchlistArr.filter((movie) => movie.imdbID !== movieId);
  localStorage.setItem('watchlist', JSON.stringify(watchlistArr));
  renderWatchlist();
}

function renderWatchlist() {
  if (watchlistArr.length === 0) {
    mainTextEl.style.display = 'block';
    movieContainerEl.innerHTML = '';
  } else {
    mainTextEl.style.display = 'none';
    const html = watchlistArr
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
                            <button class="remove-btn" data-remove="${movie.imdbID}">
                                <i class="fa-solid fa-circle-minus"></i>Remove
                            </button>
                        </div>
                        <p class="plot">${movie.Plot}</p>
                    </div>
                </div>
            `
      )
      .join('');

    movieContainerEl.innerHTML = html;
  }
}

// Initial render
renderWatchlist();
