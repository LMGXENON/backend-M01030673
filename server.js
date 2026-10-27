var express = require("express");
var cors = require("cors");
var path = require("path");
var app = express();

app.use(cors());
app.use(express.json());

// logger middleware: records the type and url of every incoming request
app.use(function (request, response, next) {
    console.log("Incoming " + request.method + " request to: " + request.url);
    next();
});

var lessons = [
    { id: 1, subject: "Maths", location: "Hendon", price: 100, spaces: 12, image: "images/maths.png", imageAlt: "Maths lesson" },
    { id: 2, subject: "English", location: "Westminster", price: 80, spaces: 8, image: "images/english.png", imageAlt: "English lesson" },
    { id: 3, subject: "Science", location: "Wembley", price: 90, spaces: 5, image: "images/science.png", imageAlt: "Science lesson" },
    { id: 4, subject: "Art", location: "Stratford", price: 95, spaces: 10, image: "images/art.png", imageAlt: "Art lesson" },
    { id: 5, subject: "Music", location: "Knightsbridge", price: 120, spaces: 3, image: "images/music.png", imageAlt: "Music lesson" },
    { id: 6, subject: "Drama", location: "Camden", price: 85, spaces: 7, image: "images/drama.png", imageAlt: "Drama lesson" },
    { id: 7, subject: "French", location: "Shoreditch", price: 110, spaces: 4, image: "images/french.png", imageAlt: "French lesson" },
    { id: 8, subject: "Computing", location: "Islington", price: 105, spaces: 9, image: "images/computing.png", imageAlt: "Computing lesson" },
    { id: 9, subject: "History", location: "Greenwich", price: 75, spaces: 15, image: "images/history.png", imageAlt: "History lesson" },
    { id: 10, subject: "Geography", location: "Clapham", price: 90, spaces: 6, image: "images/geography.png", imageAlt: "Geography lesson" },
    { id: 11, subject: "Sports", location: "Brixton", price: 70, spaces: 11, image: "images/sports.png", imageAlt: "Sports lesson" },
    { id: 12, subject: "Cooking", location: "Hackney", price: 115, spaces: 2, image: "images/cooking.png", imageAlt: "Cooking lesson" }
];

// static file middleware: serves the lesson images from the staticFiles folder
var publicPath = path.resolve(__dirname, "staticFiles");
app.use("/images", express.static(publicPath));

// if the image file does not exist, return an error message
app.use("/images", function (request, response) {
    response.status(404).send("Image not found!");
});

// GET route that returns all the lessons as JSON
app.get("/lessons", function (request, response) {
    response.json(lessons);
});

// POST route that takes a new order and writes a summary to the console
app.post("/orders", function (request, response) {
    var body = request.body;
    var orderLessons = body.lessons || [];
    console.log("Order received"
        + "\nName: " + body.name
        + "\nPhone: " + body.phone
        + "\nLessons: " + orderLessons.map(function (entry) {
            return entry.id + " x" + entry.quantity;
        }).join(", "));
    response.json({ message: "Order received!" });
});

// final middleware: returns a 404 error for any unrecognised request
app.use(function (request, response, next) {
    response.status(404).send("Page not found!");
});

app.listen(3001, function () {
    console.log("App started on port 3001");
});
