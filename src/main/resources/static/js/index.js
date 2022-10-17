$(function() {
    console.log("inside index.js");

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
            console.log(data);
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
            console.log("inside Carousel.initialize");
            let
                figure = carouselRoot.children("figure"),
                nav = carouselRoot.children("nav"),
                images = figure.children(),
                n = images.length,
                gap = carouselRoot.attr("gap") || 0,
                bfc = carouselRoot.attr("bfc"),
                theta = 2 * Math.PI / n,
                currImage = 0;

            console.log("right before first setupCarousel() call");
            setupCarousel(n, parseFloat($(images[0]).css("width")));
            window.addEventListener('resize', () => {
                setupCarousel(n, parseFloat(getComputedStyle(images[0]).width))
            });

            setupNavigation();

            function setupCarousel(n, s) {
                console.log("inside setupCarousel");
                let
                    apothem = s / (2 * Math.tan(Math.PI / n))
                ;

                console.log("line 77");
                figure.css("transform-origin", "50% 50% ${- apothem}px");

                console.log("line 80 before for loops");
                for (let i = 0; i < n; i++)
                    $(images[i]).css("padding", `${gap}px`);
                for (let i = 1; i < n; i++) {
                    $(images[i]).css("transform-origin", `50% 50% ${- apothem}px`);
                    $(images[i]).css("transform", `rotateY(${i * theta}rad)`);
                }
                for (let i = 0; i < n; i++)
                    $(images[i]).css("backface-visibility", "hidden");

                console.log("right before calling rotate");
                rotate(currImage);
            }

            function setupNavigation() {
                // nav.on('click', onClick);
                nav.children(".carousel-next").on("click", function() {
                    console.log("next");
                    currImage++;
                    rotate(currImage);
                });
                nav.children(".carousel-prev").on("click", function() {
                    console.log("prev");
                    currImage++;
                    rotate(currImage);
                });

                // function onClick(e) {
                //     console.log("inside nav click function");
                //     e.stopPropagation();
                //
                //     let t = e.target;
                //     if (t.tagName.toUpperCase() != 'BUTTON')
                //         return;
                //
                //     if (t.classList.contains('next')) {
                //         currImage++;
                //     }
                //     else {
                //         currImage--;
                //     }
                //
                //     rotate(currImage);
                // }
            }

            function rotate(imageIndex) {
                console.log("inside rotate");
                console.log("theta is: ");
                console.log(theta);
                console.log("currentImage is: ");
                console.log(currImage);
                console.log("imageIndex should be the same as currImage: ");
                console.log(imageIndex);
                figure.css("transform", `rotateY(${imageIndex * -theta}rad)`);
            }
        }
    }

    const Events = {
        initialize() {
            console.log("inside events.initialize");
            $(window).on("load", function() {
                let carousel = $(".carousel");
                console.log("before initializing carousel");
                Carousel.initialize(carousel);
                console.log("after initializing carousel");
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