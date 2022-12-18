import { Get } from "./utils.js";
import { Carousel } from "./utils.js";

$(function() {

    const MovieIndex = {
        GlobalURLs: {
            tmdbTrendingUrl: "https://api.themoviedb.org/3/trending/movie/week",
            tmdbPosterPath: "https://image.tmdb.org/t/p/original/",
            backendURLPath: $("#base-url").text()
        },
        carouselRoot: $(".carousel"),
        spinInterval: null,
        async initialize() {
            await Print.trendingPosters(Get.trendingMovies(MovieIndex.GlobalURLs.backendURLPath, MovieIndex.GlobalURLs.tmdbTrendingUrl));
            Events.initialize();
        }
    }

    const Print = {
        async trendingPosters(trendingPromise) {
            MovieIndex.carouselRoot.empty();
            let trendingMovies = await trendingPromise.then(function(res) { return res});
            for(let [i, movie] of trendingMovies.entries()) {
                if(i < 12) {
                    Print.poster(movie.poster_path)
                }
            }
            Carousel.initialize(MovieIndex.carouselRoot);
            Carousel.rotateToBeginning(MovieIndex.carouselRoot);
        },
        poster(path) {
            MovieIndex.carouselRoot.append(`
                <div class="carousel-cell">
                    <img src="${MovieIndex.GlobalURLs.tmdbPosterPath}${path}" alt="">
                </div>
            `);
        }
    }

    const Events = {
        initialize() {
            $(window).ready(async function() {
                // await Carousel.initialize(MovieIndex.carouselRoot);
                $("#loading-div").addClass("d-none");
                // Spins carousel every 2.4 seconds
                setInterval(function() {
                    // Only spins when window is active
                    if(document.hasFocus()) {
                        Carousel.currImage++;
                        Carousel.rotate(Carousel.currImage, MovieIndex.carouselRoot);
                    }
                }, 2400);
            });
        }
    }

    MovieIndex.initialize();

});