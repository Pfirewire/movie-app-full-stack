$(function() {
    console.log("inside reviews.js");

    const MovieApp = {
        Urls: {
            backendPath: $("#base-url").text()
        },
        Divs: {
            reviewList: $("#reviews-div")
        },
        initialize() {
            if($("title").text().includes("My")) {
                Print.allReviews(Get.userReviews());
            } else {
                Print.allReviews(Get.allReviews());
            }
        }
    }

    const Get = {
        async allReviews() {
            try {
                let reviewData = await fetch(`${MovieApp.Urls.backendPath}reviews/all`);
                let reviewList = await reviewData.json();
                console.log(reviewList);
                return reviewList
            } catch (err) {
                console.log(err);
            }
        },
        async userReviews() {
            try {
                let reviewData = await fetch(`${MovieApp.Urls.backendPath}reviews/user`);
                let reviewList = await reviewData.json();
                return reviewList
            } catch (err) {
                console.log(err);
            }
        },
        async movieById(id) {
            try {
                let movieData = await fetch(`${MovieApp.Urls.backendPath}movie/${id}`);
                let movie = await movieData.json();
                return movie;
            } catch(err) {
                console.log(err);
            }
        },
        async movieRating(id) {
            let response = await fetch(`${MovieApp.Urls.backendPath}rating/${id}`);
            let data = await response.json();
            return data;
        }
    }

    const Print = {
        async allReviews(promise) {
            await promise.then(reviewData => {
                reviewData.forEach(async function(review) {
                    let rating = await Get.movieRating(review.movie.id);
                    // let rating = await ratingData.then(res => res);
                    .singleReview(review, rating, MovieApp.Divs.reviewList);
                });
            });
        },
        async singleReview(review, rating, div) {
            let html = await Print.modalRating(review.movie);
            div.append(`
                <div class="review-wrapper container bg-dark text-light rounded-3">
                    <div class="review-img">
                        <div>${html}</div>
                        <img src="${review.movie.poster}">
                    </div>
                    <div class="review-content">
                        <h3>${review.title}</h3>
                        <p>${review.body}</p>
                    </div>
                </div>
            `);
        },
        async modalRating(movie) {
            // get rating for movie
            let ratingData = await Get.movieRating(movie.id);
            let rating = ratingData.value;
            let html = "";
            if(rating < 0) {
                for(let i = 1; i < 6; i++) {
                    html += (`
                        <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            } else {
                for(let i = 1; i <= rating; i++) {
                    html += (`
                        <i class="bi bi-star-fill px-1 fs-1 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
                for(let i = rating + 1; i < 6; i++) {
                    html += (`
                        <i class="bi bi-star px-1 fs-3 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            }
            return html;
        },

    }


    MovieApp.initialize();

});