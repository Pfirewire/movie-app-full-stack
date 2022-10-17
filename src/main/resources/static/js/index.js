$(function() {

    const MovieApp = {
        GlobalURLs: {
            tmdbTrendingUrl: "https://api.themoviedb.org/3/trending/movie/week",
            tmdbPosterPath: "https://image.tmdb.org/t/p/original/",
            backendURLPath: $("#base-url").text()
        },
        Div: {
            trending: $("#trending-movie-carousel>figure")
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
                    if(i < 8) {
                        Print.poster(movie.poster_path);
                    }
                }
            });
        },
        poster(path) {
            MovieApp.Div.trending.append(`
                <img src="${MovieApp.GlobalURLs.tmdbPosterPath}${path}" alt="">
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
                gap = carouselRoot.attr("data_gap"),
                theta = 2 * Math.PI / n,
                currImage = 0;

            setupCarousel(n, parseFloat($(images[0]).css("width")));
            window.addEventListener('resize', () => {
                setupCarousel(n, parseFloat(getComputedStyle(images[0]).width))
            });

            setupNavigation();

            function setupCarousel(n, s) {

                let
                    apothem = s / (2 * Math.tan(Math.PI / n))
                ;


                figure.css("transform-origin", `50% 50% ${- apothem}px`);

                for (let i = 0; i < n; i++)
                    $(images[i]).css("padding", `0 ${gap}px`);
                for (let i = 1; i < n; i++) {
                    $(images[i]).css("transform-origin", `50% 50% ${- apothem}px`);
                    $(images[i]).css("transform", `rotateY(${i * theta}rad)`);
                }
                for (let i = 0; i < n; i++)
                    $(images[i]).css("backface-visibility", "hidden");

                rotate(currImage);
            }

            function setupNavigation() {
                // nav.on('click', onClick);
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
                figure.css("transform", `rotateY(${imageIndex * -theta}rad)`);
            }
        }
    }

    const Events = {
        initialize() {
            $(window).on("load", function() {
                let carousel = $(".carousel");
                Carousel.initialize(carousel);
            });
        }
    }


    Events.initialize();
    Print.trendingPosters(Get.trendingMovies());




    // window.addEventListener('load', () => {
    //     var
    //         carousels = document.querySelectorAll('.carousel')
    //     ;
    //
    //     for (var i = 0; i < carousels.length; i++) {
    //         carousel(carousels[i]);
    //     }
    // });
    //
    // function carousel(root) {
    //     var
    //         figure = root.querySelector('figure'),
    //         nav = root.querySelector('nav'),
    //         images = figure.children,
    //         n = images.length,
    //         gap = root.dataset.gap || 0,
    //         bfc = 'bfc' in root.dataset,
    //
    //         theta =  2 * Math.PI / n,
    //         currImage = 0
    //     ;
    //
    //     setupCarousel(n, parseFloat(getComputedStyle(images[0]).width));
    //     window.addEventListener('resize', () => {
    //         setupCarousel(n, parseFloat(getComputedStyle(images[0]).width))
    //     });
    //
    //     setupNavigation();
    //
    //     function setupCarousel(n, s) {
    //         var
    //             apothem = s / (2 * Math.tan(Math.PI / n))
    //         ;
    //
    //         figure.style.transformOrigin = `50% 50% ${- apothem}px`;
    //
    //         for (var i = 0; i < n; i++)
    //             images[i].style.padding = `${gap}px`;
    //         for (i = 1; i < n; i++) {
    //             images[i].style.transformOrigin = `50% 50% ${- apothem}px`;
    //             images[i].style.transform = `rotateY(${i * theta}rad)`;
    //         }
    //         if (bfc)
    //             for (i = 0; i < n; i++)
    //                 images[i].style.backfaceVisibility = 'hidden';
    //
    //         rotateCarousel(currImage);
    //     }
    //
    //     function setupNavigation() {
    //         nav.addEventListener('click', onClick, true);
    //
    //         function onClick(e) {
    //             e.stopPropagation();
    //
    //             var t = e.target;
    //             if (t.tagName.toUpperCase() != 'BUTTON')
    //                 return;
    //
    //             if (t.classList.contains('next')) {
    //                 currImage++;
    //             }
    //             else {
    //                 currImage--;
    //             }
    //
    //             rotateCarousel(currImage);
    //         }
    //
    //     }
    //
    //     function rotateCarousel(imageIndex) {
    //         figure.style.transform = `rotateY(${imageIndex * -theta}rad)`;
    //     }
    //
    // }

});