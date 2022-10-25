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
                Get.userReviews();
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
            let movie = await Get.movieById(review.movie).then(res => res);
            console.log(movie);
            div.append(`
                <div class="review-wrapper container bg-dark text-light rounded-3">
                    <div class="review-img">
                        <img src="${movie.poster}">
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