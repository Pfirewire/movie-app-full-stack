$(function() {
    console.log("Inside sitebar.js");
    $("#site-bar-logout-link").on("click", function() {
        $("#site-bar-logout-form").submit();
    });
});