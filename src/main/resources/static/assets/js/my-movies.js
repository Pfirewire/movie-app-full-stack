import { Get } from "./utils.js";
import { Utils } from "./utils.js";
import { Print } from "./utils.js";
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
        // List id
        listId: $("#list-id").text(),
        // Root div of carousel
        carouselRoot: $(".carousel"),
        // Modals on screen
        singleMovieModal: new bootstrap.Modal("#single-movie-modal"),
        addMovieModal: new bootstrap.Modal("#add-movie-modal"),
        // CSRF Token
        csrfToken: $("meta[name='_csrf']").attr("content"),
        // Prints current movie database on screen and initializes all event listeners
        async initialize() {
            Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId), MyMovies.carouselRoot);
            Events.initialize();
        },
    }

    // Print Object and Methods
    // const Print = {
    //     // Prints all movies onto screen
    //     async allMovies(dataPromise) {
    //         $("#loading-div").removeClass("d-none");
    //         // prints all movies in our database on screen
    //         const cardDiv = $(".carousel");
    //         cardDiv.empty();
    //         await dataPromise.then(movieData => {
    //             User.sortMovies(movieData).forEach((movie) => {
    //                 Print.singleMovie(cardDiv, movie);
    //             });
    //             $("#loading-div").addClass("d-none");
    //         });
    //
    //         Carousel.initialize();
    //         Carousel.rotateToBeginning();
    //     },
    //     // prints single movie card from our database to be inserted into the all movies list
    //     async singleMovie(div, movie) {
    //         div.prepend(`
    //             <div class="carousel-cell" data-movie-id="${movie.id}">
    //                 <img src="${movie.poster}" alt="">
    //             </div>
    //         `);
    //     },
    //     // prints the movie modal from our database
    //     async movieModal(div, movie) {
    //         // contains movie info with no image
    //         let modalHeaderDiv = $("#single-movie-modal-header");
    //         let modalBodyDiv = $("#single-movie");
    //         await Print.modalRating(modalHeaderDiv, movie);
    //         modalBodyDiv.empty();
    //         modalBodyDiv.attr("data-movie-id", movie.id);
    //         modalBodyDiv.append(`
    //             <h5 class="modal-title text-light modal-overflow-wrap mb-2">${movie.title}</h5>
    //             <p class="modal-overflow-wrap">Genre: ${movie.genre}</p>
    //             <p class="modal-overflow-wrap">Plot: ${movie.plot}</p>
    //             <p class="modal-overflow-wrap">Year: ${movie.year}</p>
    //             <div class="d-flex justify-content-between">
    //                 <button class="review-btn btn btn-primary">Review Movie</button>
    //                 <button class="delete-btn btn btn-danger">Delete Movie</button>
    //             </div>
    //     `);
    //     },
    //     // Prints movie modal from our database with text fields for user to edit
    //     async editModal(movie) {
    //         // prints the movie modal from our database
    //         // contains movie info with no image
    //         let modalHeaderDiv = $("#single-movie-modal-header");
    //         let modalBodyDiv = $("#single-movie");
    //         modalHeaderDiv.empty();
    //         modalHeaderDiv.append(`
    //             <input id="title-input" class="w-100 modal-input border-dark bg-light" type="text" value="${movie.title}">
    //         `);
    //         modalBodyDiv.empty();
    //         modalBodyDiv.attr("data-movie-id", movie.id);
    //         modalBodyDiv.append(`
    //              <input id="genre-input" class="modal-input border-dark bg-light" value="${movie.genre}">
    //              <textarea id="plot-input" class="w-100 modal-input border-dark bg-light" rows="9">${movie.plot}</textarea>
    //              <input id="year-input" class="modal-input border-dark bg-light" value="${movie.year}">
    //              <div class="d-flex justify-content-center">
    //                  <button id="save-edit-btn" class="btn btn-primary mt-3">Save Edit</button>
    //              </div>
    //         `);
    //     },
    //     // prints modal with movies from TMDB database
    //     async moviesList(title) {
    //         // shows the top 6 from search results
    //         let movieList = await Get.movieByTitle(MyMovies.urls.backendURLPath, MyMovies.urls.searchTMDBURL, title).then(results => results);
    //         $("#movie-list").empty();
    //         movieList.results.forEach((movie, index) => {
    //             if(index < 6) {
    //                 $("#movie-list").append(`
    //                     <div class="col-xl-2 col-lg-4 col-sm-6 col-12 d-flex justify-content-center">
    //                         <div class="card search-card border-0" data-movie-tmdb-id="${movie.id}">
    //                             <img src="https://image.tmdb.org/t/p/original/${movie.poster_path}" class="card-img search-card-img">
    //                         </div>
    //                     </div>
    //                 `);
    //             }
    //         });
    //     },
    //     // prints rating in the movie modal
    //     async modalRating(div, movie) {
    //         // get rating for movie
    //         let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movie.id);
    //         let rating = ratingData.value;
    //         div.empty();
    //         if(rating < 0) {
    //             for(let i = 1; i < 6; i++) {
    //                 div.append(`
    //                     <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
    //                 `);
    //             }
    //         } else {
    //             for(let i = 1; i <= rating; i++) {
    //                 div.append(`
    //                     <i class="bi bi-star-fill px-1 fs-1 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
    //                 `);
    //             }
    //             for(let i = rating + 1; i < 6; i++) {
    //                 div.append(`
    //                     <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
    //                 `);
    //             }
    //         }
    //     },
    //     starFill(rating) {
    //         for(let i = 1; i < 6; i++) {
    //             if(i <= rating) {
    //                 $(`.modal-rating-${i}`).removeClass("bi-star fs-3").addClass("bi-star-fill fs-1");
    //             } else {
    //                 $(`.modal-rating-${i}`).removeClass("bi-star-fill fs-1").addClass("bi-star fs-3");
    //             }
    //         }
    //     }
    // }

    // Carousel Object and Methods
    // const Carousel = {
    //     images: null,
    //     n: null,
    //     gap: 60,
    //     theta: null,
    //     apothem: null,
    //     currImage: 0,
    //     initialize() {
    //         // Set variables
    //         this.images = MyMovies.carouselRoot.children();
    //         this.n = this.images.length;
    //         this.theta = 360 / this.n;
    //         let width = parseFloat($(this.images[0]).css("width"))
    //         this.apothem = width / (2 * Math.tan(Math.PI / this.n));
    //
    //         // Set up carousel and navigation
    //         this.setupCarousel(this.n, width);
    //     },
    //     rotateToBeginning() {
    //         this.currImage = 0;
    //         this.rotate(this.currImage);
    //     },
    //     rotate(imageIndex) {
    //         // Rotates carousel to the image index
    //         MyMovies.carouselRoot.css("transform", `translateZ(-${this.apothem}px) rotateY(${imageIndex * -this.theta}deg)`);
    //         MyMovies.carouselRoot.attr("data-degree", (imageIndex * -this.theta))
    //     },
    //     setupCarousel(n, s) {
    //         // Sets up and updates carousel css styling
    //         // Math stuff for transforming our carousel images
    //         let apothem = s / (2 * Math.tan(Math.PI / n));
    //         for (let i = 0; i < n; i++) {
    //             $(this.images[i]).css("padding", `0 ${this.gap}px`);
    //             $(this.images[i]).css("border-radius", "1em");
    //             $(this.images[i]).css("transform", `rotateY(${i * this.theta}deg) translateZ(${apothem}px)`);
    //             $(this.images[i]).attr("data-degree", (i*this.theta));
    //         }
    //         this.rotate(this.currImage);
    //     },
    //     spinRight() {
    //         $("button.carousel-next").trigger("click");
    //     },
    //     spinLeft() {
    //         $("button.carousel-prev").trigger("click");
    //     },
    //     isInFront(img) {
    //         let carouselDegree = parseFloat(img.parent().parent().attr("data-degree"));
    //         let cellDegree = parseFloat(img.parent().attr("data-degree"));
    //         let carouselModulo = (carouselDegree + cellDegree) % 360;
    //         return Utils.Math.approximatelyEqual(carouselModulo, 360) || Utils.Math.approximatelyEqual(carouselModulo, 0);
    //     },
    //     modalClick(){
    //         Utils.Modal.show(MyMovies.singleMovieModal);
    //     }
    // }

    // User Object and Methods
    // const User = {
    //     // Property to hold value to see if NSFW search is active
    //     overEighteen: false,
    //     // Adds movie to database
    //     async addMovie(tmdbId) {
    //         let movie = await Get.scrapeSingleMovieData(MyMovies.urls.backendURLPath, MyMovies.urls.findTMDBURL, tmdbId);
    //         const postOptions = {
    //             method: 'POST',
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //                 'X-CSRF-TOKEN' : MyMovies.csrfToken
    //             },
    //             body: JSON.stringify(movie)
    //         }
    //         let results = await fetch(`${MyMovies.urls.backendURLPath}movie/${MyMovies.listId}/add`, postOptions).then(res => {
    //             $("#add-movie-text").val('');
    //             $("#movie-list").empty();
    //             Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
    //             return res;
    //         });
    //         let addedMovie = await results.json();
    //         postOptions.body = JSON.stringify({rating: 5});
    //     },
    //     // Deletes movie from database
    //     async deleteMovie(movieId, button) {
    //         let deleteOptions = {
    //             method: 'DELETE',
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //                 'X-CSRF-TOKEN' : MyMovies.csrfToken
    //             }
    //         }
    //         let deleteData = await fetch(`${MyMovies.urls.backendURLPath}movie/${movieId}/${MyMovies.listId}/delete`, deleteOptions).then(results => results);
    //         Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
    //         button.removeAttr("disabled");
    //     },
    //     // Edits movie in database
    //     async editMovie(id, button) {
    //         let newMovie = await Get.movieById(MyMovies.urls.backendURLPath, id, MyMovies.listId);
    //         newMovie.title = $("#title-input").val();
    //         newMovie.genre = $("#genre-input").val();
    //         newMovie.plot =  $("#plot-input").val();
    //         newMovie.year =  $("#year-input").val();
    //
    //         let editOptions = {
    //             method: 'PATCH',
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //                 'X-CSRF-TOKEN' : MyMovies.csrfToken
    //             },
    //             body : JSON.stringify(newMovie)
    //         }
    //         Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
    //         button.removeAttr("disabled");
    //     },
    //     // Calls add or edit rating based on if a rating exists
    //     async setRating(movieId, rating) {
    //         let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movieId);
    //         let oldRating = ratingData.value;
    //         let ratingObject = {
    //             value: rating
    //         }
    //         let postOptions = {
    //             headers: {
    //                 'Content-Type' : 'application/json',
    //                 'X-CSRF-TOKEN' : MyMovies.csrfToken
    //             },
    //             body: JSON.stringify(ratingObject)
    //         }
    //         oldRating < 0 ? postOptions.method = 'POST' : postOptions.method = 'PATCH';
    //         await fetch(`${MyMovies.urls.backendURLPath}rating/${movieId}`, postOptions);
    //     },
    //     // Sorts movies based on user choice. returns new array of movies
    //     sortMovies(movies) {
    //         // Checks which value user selected and sorts
    //         switch($("#sort-select").children("option:selected").val()){
    //             case "1":
    //                 return movies.sort((prev, current) => parseInt(prev.id) - parseInt(current.id));
    //                 break;
    //             case "2":
    //                 return movies.sort((prev, current) => prev.title.localeCompare(current.title)).reverse();
    //                 break;
    //             case "3":
    //                 return movies.sort((prev, current) => prev.title.localeCompare(current.title));
    //                 break;
    //             case "4":
    //                 return movies.sort((prev, current) => parseInt(prev.year) - parseInt(current.year));
    //                 break;
    //             case "5":
    //                 return movies.sort((prev, current) => parseInt(prev.year) - parseInt(current.year)).reverse();
    //                 break;
    //             default:
    //                 console.log("Unknown sort parameter");
    //                 return null;
    //                 break;
    //         }
    //     },
    //     reviewForm(movieId) {
    //         window.location.href = `${MyMovies.urls.backendURLPath}review/${movieId}`;
    //     }
    // }

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
            $(document.body).on("click", "#movie-list .card", function() {
                User.addMovie($(this).attr("data-movie-tmdb-id"));
                Utils.Modal.hide(MyMovies.addMovieModal);
            });
            // Listens for click on delete button
            $(document.body).on("click", ".delete-btn", function (){
                $(this).attr("disabled", "");
                User.deleteMovie($(this).parent().parent().attr("data-movie-id"), $(this));
                Utils.Modal.hide(MyMovies.singleMovieModal);
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
                    Carousel.modalClick(MyMovies.singleMovieModal);
                    Get.movieById(MyMovies.urls.backendURLPath, $(this).parent().attr("data-movie-id"), MyMovies.listId)
                        .then(res => Print.movieModal($("#single-movie-modal"), res));
                }
            });
            $(document.body).on("click", ".review-btn", function() {
                User.reviewForm($(this).parent().parent().attr("data-movie-id"));
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
                User.setRating(movieId, parseInt(rating));
            });
            $(document.body).on("keyup", function(e) {
                if(e.key === "Left" || e.key === "ArrowLeft") {
                    Carousel.spinLeft();
                } else if(e.key === "Right" || e.key === "ArrowRight") {
                    Carousel.spinRight();
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
        }
    }


    // Initialize MyMovies
    MyMovies.initialize();

});