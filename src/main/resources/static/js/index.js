$(function() {
    console.log("inside index.js");

    const MovieApp = {
        GlobalURLs: {
            tmdbTrendingUrl: "https://api.themoviedb.org/3/trending/movie/week",
            backendURLPath: $("#base-url").text()
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
            return data;
        }
    }

    Get.trendingMovies();

});