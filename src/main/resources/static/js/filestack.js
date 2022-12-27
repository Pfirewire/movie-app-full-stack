// JS file to handle the filestack API service

import { Get } from "./utils.js";
import { Post } from "./utils.js";

$(async function() {
    console.log("Inside filestack.js");


    const FileStack = {
        async initialize() {
            console.log("inside initialize");
            this.client = await filestack.init(this.filestackKey);
            Events.initialize();
        },
        client: null,
        options: {
            fromSources: ["local_file_system", "url"],
            accept: ["image/*"],
            transformations: {
                crop: false,
                circle: true,
                rotate: false
            },
            onFileUploadFinished: async function(file) {
                console.log(file);
                let uploadedPicture = await Post.profilePicture(file).then(res => res);
                console.log(uploadedPicture);
            }
        },
        filestackKey: await Get.filestackKey().then(res => res)
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