import { Get } from "./utils.js";

$(function() {

    const SiteBar = {
        initialize() {
            Events.initialize();
            Print.profilePicture();
        }
    };

    const Print = {
        async profilePicture() {
            // Prints user profile picture on sitebar
            let picture = await Get.profilePicture().then(res => res);
            if(picture.id === -1) {
                console.log("User anonymous")

            } else {
                console.log(picture);
            }
        }
    };

    const Events = {
        initialize() {
            // On logout click link, submits logout form to log user out
            $("#site-bar-logout-link").on("click", function() {
                $("#site-bar-logout-form").submit();
            });
        }
    };

    SiteBar.initialize();
});