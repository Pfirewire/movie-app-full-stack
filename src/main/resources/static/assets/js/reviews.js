import { Get } from "./utils.js";

$(function() {
    const MovieReviews = {
        Urls: {
            backendPath: $("#base-url").text()
        },
        Divs: {
            reviewList: $("#reviews-div")
        },
        initialize() {
            if($("title").text().includes("My")) {
                Print.allReviews(Get.userReviews(MovieReviews.Urls.backendPath));
            } else {
                Print.allReviews(Get.allReviews(MovieReviews.Urls.backendPath));
            }
        }
    }
    
    const Print = {
        async allReviews(promise) {
            await promise.then(reviewData => {
                reviewData.forEach(async function(review) {
                    let rating = await Get.movieRatingWithUserId(MovieReviews.Urls.backendPath, review.movie.id, review.user.id);
                    // let rating = await ratingData.then(res => res);
                    Print.singleReview(review, rating, MovieReviews.Divs.reviewList);
                });
            });
        },
        async singleReview(review, rating, div) {
            let html = await Print.modalRating(review.movie, rating.value);
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
        async modalRating(movie, rating) {
            let html = "";
            if(rating < 0) {
                for(let i = 1; i < 6; i++) {
                    html += (`
                        <i class="bi bi-star px-1 fs-4 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            } else {
                for(let i = 1; i <= rating; i++) {
                    html += (`
                        <i class="bi bi-star-fill px-1 fs-4 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
                for(let i = rating + 1; i < 6; i++) {
                    html += (`
                        <i class="bi bi-star px-1 fs-4 modal-rating-star modal-rating-${i}" data-rating-star="${i}" data-movie-id="${movie.id}"></i>
                    `);
                }
            }
            return html;
        },

    }


    MovieReviews.initialize();

});