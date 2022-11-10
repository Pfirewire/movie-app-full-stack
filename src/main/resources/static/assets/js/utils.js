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
    async movieById(url, id) {
        let allMoviesData = await this.allMovies(url);
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

