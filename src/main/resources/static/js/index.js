$(function() {

    const MovieApp = {
        GlobalURLs: {
            tmdbTrendingUrl: "https://api.themoviedb.org/3/trending/movie/week",
            tmdbPosterPath: "https://image.tmdb.org/t/p/original/",
            backendURLPath: $("#base-url").text()
        },
        Div: {
            trending: $("#trending-movie-carousel>figure")
        },
        spinInterval: null,
        initialize() {
            Events.initialize();
            Print.trendingPosters(Get.trendingMovies());
        }
    }

    const Get = {
        // gets api key
        async tmdbKey() {
            let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}keys`);
            let data = await response.json();
            return data.tmdbKey;
        },
        // gets trending movie list
        async trendingMovies() {
            let tmdbKey = await Get.tmdbKey();
            let response = await fetch(`${MovieApp.GlobalURLs.tmdbTrendingUrl}${tmdbKey}`);
            let data = await response.json();
            return data.results;
        }
    }

    const Print = {
        trendingPosters(trendingPromise) {
            MovieApp.Div.trending.empty();
            trendingPromise.then(trendingList => {
                for(let [i, movie] of trendingList.entries()) {
                    if(i < 12)
                        Print.poster(movie.poster_path);
                }
            });
        },
        poster(path) {
            MovieApp.Div.trending.append(`
                <div>
                    <img src="${MovieApp.GlobalURLs.tmdbPosterPath}${path}" alt="">
                </div>
            `);
        }
    }

    const Carousel = {
        initialize(carouselRoot) {
            let
                figure = carouselRoot.children("figure"),
                nav = carouselRoot.children("nav"),
                images = figure.children(),
                n = images.length,
                gap = 30,
                theta = 2 * Math.PI / n,
                currImage = 0;

            setupCarousel(n, parseFloat($(images[0]).css("width")));

            setupNavigation();

            function setupCarousel(n, s) {
                // Sets up and updates carousel css styling
                // Math stuff for transforming our carousel images
                let apothem = s / (2 * Math.tan(Math.PI / n));

                figure.css("transform-origin", `50% 50% ${- apothem}px`);

                for (let i = 0; i < n; i++) {
                    $(images[i]).css("padding", `0 ${gap}px`);
                    $(images[i]).css("border-radius", "1em");
                }
                for (let i = 1; i < n; i++) {
                    $(images[i]).css("transform-origin", `50% 50% ${- apothem}px`);
                    $(images[i]).css("transform", `rotateY(${i * theta}rad)`);
                }

                rotate(currImage);
            }

            function setupNavigation() {
                // Sets up event listeners for the buttons to rotate the carousel
                nav.children(".carousel-next").on("click", function() {
                    currImage++;
                    rotate(currImage);
                });
                nav.children(".carousel-prev").on("click", function() {
                    currImage--;
                    rotate(currImage);
                });
            }

            function rotate(imageIndex) {
                // Rotates carousel to the image index
                figure.css("transform", `rotateY(${imageIndex * -theta}rad)`);
            }
        },
        spin() {
            $("button.carousel-next").trigger("click");
        }
    }

    const Events = {
        initialize() {
            $(window).on("load", async function() {
                let carousel = $(".carousel");
                await Carousel.initialize(carousel);
                $("#loading-div").addClass("d-none");
                setInterval(function() {
                    if(document.hasFocus()) {
                        Carousel.spin();
                    }
                }, 2400);
            });
        }
    }

    MovieApp.initialize();

});