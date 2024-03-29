// JS file to handle the filestack API service

import { Get } from "./utils.js";
import { Post } from "./utils.js";

$(async function() {
    console.log("Inside filestack.js");


    const FileStack = {
        async initialize() {
            console.log("inside initialize");
            this.client = await filestack.init(FILESTACK_KEY);
            Events.initialize();
        },
        client: null,
        options: {
            fromSources: ["local_file_system", "url"],
            accept: ["image/*"],
            transformations: {
                crop: false,
                circle: true,
                rotate: false,
                force: true
            },
            imageMax: [240, 240],
            onFileUploadFinished: async function(file) {
                console.log(file);
                let uploadedPicture = await Post.profilePicture(file, FileStack.csrfToken).then(res => res);
                console.log(uploadedPicture);
                $("#pic-div").append(`
                    <img src="${uploadedPicture.url}">
                `);
                $("#navbar-profile-image").parent().empty().append(`
                    <img id="navbar-profile-image" src="${uploadedPicture.url}" style="max-height: 1.75em; max-width: 1.75em;">
                `);
            }
        },
        csrfToken: $("meta[name='_csrf']").attr("content")
    };

    const Events = {
        initialize() {
            $(document).on("click", "#upload-profile-picture", function() {
                FileStack.client.picker(FileStack.options).open();
            });
        }
    }

    FileStack.initialize();

});