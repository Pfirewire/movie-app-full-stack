import { Get } from "./utils.js";

$(function() {

    const Background = {
        async initialize() {
            let photo = await Get.backgroundImage(UNSPLASH_KEY);
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