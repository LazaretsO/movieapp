let API_KEY = "86fe167d-0f51-4fb5-940e-74112bf8d32b";
let API_URL = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=%D0%A2%D0%BE%D0%BF%20%D1%84%D0%B8%D0%BB%D1%8C%D0%BC%D1%8B&page=1";
let API_URL_SEARCH = "https://kinopoiskapiunofficial.tech/api/v2.1/films/search-by-keyword?keyword=";
getMovies(API_URL);

async function getMovies(url) {
    let resp = await fetch(url, {
        headers: {
            "Content-Type": "application/json",
            "X-API-KEY": API_KEY
        },
    });
    let respData = await resp.json();
    showMovies(respData);
}

function getClassByRate(vote) {
    if (vote >= 7) {
        return "green";
    } else if (vote >= 5) {
        return "orange";
    } else {
        return "red";
    }
}

function showMovies(data) {
    let moviesEl = document.querySelector(".movies");
    moviesEl.innerHTML = "";

    let moviesArr = (data.items || data.films || []).filter(movie =>
        movie.posterUrlPreview &&
        typeof movie.rating !== "undefined" &&
        movie.rating !== null &&
        movie.rating !== "" &&
        movie.rating !== "null" &&
        !isNaN(Number(movie.rating))
    );

    if (moviesArr.length === 0) {
        moviesEl.innerHTML = `<div class = "not__found">Ничего не найдено :(</div>`;
        return;
    }

    moviesArr.forEach((movie) => {
        let movieTitle = movie.nameRu || movie.nameEn || "";
        let movieEl = document.createElement("div");
        movieEl.classList.add("movie");
        movieEl.innerHTML = `
            <div class="movie__cover-inner">
                <img src="${movie.posterUrlPreview}" alt="${movieTitle}" class="movie__cover"/>
                <div class="movie__cover--darkned"></div>
            </div>
            <div class="movie__info">
                <div class="movie__title">${movieTitle}</div>
                <div class="movie__category">${movie.genres.map(genre => genre.genre).join(', ')}</div>
                <div class="movie__average movie__average--${getClassByRate(movie.rating)}">${movie.rating}</div>
                <a class="movie__watch-btn" href="https://hdrezka.ag/search/?do=search&subaction=search&q=${encodeURIComponent(movieTitle)}" target="_blank">Смотреть</a>
            </div>
        `;
        moviesEl.appendChild(movieEl);
    });
}

let form = document.querySelector("form");
let search = document.querySelector(".header__search");

form.addEventListener("submit", (e) => {
    e.preventDefault();
    
    let apiSearchUrl = `${API_URL_SEARCH}${search.value}`;
    if (search.value) {
        getMovies(apiSearchUrl);
    } else {
        window.location.reload();
    }
});

document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll('.movies').forEach(moviesBlock => {
        moviesBlock.addEventListener('mousemove', function(e) {
            if (!e.target.closest('.movie')) return;
            const card = e.target.closest('.movie');
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * 10; // угол наклона по X
            const rotateY = ((x - centerX) / centerX) * 10; // угол наклона по Y
            card.style.transform = `perspective(600px) rotateX(${-rotateX}deg) rotateY(${rotateY}deg) scale(1.03)`;
            card.style.transition = "transform 0.1s";
        });

        moviesBlock.addEventListener('mouseleave', function(e) {
            document.querySelectorAll('.movie').forEach(card => {
                card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
                card.style.transition = "transform 0.3s";
            });
        });

        moviesBlock.addEventListener('mouseout', function(e) {
            if (!e.relatedTarget || !e.relatedTarget.closest('.movie')) {
                document.querySelectorAll('.movie').forEach(card => {
                    card.style.transform = "perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)";
                    card.style.transition = "transform 0.3s";
                });
            }
        });
    });
});
