// JS file to handle the filestack API service

import { Get } from "./utils.js";

$(async function() {
    console.log("Inside filestack.js");


    const FileStack = {
        initialize() {
            console.log("inside initialize");
            const client = filestack.init(this.filestackKey);
            client.picker().open();
        },
        filestackKey: await Get.filestackKey().then(res => res)
    };

    FileStack.initialize();

});