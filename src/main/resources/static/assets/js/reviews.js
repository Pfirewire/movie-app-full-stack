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
            let response = await fetch(`${MovieApp.GlobalURLs.backendURLPath}rating/${id}`);
            let data = await response.json();
            return data;
        }
    }

    const Print = {
        async allReviews(promise) {
            await promise.then(reviewData => {
                reviewData.forEach(review => {
                    Print.singleReview(review, MovieApp.Divs.reviewList);
                });
            });
        },
        async singleReview(review, div) {
            div.append(`
                <div class="review-wrapper container bg-dark text-light rounded-3">
                    <div class="review-img">
                        <img src="${review.movie.poster}">
                    </div>
                    <div class="review-content">
                        <h3>${review.title}</h3>
                        <p>${review.body}</p>
                    </div>
                </div>
            `);
        }
    }


    MovieApp.initialize();

});