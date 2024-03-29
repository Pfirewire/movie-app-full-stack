// Get Object and Methods
export const Get = {
    // Gets all movies from our database
    async allMovies(listId) {
        try {
            // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
            let response = await fetch(`${Utils.url()}movies/${listId}`);
            let data = await response.json();
            return data;
        } catch (err) {
            console.log(err);
        }
    },
    // Gets only the data we need for our database from the TMDB database from the TMDB id input
    async scrapeSingleMovieData(tmdbUrl, tmdbId) {
        let tmdbPosterPath = "https://image.tmdb.org/t/p/original/";
        // Receives the full TMDB data
        let movieData = await Get.tmdbMovieById(tmdbUrl, tmdbId);
        // Scrapes necessary movie data
        let movieToAdd = {
            title: movieData.title,
            poster: `${tmdbPosterPath}${movieData.poster_path}`,
            year: parseInt(movieData.release_date.substring(0,4)),
            genres: movieData.genres,
            plot: movieData.overview,
            tmdbId: movieData.id
        }
        // returns movie object that matches the information stored in our project
        return movieToAdd;
    },
    // finds and returns movie data for movie in our database
    async movieById(id, listId) {
        let allMoviesData = await this.allMovies(listId);
        for(let movie of allMoviesData) {
            if(movie.id === parseInt(id)) {
                return movie;
            }
        }
    },
    // finds movie from TMDB database
    async tmdbMovieById(tmdbUrl, id) {
        // uses TMDB id
        // returns data inside a promise
        try {
            let response = await fetch(`${tmdbUrl}${id}${TMDB_KEY}`);
            let data = await response.json();
            return data;
        } catch(err) {
            console.log(err);
        }
    },
    // finds movies from TMDB database
    async movieByTitle(tmdbUrl, title) {
        // inputs string with movie title
        // returns data array inside a promise
        try {
            let response = await fetch(`${tmdbUrl}${TMDB_KEY}&query=${title}`);
            let data = await response.json();
            return data;
        } catch(err) {
            console.log(err);
        }
    },
    // gets movie list
    async movieList() {
        let response = await fetch(`${Utils.url()}list`);
        let data = await response.json();
        return data.id;
    },
    // gets movie rating from id
    async movieRating(id) {
        let response = await fetch(`${Utils.url()}rating/${id}`);
        let data = await response.json();
        return data;
    },
    // gets trending movie list
    async trendingMovies(trendingUrl) {
        let response = await fetch(`${trendingUrl}${TMDB_KEY}`);
        let data = await response.json();
        return data.results;
    },
    // gets all reviews
    async allReviews() {
        try {
            let reviewData = await fetch(`${Utils.url()}reviews/all`);
            let reviewList = await reviewData.json();
            return reviewList
        } catch (err) {
            console.log(err);
        }
    },
    // gets all reviews by user
    async userReviews() {
        try {
            let reviewData = await fetch(`${Utils.url()}reviews/user`);
            let reviewList = await reviewData.json();
            return reviewList
        } catch (err) {
            console.log(err);
        }
    },
    // gets movie rating with movie id and user id
    async movieRatingWithUserId(movieId, userId) {
        let response = await fetch(`${Utils.url()}rating/${movieId}/${userId}`);
        let data = await response.json();
        return data;
    },
    // Get user's movie lists
    async movieLists() {
        try {
            let results = await fetch(`${Utils.url()}movie/list/all`);
            let data = await results.json();
            return data;
        } catch(error) {
            console.log(`There was an error: ${error}`);
        }
    },
    // gets all movies from single list
    async allMoviesFromList(listId) {
        try {
            // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
            let response = await fetch(`${Utils.url()}movies/${listId}`);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    // gets movie list from list id
    async movieListById(listId) {
        try {
            let response = await fetch(`${Utils.url()}movie/list/${listId}/get`);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    // gets genre by movie id
    async genresByMovieId(movieId) {
        try {
            // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
            let response = await fetch(`${Utils.url()}genre/${movieId}`);
            let data = await response.json();
            return data;
        } catch (error) {
            console.log(error);
        }
    },
    // gets all genres in movie list
    async genresByMovieListId(listId) {
        let genres = await fetch(`${Utils.url()}genre/${listId}/all`).then(res => res.json());
        return genres;
    },
    // gets url for background image
    async backgroundImage(key) {
        let photo = await fetch(`https://api.unsplash.com/photos/random/?client_id=${key}&collections=10544471&orientation=landscape`).then(res => res.json());
        return photo;
    },

    async profilePicture() {
        let picture = await fetch(`${Utils.url()}user/picture`).then(res => res.json());
        console.log(picture);
        return picture;
    }
}

export const Post = {
    async profilePicture(file, token) {
        console.log("inside profilePicture. file: ");
        console.log(file);
        console.log(token);
        let postOptions = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : token
            },
            body: JSON.stringify(file)
        }
        return await fetch(`${Utils.url()}user/picture`, postOptions).then(res => res.json());
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
        // hides modal
        hide(modal) {
            modal.hide();
        },
        // shows modal
        show(modal) {
            modal.show();
        }
    },
    // Math Methods
    Math: {
        // returns true if numbers are equal within error margin, default 0.001
        approximatelyEqual(v1, v2, epsilon = 0.001) {
            return Math.abs(v1 - v2) < epsilon;
        }
    },
    url() {
        return `${window.location.protocol}//${window.location.host}/`;
    }
}

// User Object and Methods
export const User = {
    // Filterby methods
    FilterBy: {
        // Filter by genre, returns movies containing genre
        genre(movies, genreName) {
            let filteredMovies = [];
            if(movies) {
                for(let movie of movies){
                    for(let genre of movie.genres){
                        if(genre.name.toLowerCase() === genreName.toLowerCase()) {
                            filteredMovies.push(movie);
                        }
                    }
                }
            } else {
                console.log("No movies to filter");
            }
            return filteredMovies;
        },
        // Filter by name
        // name(movies, name) {
        //
        // },
        // Filter by before year, returns movies before year
        beforeYear(movies, year) {
            let filteredMovies = [];
            if(movies) {
                for(let movie of movies) {
                    if(movie.year < year) {
                        filteredMovies.push(movie);
                    }
                }
            } else {
                console.log("No movies to filter");
            }
            return filteredMovies;
        },
        // Filter by after year, returns movies after year
        afterYear(movies, year) {
            let filteredMovies = [];
            if(movies) {
                for(let movie of movies) {
                    if(movie.year > year) {
                        filteredMovies.push(movie);
                    }
                }
            } else {
                console.log("No movies to filter");
            }
            return filteredMovies;
        }
    },
    // Adds movie to database
    async addMovie(tmdbUrl, tmdbId, listId, csrfToken) {
        let movie = await Get.scrapeSingleMovieData(tmdbUrl, tmdbId);

        const postOptions = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            },
            body: JSON.stringify(movie)
        }
        let results = await fetch(`${Utils.url()}movie/${listId}/add`, postOptions).then(res => {
            $("#add-movie-text").val('');
            $("#movie-list").empty();
            // Print.allMovies(Get.allMovies(url, listId));
            return res;
        });
        let addedMovie = await results.json();
        postOptions.body = JSON.stringify({rating: 5});
    },
    // Deletes movie from database
    async deleteMovie(movieId, listId, button, csrfToken) {
        let deleteOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            }
        }
        let deleteData = await fetch(`${Utils.url()}movie/${movieId}/${listId}/delete`, deleteOptions).then(results => results);
        // Print.allMovies(Get.allMovies(url, listId));
        button.removeAttr("disabled");
    },
    // Edits movie in database
    async editMovie(id, listId, button, csrfToken) {
        let newMovie = await Get.movieById(id, listId);
        newMovie.title = $("#title-input").val();
        newMovie.genres = $("#genre-input").val();
        newMovie.plot =  $("#plot-input").val();
        newMovie.year =  $("#year-input").val();

        let editOptions = {
            method: 'PATCH',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            },
            body : JSON.stringify(newMovie)
        }
        // Print.allMovies(Get.allMovies(url, listId));
        button.removeAttr("disabled");
    },
    // Calls add or edit rating based on if a rating exists
    async setRating(movieId, rating, csrfToken) {
        let ratingData = await Get.movieRating(movieId);
        let oldRating = ratingData.value;
        let ratingObject = {
            value: rating
        }
        let postOptions = {
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            },
            body: JSON.stringify(ratingObject)
        }
        oldRating < 0 ? postOptions.method = 'POST' : postOptions.method = 'PATCH';
        await fetch(`${Utils.url()}rating/${movieId}`, postOptions);
    },
    // Sorts movies based on user choice. returns new array of movies
    async sortMovies(movies) {
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
        window.location.href = `${Utils.url()}review/${movieId}`;
    },
    // Edits movie list by name
    async editMovieList(listId, listName, button, csrfToken) {
        let newMovieList = await Get.movieListById(listId).then(res => res);
        newMovieList.name = listName;

        let editOptions = {
            method: 'POST',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            },
            body : JSON.stringify(newMovieList)
        }
        await fetch(`${Utils.url()}movie/list/${listId}/edit`, editOptions);
        // Print.allMovies(Get.allMovies(url, listId));
        button.removeAttr("disabled");
    },
    // Deletes movie list
    async deleteMovieList(listId, button, csrfToken) {
        let deleteOptions = {
            method: 'DELETE',
            headers: {
                'Content-Type' : 'application/json',
                'X-CSRF-TOKEN' : csrfToken
            }
        }
        let deleteData = await fetch(`${Utils.url()}movie/list/${listId}/delete`, deleteOptions).then(results => results);
        // Print.allMovies(Get.allMovies(url, listId));
        button.removeAttr("disabled");
    },
    // Function that filters movies based on array of filter objects passed in
    async filterMovies(listId, filters) {
        let movies = await Get.allMovies(listId).then(res => res);
        if(filters) {
            for(let filter of filters) {
                switch(filter.type) {
                    case "genre":
                        movies = User.FilterBy.genre(movies, filter.value);
                        break;
                    case "beforeYear":
                        movies = User.FilterBy.beforeYear(movies, filter.value);
                        break;
                    case "afterYear":
                        movies = User.FilterBy.afterYear(movies, filter.value);
                        break;
                    default:
                        console.log("Unknown filter");
                        break;
                }
            }
        } else {
            console.log("no filters chosen");
        }
        return movies;
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
        let apothem;
        if(n < 3) {
            apothem = 1;
        } else {
            apothem = s / (2 * Math.tan(Math.PI / n));
        }
        for (let i = 0; i < n; i++) {
            $(this.images[i]).css("padding", `0 ${this.gap}px`);
            $(this.images[i]).css("border-radius", "1em");
            $(this.images[i]).css("transform", `rotateY(${i * this.theta}deg) translateZ(${apothem}px)`);
            $(this.images[i]).attr("data-degree", (i*this.theta));
        }
        this.rotate(this.currImage, carouselRoot);
    },
    isInFront(img) {
        let carouselDegree = parseFloat(img.parent().parent().attr("data-degree"));
        let cellDegree = parseFloat(img.parent().attr("data-degree"));
        let carouselModulo = (carouselDegree + cellDegree) % 360;
        return Utils.Math.approximatelyEqual(carouselModulo, 360) || Utils.Math.approximatelyEqual(carouselModulo, 0);
    },
    modalClick(singleMovieModal){
        Utils.Modal.show(singleMovieModal);
    },
    randomIndex(carouselRoot) {
        this.currImage += (2 * this.n) + (Math.floor(Math.random() * (this.n)));
        this.rotate(this.currImage, carouselRoot);
    }
}