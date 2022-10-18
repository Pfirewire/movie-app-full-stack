$(function() {

    const MovieApp = {
        GlobalURLs: {
            tmdbTrendingUrl: "https://api.themoviedb.org/3/trending/movie/week",
            tmdbPosterPath: "https://image.tmdb.org/t/p/original/",
            backendURLPath: $("#base-url").text()
        },
        Div: {
            trending: $(".carousel")
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
                <div class="carousel-cell">
                    <img src="${MovieApp.GlobalURLs.tmdbPosterPath}${path}" alt="">
                </div>
            `);
        }
    }

    const Carousel = {
        images: null,
        n: null,
        gap: 60,
        theta: null,
        currImage: 0,
        initialize(carouselRoot) {
            // Set variables
            this.images = carouselRoot.children();
            this.n = this.images.length;
            this.theta = 2 * Math.PI / this.n;

            // Set up carousel and navigation
            this.setupCarousel(this.n, parseFloat($(this.images[0]).css("width")));
            this.setupNavigation();
        },
        rotate(imageIndex) {
            // Rotates carousel to the image index
            MovieApp.Div.trending.css("transform", `translateZ(-783.731px) rotateY(${imageIndex * -30}deg)`);
        },
        setupCarousel(n, s) {
            // Sets up and updates carousel css styling
            // Math stuff for transforming our carousel images
            let apothem = s / (2 * Math.tan(Math.PI / n));
            for (let i = 0; i < n; i++) {
                $(this.images[i]).css("padding", `0 ${this.gap}px`);
                $(this.images[i]).css("border-radius", "1em");
                $(this.images[i]).css("transform", `rotateY(${i * 30}deg) translateZ(${apothem}px)`);
            }
            this.rotate(this.currImage);
        },
        setupNavigation() {
            // Sets up event listeners for the buttons to rotate the carousel
            $(".carousel-next").on("click", function() {
                Carousel.currImage++;
                Carousel.rotate(Carousel.currImage);
            });
            $(".carousel-prev").on("click", function() {
                Carousel.currImage--;
                Carousel.rotate(Carousel.currImage);
            });
        },
        spinRight() {
            $("button.carousel-next").trigger("click");
        },
        spinLeft() {
            $("button.carousel-prev").trigger("click");
        }
    }

    const Events = {
        initialize() {
            $(window).on("load", async function() {
                await Carousel.initialize($(".carousel"));
                $("#loading-div").addClass("d-none");
                // Spins carousel every 2.4 seconds
                setInterval(function() {
                    // Only spins when window is active and user not hovering over a movie poster
                    if(document.hasFocus() && $(".carousel div:hover").length === 0) {
                        Carousel.spinRight();
                    }
                }, 3600);
            });
            $(window).on("keyup", function(e) {
                if(e.key === "Left" || e.key === "ArrowLeft") {
                    Carousel.spinLeft();
                } else if(e.key === "Right" || e.key === "ArrowRight") {
                    Carousel.spinRight();
                }
            });
        }
    }

    MovieApp.initialize();

});