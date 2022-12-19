import {Utils} from "./utils";

$(function() {
    const MovieApp = {
    };

    const Get = {
        async movieRating(movieId, userId) {
            let response = await fetch(`${Utils.url()}rating/${movieId}/${userId}`);
            let data = await response.json();
            return data;
        }
    };

});