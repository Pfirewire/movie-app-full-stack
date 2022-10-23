$(function() {
    console.log("inside reviews.js");

    const MovieApp = {
        Urls: {
            backendPath: $("#base-url").text()
        },
        Divs: {
            reviewList: $("#reviews-div")
        }
    }

    const Get = {
        async reviews() {
            try {
                let reviewData = await fetch(`${MovieApp.Urls.backendPath}reviews/all`);
                let reviewList = await reviewData.json();
                console.log(reviewList);
                return reviewList
            } catch (err) {
                console.log(err);
            }
        }
    }

    const Print = {
        allReviews(promise) {

        },
        singleReview() {

        },
        test() {
            MovieApp.Divs.reviewList.html(`
                <h1 class="outlined">Testing</h1>
            `);
        }
    }

    Get.reviews();
    Print.test();

});