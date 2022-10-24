// export const Get = {
//     // Gets all movies from our database
//     async allMovies() {
//         try {
//             // let response = await fetch(MovieApp.GlobalURLs.moviesURL);
//             let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}movies/${MovieApp.listId}`);
//             let data = await response.json();
//             return data;
//         } catch (err) {
//             console.log(err);
//         }
//     },
//     // Gets only the data we need for our database from the TMDB database from the TMDB id input
//     async scrapeSingleMovieData(tmdbId) {
//         // Receives the full TMDB data
//         let movieData = await Get.tmbdMovieById(tmdbId);
//         // Scrapes necessary movie data
//         let movieToAdd = {
//             title: movieData.title,
//             poster: `${MovieApp.GlobalURLs.tmdbPosterPath}${movieData.poster_path}`,
//             year: parseInt(movieData.release_date.substring(0,4)),
//             genre: Utils.Convert.genreArrayToString(movieData.genres),
//             plot: movieData.overview,
//             tmdbId: movieData.id
//         }
//         // returns movie object that matches the information stored in our project
//         return movieToAdd;
//     },
//     // finds and returns movie data for movie in our database
//     async movieById(id) {
//         let allMoviesData = await this.allMovies();
//         for(let movie of allMoviesData) {
//             if(movie.id === parseInt(id)) {
//                 return movie;
//             }
//         }
//     },
//     // finds movie from TMDB database
//     async tmbdMovieById(id) {
//         // uses TMDB id
//         // returns data inside a promise
//         try {
//             let tmdbKey = await Get.tmdbKey();
//             let response = await fetch(`${MovieApp.GlobalURLs.findTMDBURL}${id}${tmdbKey}`);
//             let data = await response.json();
//             return data;
//         } catch(err) {
//             console.log(err);
//         }
//     },
//     // finds movies from TMDB database
//     async movieByTitle(title) {
//         // inputs string with movie title
//         // returns data array inside a promise
//         try {
//             let tmdbKey = await Get.tmdbKey();
//             let response = await fetch(`${MovieApp.GlobalURLs.searchTMDBURL}${tmdbKey}&query=${title}${User.overEighteen? MovieApp.TMDBPaths.nsfw : MovieApp.TMDBPaths.sfw}`);
//             let data = await response.json();
//             return data;
//         } catch(err) {
//             console.log(err);
//         }
//     },
//     // gets api key
//     async tmdbKey() {
//         let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}keys`);
//         let data = await response.json();
//         return data.tmdbKey;
//     },
//     // gets movie list
//     async movieList() {
//         let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}list`);
//         let data = await response.json();
//         return data.id;
//     },
//     // gets api key
//     async backRoomKey() {
//         let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}keys`);
//         let data = await response.json();
//         return data.backRoomKey;
//     },
//     // gets movie rating from id
//     async movieRating(id) {
//         let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}rating/${id}`);
//         let data = await response.json();
//         return data;
//     }
// }
