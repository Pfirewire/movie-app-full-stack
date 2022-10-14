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
    const Get = {
        // Get user's movie lists
        async movieLists() {
            try {
                let results = await fetch(`${MovieApp.GlobalURLs.backendURLPath}movie/list/all`);
                let data = results.json();
                console.log("inside get.movieLists. data returned: ")
                console.log(data);
                return data;
            } catch(error) {
                console.log(`There was an error: ${error}`);
            }
        }
    }

    const Print = {
        // Print user's movie lists
        allMovieLists(dataPromise) {
            MovieApp.movieListDiv.empty();
            dataPromise.then(movieListData => {
                movieListData.forEach(function(movieList) {
                    Print.singleMovieList(MovieApp.movieListDiv, movieList);
                })
            });
        },
        singleMovieList(div, movieList) {
            div.prepend(`
                <div class="movie-list-div">
                    <h3 class="movie-list-title">${movieList.name}</h3>
                    <div class="movie-list-card">
                    
                    </div>
                </div>
            `);
            // <div className="div-card col-xl-3 col-lg-4 col-md-6 col-12 d-flex justify-content-center"
            //      data-movie-id="${movie.id}">
            //     <div className="card movie-card border-0">
            //         <a role="button" href="#single-movie-modal" data-bs-toggle="modal">
            //             <img src=${movie.poster} className="card-img all-movie-img">
            //         </a>
            //     </div>
            // </div>
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