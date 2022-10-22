$(function() {

    const MovieApp = {
        Urls: {
            backendPath: $("#base-url").text()
        },
        Divs: {
            reviewList: $("#reviews-div");
        }
    }

    const Get = {
        async reviews() {
            try {
                let reviewData = await fetch(`${MovieApp.Urls.backendPath}reviews/all`);
                let reviewList = await reviewData.json();
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

        }
    }

});