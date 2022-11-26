import { Get } from "./utils.js";
import { Utils } from "./utils.js";
import { User } from "./utils.js";
import { Carousel } from "./utils.js";

// Initialize jQuery
$(function() {
    // MyMovies Object and Methods
    const MyMovies = {
        // Storing all the URL const variables
        urls: {
            moviesURL: "https://liberating-military-cyclone.glitch.me/movies",
            searchTMDBURL: "https://api.themoviedb.org/3/search/movie",
            findTMDBURL: "https://api.themoviedb.org/3/movie/",
            tmdbPosterPath: "https://image.tmdb.org/t/p/original/",
            backendURLPath: $("#base-url").text(),
        },
        // Modal Object
        Modals: {
            singleMovieModal: new bootstrap.Modal("#single-movie-modal"),
            addMovieModal: new bootstrap.Modal("#add-movie-modal"),
            filtersModal: new bootstrap.Modal("#filters-modal")
        },
        // List id
        listId: $("#list-id").text(),
        // Root div of carousel
        carouselRoot: $(".carousel"),
        // CSRF Token
        csrfToken: $("meta[name='_csrf']").attr("content"),
        // Prints current movie database on screen and initializes all event listeners
        async initialize() {
            await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
            Events.initialize();
        },
    }

    // Print Object and Methods
    const Print = {
        // Prints all movies onto screen
        async allMovies(dataPromise, carouselRoot) {
            $("#loading-div").removeClass("d-none");
            // prints all movies in our database on screen
            const cardDiv = $(".carousel");
            cardDiv.empty();
            await dataPromise.then(async function(movieData) {
                let sortedMovies = await User.sortMovies(movieData);
                for(let movie of sortedMovies){
                    Print.singleMovie(cardDiv, movie);
                }
                $("#loading-div").addClass("d-none");
            });

            Carousel.initialize(carouselRoot);
            Carousel.rotateToBeginning(carouselRoot);
        },
        // prints single movie card from our database to be inserted into the all movies list
        async singleMovie(div, movie) {
            div.prepend(`
                <div class="carousel-cell" data-movie-id="${movie.id}">
                    <img src="${movie.poster}" alt="">
                </div>
            `);
        },
        // prints the movie modal from our database
        async movieModal(div, movie) {
            // contains movie info with no image
            let modalHeaderDiv = $("#single-movie-modal-header");
            let modalBodyDiv = $("#single-movie");
            let genres = Utils.Convert.genreArrayToString(movie.genres);
            await Print.modalRating(modalHeaderDiv, movie);
            modalBodyDiv.empty();
            modalBodyDiv.attr("data-movie-id", movie.id);
            modalBodyDiv.append(`
                <h5 class="modal-title text-light modal-overflow-wrap mb-2">${movie.title}</h5>
                <p class="modal-overflow-wrap">Genres: ${genres}</p>
                <p class="modal-overflow-wrap">Plot: ${movie.plot}</p>
                <p class="modal-overflow-wrap">Year: ${movie.year}</p>
                <div class="d-flex justify-content-between">
                    <button class="review-btn btn btn-primary">Review Movie</button>
                    <button class="delete-btn btn btn-danger">Delete Movie</button>
                </div>
        `);
        },
        // Prints movie modal from our database with text fields for user to edit
        async editModal(movie) {
            // prints the movie modal from our database
            // contains movie info with no image
            let modalHeaderDiv = $("#single-movie-modal-header");
            let modalBodyDiv = $("#single-movie");
            modalHeaderDiv.empty();
            modalHeaderDiv.append(`
                <input id="title-input" class="w-100 modal-input border-dark bg-light" type="text" value="${movie.title}">
            `);
            modalBodyDiv.empty();
            modalBodyDiv.attr("data-movie-id", movie.id);
            modalBodyDiv.append(`
                 <input id="genre-input" class="modal-input border-dark bg-light" value="${movie.genres}">
                 <textarea id="plot-input" class="w-100 modal-input border-dark bg-light" rows="9">${movie.plot}</textarea>
                 <input id="year-input" class="modal-input border-dark bg-light" value="${movie.year}">
                 <div class="d-flex justify-content-center">
                     <button id="save-edit-btn" class="btn btn-primary mt-3">Save Edit</button>
                 </div>
            `);
        },
        // prints modal with movies from TMDB database
        async moviesList(title) {
            // shows the top 6 from search results
            let movieList = await Get.movieByTitle(MyMovies.urls.backendURLPath, MyMovies.urls.searchTMDBURL, title).then(results => results);
            $("#movie-list").empty();
            movieList.results.forEach((movie, index) => {
                if(index < 6) {
                    $("#movie-list").append(`
                        <div class="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex justify-content-center">
                            <div class="card search-card border-0" data-movie-tmdb-id="${movie.id}">
                                <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" class="card-img search-card-img">
                            </div>
                        </div>
                    `);
                }
            });
        },
        // prints rating in the movie modal
        async modalRating(div, movie) {
            // get rating for movie
            let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movie.id);
            let rating = ratingData.value;
            div.empty();
            if(rating < 0) {
                for(let i = 1; i < 6; i++) {
                    div.append(`
                        <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            } else {
                for(let i = 1; i <= rating; i++) {
                    div.append(`
                        <i class="bi bi-star-fill px-1 fs-1 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
                for(let i = rating + 1; i < 6; i++) {
                    div.append(`
                        <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            }
        },
        starFill(rating) {
            for(let i = 1; i < 6; i++) {
                if(i <= rating) {
                    $(`.modal-rating-${i}`).removeClass("bi-star fs-3").addClass("bi-star-fill fs-1");
                } else {
                    $(`.modal-rating-${i}`).removeClass("bi-star-fill fs-1").addClass("bi-star fs-3");
                }
            }
        },
        // prints chosen filter out on filter list
        async chosenFilter() {
            // Prints out all filters along with data to create filter object { type: 'val', value: 'val" }
        },
        // clears all filters
        async clearFilters() {
            // clears all filters from list
        },
        // clears single filter
        async clearFilter() {
            // clears a single filter from list
        },
        // prints list with all genres
        async allGenreList() {
            // get all genres

            // print list with all genres for user to choose
        },
        // prints list with all years included
        async allYearList() {
            // get all movies

            // print list of years to include max and min years from movie list
        },
        // prints required filters when filtermodal opens
        async filtersModal() {
            let genres = await Get.
        }
    }

    // Events Object and Methods
    const Events = {
        // Initializes all event listeners
        initialize() {
            // Listens for keyup in the add movie text input
            $("#add-movie-text").keyup(e => {
                if(e.key === "Enter" || e.key === " "){
                    Print.moviesList($("#add-movie-text").val());
                }
            });
            // Listens for click on add movie card
            $(document.body).on("click", "#movie-list .card", async function() {
                await User.addMovie(MyMovies.urls.backendURLPath, MyMovies.urls.findTMDBURL, $(this).attr("data-movie-tmdb-id"), MyMovies.listId, MyMovies.csrfToken);
                await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
                Utils.Modal.hide(MyMovies.Modals.addMovieModal);
            });
            // Listens for click on delete button
            $(document.body).on("click", ".delete-btn", async function (){
                $(this).attr("disabled", "");
                await User.deleteMovie(MyMovies.urls.backendURLPath, $(this).parent().parent().attr("data-movie-id"), MyMovies.listId, $(this), MyMovies.csrfToken);
                await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
                Utils.Modal.hide(MyMovies.Modals.singleMovieModal);
            })
            // Listens for click of add button
            $("#add-movie-btn").on("click", function() {
                $("#add-movie-text").val("").text("");
                $("#movie-list").html("");
                setTimeout(function() {
                    $("#add-movie-text").focus();
                }, 500);
            });
            // Listens for click of any image of our full movie list
            $(document.body).on("click", ".carousel-cell img", function() {
                if(Carousel.isInFront($(this))) {
                    Carousel.modalClick(MyMovies.Modals.singleMovieModal);
                    Get.movieById(MyMovies.urls.backendURLPath, $(this).parent().attr("data-movie-id"), MyMovies.listId)
                        .then(res => Print.movieModal($("#single-movie-modal"), res));
                }
            });
            $(document.body).on("click", ".review-btn", function() {
                User.reviewForm(MyMovies.urls.backendURLPath, $(this).parent().parent().attr("data-movie-id"));
            });
            // Listens for change in sort select
            $("#sort-select").change(function() {
                Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
            });
            $(document.body).on("mouseenter", ".modal-rating-star", function() {
                let rating = $(this).attr("data-rating-star");
                Print.starFill(rating);
            });
            $(document.body).on("mouseleave", "#single-movie-modal-header", async function() {
                // get the saved rating and display it correctly
                let movieId = $("#single-movie").attr("data-movie-id");
                let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movieId);
                let rating = ratingData.value;
                Print.starFill(rating);
            });
            $(document.body).on("click", ".modal-rating-star", function() {
                let rating = $(this).attr("data-rating-star");
                let movieId = $(this).attr("data-movie-id");
                User.setRating(MyMovies.urls.backendURLPath, movieId, parseInt(rating), MyMovies.csrfToken);
            });
            $(document.body).on("keyup", function(e) {
                if(e.key === "Left" || e.key === "ArrowLeft") {
                    Carousel.currImage--;
                    Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                } else if(e.key === "Right" || e.key === "ArrowRight") {
                    Carousel.currImage++;
                    Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                }
            });
            // Sets up event listeners for the buttons to rotate the carousel
            $(".carousel-next").on("click", function() {
                Carousel.currImage++;
                Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
            });
            $(".carousel-prev").on("click", function() {
                Carousel.currImage--;
                Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
            });
            // Hover over front movie in carousel
            $(document.body).on("mouseenter", ".carousel-cell img", function() {
                if(Carousel.isInFront($(this))) {
                    $(this).toggleClass("big-movie");
                }
            });
            $(document.body).on("mouseleave", ".carousel-cell img", function() {
                if(Carousel.isInFront($(this))) {
                    $(this).toggleClass("big-movie");
                }
            });
            // Hover over prev-next buttons
            $(document.body).on("mouseenter", ".carousel-nav", function() {
                $(this).css("opacity", "75");
            });
            $(document.body).on("mouseleave", ".carousel-nav", function() {
                $(this).css("opacity", "0");
            });
            $("#random-movie-btn").on("click", function() {
                Carousel.randomIndex(MyMovies.carouselRoot);
            });
            $("#filter-movie-btn").on("click", function() {
                Utils.Modal.show(MyMovies.Modals.filtersModal);
            });
            $("#apply-filters-btn").on("click", async function() {
                Print.allMovies(User.filterMovies(MyMovies.urls.backendURLPath, MyMovies.listId, ""), MyMovies.carouselRoot);
            });
        }
    }


    // Initialize MyMovies
    MyMovies.initialize();

});