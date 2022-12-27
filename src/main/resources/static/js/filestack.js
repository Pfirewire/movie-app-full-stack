// JS file to handle the filestack API service

import { Get } from "./utils.js";

$(async function() {
    console.log("Inside filestack.js");


    const FileStack = {
        initialize() {
            console.log("inside initialize");
            const client = filestack.init(this.filestackKey);
            Events.initialize();
        },
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

            }
        },
        filestackKey: await Get.filestackKey().then(res => res)
    };

    const Events = {
        initialize() {
            $(document).on("click", "#upload-profile-picture", function() {
                client.picker(FileStack.options).open();
            });
        }
    }

    FileStack.initialize();

});