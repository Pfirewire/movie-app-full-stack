import { Get } from "./utils.js";

$(function() {

    // MovieLists object and globals
    const MovieLists = {
        // Storing all the URL const variablers
        GlobalURLs: {
            backendURLPath: $("#base-url").text()
        },
        movieListDiv: $("#all-movie-lists-div"),
        async initialize() {
            // Print lists in div
            Print.allMovieLists(Get.movieLists(MovieLists.GlobalURLs.backendURLPath));
            // Initialize event listeners
            Events.initialize();
        }
    }

    // Get object and methods
    // const Get = {
    //     // Get user's movie lists
    //     async movieLists() {
    //         try {
    //             let results = await fetch(`${MovieLists.GlobalURLs.backendURLPath}movie/list/all`);
    //             let data = results.json();
    //             return data;
    //         } catch(error) {
    //             console.log(`There was an error: ${error}`);
    //         }
    //     },
    //     async allMoviesFromList(listId) {
    //         try {
    //             // let response = await fetch(MovieLists.GlobalURLs.moviesURL);
    //             let response = await fetch(`${MovieLists.GlobalURLs.backendURLPath}movies/${listId}`);
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
            MovieLists.movieListDiv.empty();
            dataPromise.then(function(movieListData) {
                movieListData.forEach(function(movieList) {
                    Print.singleMovieList(MovieLists.movieListDiv, movieList);
                    let movieListCardDiv = MovieLists.movieListDiv.children().last().children(".movie-list-card");
                    let movieListMovies = Get.allMoviesFromList(MovieLists.GlobalURLs.backendURLPath, movieList.id);
                    Print.singleMovieListPosters(movieListCardDiv, movieListMovies);
                })
            });
        },
        singleMovieList(div, movieList) {
            div.append(`
                <div class="movie-list-div">
                    <div class="movie-list-header-div">
                        <div class="edit-movie-list-div">
                            <button class="edit-movie-list-button">Edit Name</button>
                        </div>
                        <h3 class="movie-list-title">
                            <a href="/movie/list/${movieList.id}">
                                ${movieList.name}
                            </a>
                        </h3>
                        <div class="delete-movie-list-div">
                            <button class="delete-movie-list-button">Delete Movie List</button>
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
        }
    }

    // Events Object and Methods
    const Events = {
        initialize() {
            // Mouseover for each list

            // Click event for movie list

        }
    }

    // Initialize MovieLists
    MovieLists.initialize();

});