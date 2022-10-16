$(function() {

    const MovieApp = {
        GlobalURLs: {
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
    }

});