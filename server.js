var express = require("express");
var app = express();

app.use(function (request, response) {
    console.log("In comes a request to: " + request.url);
    response.end("Hello, world!");
});

app.listen(3001, function () {
    console.log("App started on port 3001");
});
