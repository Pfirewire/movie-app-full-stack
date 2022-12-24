// JS file to handle the filestack API service

import { Get } from "./utils.js";

$(async function() {
    console.log("Inside filestack.js");


    const FileStack = {
        initialize() {
            console.log("inside initialize");
            const client = filestack.init(this.filestackKey);
            const options = {
                fromSources: ["local_file_system", "url"],
                accept: ["image/*"],
                transformations: {
                    crop: false,
                    circle: true,
                    rotate: false
                }
            }
            client.picker(options).open();
        },
        filestackKey: await Get.filestackKey().then(res => res)
    };

    FileStack.initialize();

});