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
        // reads chosen filters and returns array of filter objects
        findChosenFilters() {
            let choices = $("#filters-modal-selections").children();
            let filters = [];
            for(let choice of choices) {
                let filter = {}
                if(choice.className.includes("chosen-genre-filter")){
                    filter.type = "genre";
                    filter.value = choice.innerText;
                } else if(choice.className.includes("chosen-before-year-filter")) {
                    filter.type = "beforeYear";
                    filter.value = choice.dataset.filterYear;
                } else if(choice.className.includes("chosen-after-year-filter")) {
                    console.log(choice);
                    filter.type = "afterYear";
                    filter.value = choice.dataset.filterYear;
                }
                filters.push(filter);
            }
            return filters;
        },
        // returns movie list of current movies filtered
        async findActiveMovies() {
            let filters = MyMovies.findChosenFilters();
            return User.filterMovies(MyMovies.urls.backendURLPath, MyMovies.listId, filters);
        },
        // finds movies currently in list and returns array with first year and last year
        async findYears() {
            let movies = await this.findActiveMovies().then(res => res);
            let firstAndLastYear = [];
            for(let movie of movies) {
                if(firstAndLastYear.length === 0) {
                    firstAndLastYear.push(movie.year);
                    firstAndLastYear.push(movie.year);
                } else if(movie.year < firstAndLastYear[0]) {
                    firstAndLastYear[0] = movie.year;
                } else if(movie.year > firstAndLastYear[1]) {
                    firstAndLastYear[1] = movie.year;
                }
            }
            return firstAndLastYear;
        },
        // Prints current movie database on screen and initializes all event listeners
        async initialize() {
            await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
            await Print.filtersModal();
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
            let movieData = await dataPromise.then(res => res);
            // await dataPromise.then(async function(movieData) {
            let sortedMovies = await User.sortMovies(movieData);
            for(let movie of sortedMovies){
                Print.singleMovie(cardDiv, movie);
            }
            $("#loading-div").addClass("d-none");
            // });

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
        // clears all filters
        async clearFilters() {
            $("#filters-modal-genres").empty();
            $("#filters-modal-selections").empty();
        },
        // prints list with all genres
        async allGenreButtons() {
            let genres = await Get.genresByMovieListId(MyMovies.urls.backendURLPath, MyMovies.listId);
            for(let genre of genres) {
                Print.singleGenreButton(genre);
            }
        },
        // prints single genre button
        async singleGenreButton(genre) {
            $("#filters-modal-genres").append(`
                    <button class="btn btn-light filter-modal-genre-btn" data-genre-name="${genre.name}">${genre.name}</button>
                `);
        },
        // prints list with all years included
        async allYearLists() {
            // get all movies
            let years = await MyMovies.findYears().then(res => res);
            // print list of years to include max and min years from movie list
            this.allYearList($("#before-year-select"), years);
            this.allYearList($("#after-year-select"), years);
        },
        allYearList(div, years) {
            div.empty();
            div.append(`
                <option selected>Choose Year</option>
            `);
            for(let i = years[0]; i <= years[1]; i++) {
                div.append(`
                    <option value="${i}">${i}</option>
                `);
            }
        },
        // prints required filters when filter modal opens
        async filtersModal() {
            Print.clearFilters();
            await Print.allGenreButtons();
            await Print.allYearLists();
        }
    }

    // Events Object and Methods
    const Events = {
        // Initializes event listeners for add movie modal
        addMovieModalOn() {
            Events.defaultsOff();
            // Listens for keyup in the add movie text input
            $(document)
                .on("keyup", "#add-movie-text", function(e) {
                    if(e.key === "Enter" || e.key === " "){
                        Print.moviesList($("#add-movie-text").val());
                    }
                })
                // Listens for click on add movie card
                .on("click", "#movie-list .card", async function() {
                    await User.addMovie(MyMovies.urls.backendURLPath, MyMovies.urls.findTMDBURL, $(this).attr("data-movie-tmdb-id"), MyMovies.listId, MyMovies.csrfToken);
                    await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
                    Print.filtersModal();
                    Utils.Modal.hide(MyMovies.Modals.addMovieModal);
                    Events.addMovieModalOff();
                })
                .on("mousedown", function(e) {
                    if(!$(e.target).closest("#add-movie-modal .modal-content").length && $("#add-movie-modal").is(":visible")) {
                        Events.addMovieModalOff();
                    }
                })
            ;
        },
        // Turns off event listeners for add movie modal
        addMovieModalOff() {
            $(document)
                .off("keyup", "#add-movie-text")
                .off("click", "#movie-list .card")
                .off("mousedown")
            ;
            Events.defaultsOn();
        },
        singleMovieModalOn() {
            Events.defaultsOff();
            $(document)
                // Listens for click on delete button
                .on("click", ".delete-btn", async function (){
                    $(this).attr("disabled", "");
                    await User.deleteMovie(MyMovies.urls.backendURLPath, $(this).parent().parent().attr("data-movie-id"), MyMovies.listId, $(this), MyMovies.csrfToken);
                    await Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
                    Utils.Modal.hide(MyMovies.Modals.singleMovieModal);
                    Events.singleMovieModalOff();
                })
                .on("click", ".review-btn", function() {
                    User.reviewForm(MyMovies.urls.backendURLPath, $(this).parent().parent().attr("data-movie-id"));
                })
                .on("mouseenter", ".modal-rating-star", function() {
                    let rating = $(this).attr("data-rating-star");
                    Print.starFill(rating);
                })
                .on("mouseleave", "#single-movie-modal-header", async function() {
                    // get the saved rating and display it correctly
                    let movieId = $("#single-movie").attr("data-movie-id");
                    let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movieId);
                    let rating = ratingData.value;
                    Print.starFill(rating);
                })
                .on("click", ".modal-rating-star", function() {
                    let rating = $(this).attr("data-rating-star");
                    let movieId = $(this).attr("data-movie-id");
                    User.setRating(MyMovies.urls.backendURLPath, movieId, parseInt(rating), MyMovies.csrfToken);
                })
                .on("mousedown", function(e) {
                    if(!$(e.target).closest("#single-movie-modal .modal-content").length && $("#single-movie-modal").is(":visible")) {
                        Events.singleMovieModalOff();
                    }
                })
            ;
        },
        singleMovieModalOff() {
            $(document)
                .off("click", ".delete-btn")
                .off("click", ".review-btn")
                .off("mouseenter", ".modal-rating-star")
                .off("mouseleave", "#single-movie-modal-header")
                .off("click", ".modal-rating-star")
                .off("mousedown")
            ;
            Events.defaultsOn();
        },
        filterMovieModalOn() {
            Events.defaultsOff();
            $(document)
                .on("click", ".filter-modal-genre-btn", async function() {
                    $("#filters-modal-selections").append(`
                        <button class="btn btn-info chosen-genre-filter" data-genre-name="${$(this).attr("data-genre-name")}">${$(this).attr("data-genre-name")}</button>
                    `);
                    $(this).remove();
                    await Print.allMovies(MyMovies.findActiveMovies(), MyMovies.carouselRoot);
                    await Print.allYearLists();
                })
                .on("click", ".chosen-genre-filter", async function() {
                    $("#filters-modal-genres").append(`
                        <button class="btn btn-light filter-modal-genre-btn" data-genre-name="${$(this).attr("data-genre-name")}">${$(this).attr("data-genre-name")}</button>
                    `);
                    $(this).remove();
                    await Print.allMovies(MyMovies.findActiveMovies(), MyMovies.carouselRoot);
                    await Print.allYearLists();
                })
                .on("change", ".filters-year-select", async function() {
                    if($(this).attr("id") === "before-year-select") {
                        $(".chosen-before-year-filter").remove();
                        $("#filters-modal-selections").prepend(`
                            <button class="btn btn-info chosen-year-filter chosen-before-year-filter" data-filter-year="${$(this).find(":selected").val()}">Before ${$(this).find(":selected").val()}</button>
                        `);
                    } else if($(this).attr("id") === "after-year-select") {
                        $(".chosen-after-year-filter").remove();
                        $("#filters-modal-selections").prepend(`
                            <button class="btn btn-info chosen-year-filter chosen-after-year-filter" data-filter-year="${$(this).find(":selected").val()}">After ${$(this).find(":selected").val()}</button>
                        `);
                    }
                    await Print.allMovies(MyMovies.findActiveMovies(), MyMovies.carouselRoot);
                    await Print.allYearLists();
                })
                .on("click", ".chosen-year-filter", async function() {
                    $(this).remove();
                    await Print.allMovies(MyMovies.findActiveMovies(), MyMovies.carouselRoot);
                    await Print.allYearLists();
                })
                .on("mousedown", function(e) {
                    if(!$(e.target).closest("#filters-modal .modal-content").length && $("#filters-modal").is(":visible")) {
                        Events.filterMovieModalOff();
                    }
                })
            ;
        },
        filterMovieModalOff() {
            $(document)
                .off("click", ".filter-modal-genre-btn")
                .off("click", ".chosen-genre-filter")
                .off("change", ".filters-year-select")
                .off("click", ".chosen-year-filter")
                .off("mousedown")
            ;
            Events.defaultsOn();
        },
        // Initializes all default event listeners
        defaultsOn() {
            // Listens for click of add button
            $(document)
                .on("click", "#add-movie-btn", function() {
                    Events.addMovieModalOn();
                    $("#add-movie-text").val("").text("");
                    $("#movie-list").html("");
                    setTimeout(function() {
                        $("#add-movie-text").focus();
                    }, 500);
                })
                // Listens for click of any image of our full movie list
                .on("click", ".carousel-cell img", function() {
                    if(Carousel.isInFront($(this))) {
                        $(this).toggleClass("big-movie");
                        Events.singleMovieModalOn();
                        Carousel.modalClick(MyMovies.Modals.singleMovieModal);
                        Get.movieById(MyMovies.urls.backendURLPath, $(this).parent().attr("data-movie-id"), MyMovies.listId)
                            .then(res => Print.movieModal($("#single-movie-modal"), res));
                    }
                })
                // Listens for change in sort select
                .on("change", "#sort-select", function() {
                    Print.allMovies(MyMovies.findActiveMovies(), MyMovies.carouselRoot);
                })
                .on("keyup", function(e) {
                    if(e.key === "Left" || e.key === "ArrowLeft") {
                        Carousel.currImage--;
                        Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                    } else if(e.key === "Right" || e.key === "ArrowRight") {
                        Carousel.currImage++;
                        Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                    }
                })
                // Sets up event listeners for the buttons to rotate the carousel
                .on("click", ".carousel-next", function() {
                    Carousel.currImage++;
                    Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                })
                .on("click", ".carousel-prev", function() {
                    Carousel.currImage--;
                    Carousel.rotate(Carousel.currImage, MyMovies.carouselRoot);
                })
                // Hover over front movie in carousel
                .on("mouseenter", ".carousel-cell img", function() {
                    if(Carousel.isInFront($(this))) {
                        $(this).toggleClass("big-movie");
                    }
                })
                .on("mouseleave", ".carousel-cell img", function() {
                    if(Carousel.isInFront($(this))) {
                        $(this).toggleClass("big-movie");
                    }
                })
                // Hover over prev-next buttons
                .on("mouseenter", ".carousel-nav", function() {
                    $(this).css("opacity", "75");
                })
                .on("mouseleave", ".carousel-nav", function() {
                    $(this).css("opacity", "0");
                })
                .on("click", "#random-movie-btn", function() {
                    Carousel.randomIndex(MyMovies.carouselRoot);
                })
                .on("click", "#filter-movie-btn", function() {
                    Events.filterMovieModalOn();
                    Utils.Modal.show(MyMovies.Modals.filtersModal);
                })
            ;
        },
        defaultsOff() {
            $(document)
                .off("click", "#add-movie-btn")
                .off("click", ".carousel-cell img")
                .off("change", "#sort-select")
                .off("keyup")
                .off("click", ".carousel-next")
                .off("click", ".carousel-prev")
                .off("mouseenter", ".carousel-cell img")
                .off("mouseleave", ".carousel-cell img")
                .off("mouseenter", ".carousel-nav")
                .off("mouseleave", ".carousel-nav")
                .off("click", "#random-movie-btn")
                .off("click", "#filter-movie-btn")
            ;
        },
        initialize() {
            Events.defaultsOn();
        }
    }

    // Initialize MyMovies
    MyMovies.initialize();

});