import { Get } from "./utils.js";
import { User } from "./utils.js";

$(function() {

    // MovieLists object and globals
    const MovieLists = {
        movieListDiv: $("#all-movie-lists-div"),
        // CSRF Token
        csrfToken: $("meta[name='_csrf']").attr("content"),
        async initialize() {
            // Print lists in div
            Print.allMovieLists(Get.movieLists());
            // Initialize event listeners
            Events.initialize();
        }
    }

    const Print = {
        // Print user's movie lists
        allMovieLists(dataPromise) {
            MovieLists.movieListDiv.empty();
            dataPromise.then(function(movieListData) {
                movieListData.forEach(function(movieList) {
                    Print.singleMovieList(MovieLists.movieListDiv, movieList);
                    let movieListCardDiv = MovieLists.movieListDiv.children().last().children(".movie-list-card");
                    let movieListMovies = Get.allMoviesFromList(movieList.id);
                    Print.singleMovieListPosters(movieListCardDiv, movieListMovies);
                })
            });
        },
        singleMovieList(div, movieList) {
            div.append(`
                <div class="movie-list-div" data-list-id="${movieList.id}">
                    <div class="movie-list-header-div">
                        <div class="edit-movie-list-div">
                            <button class="edit-movie-list-button btn btn-light">Edit Name</button>
                        </div>
                        <h3 class="movie-list-title">
                            <a href="/movie/list/${movieList.id}">
                                ${movieList.name}
                            </a>
                        </h3>
                        <div class="delete-movie-list-div">
                            <button class="delete-movie-list-button btn btn-danger">Delete</button>
                        </div>
                    </div>
                    <div class="movie-list-card">
                    </div>
                </div>
            `);
        },
        singleMovieListPosters(div, moviesPromise) {
            moviesPromise.then(function(movieData) {
                movieData.forEach(function(movie, index) {
                    if(index < 5) {
                        Print.singleMoviePoster(div, movie);
                    }
                })
            });
        },
        singleMoviePoster(div, movie) {
            div.append(`
                <div>
                    <img src=${movie.poster} class="movie-list-poster">
                </div>
            `);
        },
        singleMovieListEdit(headerDiv, listObject) {
            headerDiv.children(".movie-list-title").html(`
                <input id="edit-list-title" value="${listObject.name}">
            `);
            headerDiv.children(".edit-movie-list-div").html(`
                <button class="edit-movie-list-button-confirm btn btn-primary">Save Changes</button>
            `);
        }
    }

    // Events Object and Methods
    const Events = {
        initialize() {
            // Mouseover for each list

            // Click event for movie list
            $(document.body).on("click", ".delete-movie-list-button", async function() {
                await User.deleteMovieList(
                    $(this).parent().parent().parent().attr("data-list-id"),
                    $(this),
                    MovieLists.csrfToken
                );
                Print.allMovieLists(Get.movieLists());
            });
            $(document.body).on("click", ".edit-movie-list-button", async function() {
                let listId = $(this).parent().parent().parent().attr("data-list-id");
                let listObject = await Get.movieListById(listId).then(res => res);
                Print.singleMovieListEdit($(this).parent().parent(), listObject);
            });
            $(document.body).on("click", ".edit-movie-list-button-confirm", async function() {
                $(this).attr("disabled", true);
                let listId = $(this).parent().parent().parent().attr("data-list-id");
                let listName = $(this).parent().siblings("h3").children("input").val();
                await User.editMovieList(
                    listId,
                    listName,
                    $(this),
                    MovieLists.csrfToken
                );
                Print.allMovieLists(Get.movieLists())
            });
        }
    }

    // Initialize MovieLists
    MovieLists.initialize();

});