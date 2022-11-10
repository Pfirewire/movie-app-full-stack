// Get Object and Methods
export const Get = {
    // Gets all movies from our database
    async allMovies(url, listId) {
        try {
            // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
            let response = await fetch(`${url}movies/${listId}`);
            let data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    },
    // Gets only the data we need for our database from the TMDB database from the TMDB id input
    async scrapeSingleMovieData(url, tmdbUrl, tmdbId) {
        let tmdbPosterPath = "https://image.tmdb.org/t/p/original/";
        // Receives the full TMDB data
        let movieData = await Get.tmdbMovieById(url, tmdbUrl, tmdbId);
        // Scrapes necessary movie data
        let movieToAdd = {
            title: movieData.title,
            poster: `${tmdbPosterPath}${movieData.poster_path}`,
            year: parseInt(movieData.release_date.substring(0,4)),
            genre: Utils.Convert.genreArrayToString(movieData.genres),
            plot: movieData.overview,
            tmdbId: movieData.id
        }
        // returns movie object that matches the information stored in our project
        return movieToAdd;
    },
    // finds and returns movie data for movie in our database
    async movieById(url, id, listId) {
        let allMoviesData = await this.allMovies(url, listId);
        for(let movie of allMoviesData) {
            if(movie.id === parseInt(id)) {
                return movie;
            }
        }
    },
    // finds movie from TMDB database
    async tmdbMovieById(url, tmdbUrl, id) {
        // uses TMDB id
        // returns data inside a promise
        try {
            let tmdbKey = await Get.tmdbKey(url);
            let response = await fetch(`${tmdbUrl}${id}${tmdbKey}`);
            let data = await response.json();
            return data;
        } catch(err) {
            console.log(err);
        }
    },
    // finds movies from TMDB database
    async movieByTitle(url, tmdbUrl, title) {
        // inputs string with movie title
        // returns data array inside a promise
        try {
            let tmdbKey = await Get.tmdbKey(url);
            let response = await fetch(`${tmdbUrl}${tmdbKey}&query=${title}`);
            let data = await response.json();
            return data;
        } catch(err) {
            console.log(err);
        }
    },
    // gets api key
    async tmdbKey(url) {
        let response = await fetch(`${url}keys`);
        let data = await response.json();
        return data.tmdbKey;
    },
    // gets movie list
    async movieList(url) {
        let response = await fetch(`${url}list`);
        let data = await response.json();
        return data.id;
    },
    // gets api key
    // async backRoomKey() {
    //     let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}keys`);
    //     let data = await response.json();
    //     return data.backRoomKey;
    // },
    // gets movie rating from id
    async movieRating(url, id) {
        let response = await fetch(`${url}rating/${id}`);
        let data = await response.json();
        return data;
    }
}

// Utilities Object and Methods
export const Utils = {
    // Convert methods
    Convert: {
        // Converts genre array to string to store in our database
        genreArrayToString(genreArray) {
            return genreArray.reduce((genresString, genre, index) => {
                if(index === 0){
                    return genre.name;
                } else {
                    return `${genresString}, ${genre.name}`
                }
            }, '');
        }
    },
    // Modal Methods
    Modal: {
        hide(modal) {
            modal.hide();
        },
        show(modal) {
            modal.show();
        }
    },
    Math: {
        // returns true if numbers are equal within error margin, default 0.001
        approximatelyEqual(v1, v2, epsilon = 0.001) {
            return Math.abs(v1 - v2) < epsilon;
        }
    }
}

// User Object and Methods
export const User = {
    // Property to hold value to see if NSFW search is active
    overEighteen: false,
    // Adds movie to database
    async addMovie(tmdbId) {
        let movie = await Get.scrapeSingleMovieData(MyMovies.urls.backendURLPath, MyMovies.urls.findTMDBURL, tmdbId);
        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : MyMovies.csrfToken
            },
            body: JSON.stringify(movie)
        }
        let results = await fetch(`${MyMovies.urls.backendURLPath}movie/${MyMovies.listId}/add`, postOptions).then(res => {
            $("#add-movie-text").val('');
            $("#movie-list").empty();
            Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
            return res;
        });
        let addedMovie = await results.json();
        postOptions.body = JSON.stringify({rating: 5});
    },
    // Deletes movie from database
    async deleteMovie(movieId, button) {
        let deleteOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : MyMovies.csrfToken
            }
        }
        let deleteData = await fetch(`${MyMovies.urls.backendURLPath}movie/${movieId}/${MyMovies.listId}/delete`, deleteOptions).then(results => results);
        Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
        button.removeAttr("disabled");
    },
    // Edits movie in database
    async editMovie(id, button) {
        let newMovie = await Get.movieById(MyMovies.urls.backendURLPath, id, MyMovies.listId);
        newMovie.title = $("#title-input").val();
        newMovie.genre = $("#genre-input").val();
        newMovie.plot =  $("#plot-input").val();
        newMovie.year =  $("#year-input").val();

        let editOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : MyMovies.csrfToken
            },
            body : JSON.stringify(newMovie)
        }
        Print.allMovies(Get.allMovies(MyMovies.urls.backendURLPath, MyMovies.listId));
        button.removeAttr("disabled");
    },
    // Calls add or edit rating based on if a rating exists
    async setRating(movieId, rating) {
        let ratingData = await Get.movieRating(MyMovies.urls.backendURLPath, movieId);
        let oldRating = ratingData.value;
        let ratingObject = {
            value: rating
        }
        let postOptions = {
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : MyMovies.csrfToken
            },
            body: JSON.stringify(ratingObject)
        }
        oldRating < 0 ? postOptions.method = 'POST' : postOptions.method = 'PATCH';
        await fetch(`${MyMovies.urls.backendURLPath}rating/${movieId}`, postOptions);
    },
    // Sorts movies based on user choice. returns new array of movies
    sortMovies(movies) {
        // Checks which value user selected and sorts
        switch($("#sort-select").children("option:selected").val()){
            case "1":
                return movies.sort((prev, current) => parseInt(prev.id) - parseInt(current.id));
                break;
            case "2":
                return movies.sort((prev, current) => prev.title.localeCompare(current.title)).reverse();
                break;
            case "3":
                return movies.sort((prev, current) => prev.title.localeCompare(current.title));
                break;
            case "4":
                return movies.sort((prev, current) => parseInt(prev.year) - parseInt(current.year));
                break;
            case "5":
                return movies.sort((prev, current) => parseInt(prev.year) - parseInt(current.year)).reverse();
                break;
            default:
                console.log("Unknown sort parameter");
                return null;
                break;
        }
    },
    reviewForm(movieId) {
        window.location.href = `${MyMovies.urls.backendURLPath}review/${movieId}`;
    }
}

// Carousel Object and Methods
export const Carousel = {
    images: null,
    n: null,
    gap: 60,
    theta: null,
    apothem: null,
    currImage: 0,
    initialize(carouselRoot) {
        // Set variables
        this.images = carouselRoot.children();
        this.n = this.images.length;
        this.theta = 360 / this.n;
        let width = parseFloat($(this.images[0]).css("width"))
        this.apothem = width / (2 * Math.tan(Math.PI / this.n));

        // Set up carousel and navigation
        this.setupCarousel(this.n, width, carouselRoot);
    },
    rotateToBeginning(carouselRoot) {
        this.currImage = 0;
        this.rotate(this.currImage, carouselRoot);
    },
    rotate(imageIndex, carouselRoot) {
        // Rotates carousel to the image index
        carouselRoot.css("transform", `translateZ(-${this.apothem}px) rotateY(${imageIndex * -this.theta}deg)`);
        carouselRoot.attr("data-degree", (imageIndex * -this.theta))
    },
    setupCarousel(n, s, carouselRoot) {
        // Sets up and updates carousel css styling
        // Math stuff for transforming our carousel images
        let apothem = s / (2 * Math.tan(Math.PI / n));
        for (let i = 0; i < n; i++) {
            $(this.images[i]).css("padding", `0 ${this.gap}px`);
            $(this.images[i]).css("border-radius", "1em");
            $(this.images[i]).css("transform", `rotateY(${i * this.theta}deg) translateZ(${apothem}px)`);
            $(this.images[i]).attr("data-degree", (i*this.theta));
        }
        this.rotate(this.currImage, carouselRoot);
    },
    spinRight() {
        $("button.carousel-next").trigger("click");
    },
    spinLeft() {
        $("button.carousel-prev").trigger("click");
    },
    isInFront(img) {
        let carouselDegree = parseFloat(img.parent().parent().attr("data-degree"));
        let cellDegree = parseFloat(img.parent().attr("data-degree"));
        let carouselModulo = (carouselDegree + cellDegree) % 360;
        return Utils.Math.approximatelyEqual(carouselModulo, 360) || Utils.Math.approximatelyEqual(carouselModulo, 0);
    },
    modalClick(singleMovieModal){
        Utils.Modal.show(singleMovieModal);
    }
}


