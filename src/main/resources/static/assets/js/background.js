import { Get } from "./utils.js";

$(function() {

    console.log("Inside background.js");

    const Background = {
        backendURLPath: $("#base-url").text(),
        async getUnsplashKey() {
            let keys = await fetch(`${Background.backendURLPath}keys`).then(res => res.json());
            console.log(keys);
        }
    }

    Background.getUnsplashKey();

});