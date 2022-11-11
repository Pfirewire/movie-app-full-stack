import { Get } from "./utils.js";

$(function() {

    // MovieApp object and globals
    const MovieApp = {
        // Storing all the URL const variablers
        GlobalURLs: {
            backendURLPath: $("#base-url").text()
        },
        movieListDiv: $("#all-movie-lists-div"),
        async initialize() {
            // Print lists in div
            Print.allMovieLists(Get.movieLists());
            // Initialize event listeners
            Events.initialize();
        }
    }

    // Get object and methods
    // const Get = {
    //     // Get user's movie lists
    //     async movieLists() {
    //         try {
    //             let results = await fetch(`${MovieApp.GlobalURLs.backendURLPath}movie/list/all`);
    //             let data = results.json();
    //             return data;
    //         } catch(error) {
    //             console.log(`There was an error: ${error}`);
    //         }
    //     },
    //     async allMoviesFromList(listId) {
    //         try {
    //             // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
    //             let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}movies/${listId}`);
    //             let data = await response.json();
    //             return data;
    //         } catch (error) {
    //             console.log(error);
    //         }
    //     }
    // }

    const Print = {
        // Print user's movie lists
        allMovieLists(dataPromise) {
            MovieApp.movieListDiv.empty();
            dataPromise.then(function(movieListData) {
                movieListData.forEach(function(movieList) {
                    Print.singleMovieList(MovieApp.movieListDiv, movieList);
                    let movieListCardDiv = MovieApp.movieListDiv.children().last().children(".movie-list-card");
                    let movieListMovies = Get.allMoviesFromList(movieList.id);
                    Print.singleMovieListPosters(movieListCardDiv, movieListMovies);
                })
            });
        },
        singleMovieList(div, movieList) {
            div.append(`
                <div class="movie-list-div">
                    <h3 class="movie-list-title">
                        <a href="/movie/list/${movieList.id}">
                            ${movieList.name}
                        </a>
                    </h3>
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
        }
    }

    // Events Object and Methods
    const Events = {
        initialize() {
            // Mouseover for each list

            // Click event for movie list

        }
    }

    // Initialize MovieApp
    MovieApp.initialize();

});