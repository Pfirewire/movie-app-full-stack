import { Get } from "./utils.js";

$(function() {

    const Background = {
        backendURLPath: $("#base-url").text(),
        async initialize() {
            let unsplashKey = await Get.unsplashKey(this.backendURLPath);
            let photo = await Get.backgroundImage(unsplashKey);
            $('head').append(`
                <style>
                    body:before{
                        content: "";
                        display: block;
                        position: fixed;
                        left: 0;
                        top: 0;
                        width: 100%;
                        height: 100%;
                        z-index: -100;
                        background: url('${photo.urls.regular}') no-repeat center center;
                        -webkit-background-size: cover;
                        -moz-background-size: cover;
                        -o-background-size: cover;
                        background-size: cover;
                    }
                </style>
            `);
        }
    }

    Background.initialize();

});