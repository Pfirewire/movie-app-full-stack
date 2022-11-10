$(function() {
    console.log("Inside review-form.js");

    const MovieApp = {
        Urls: {
            backendPath: $("#base-url").text()
        }
    };

    const Get = {
        async movieRating(movieId, userId) {
            console.log(userId);
            let response = await fetch(`${MovieApp.Urls.backendPath}rating/${movieId}/${userId}`);
            let data = await response.json();
            return data;
        }
    };

});