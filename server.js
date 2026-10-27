var express = require("express");
var cors = require("cors");
var app = express();

app.use(cors());

var lessons = [
    { id: 1, subject: "Maths", location: "Hendon", price: 100, spaces: 5, image: "images/maths.png", imageAlt: "Maths lesson" },
    { id: 2, subject: "English", location: "Westminster", price: 80, spaces: 5, image: "images/english.png", imageAlt: "English lesson" },
    { id: 3, subject: "Science", location: "Wembley", price: 90, spaces: 5, image: "images/science.png", imageAlt: "Science lesson" },
    { id: 4, subject: "Art", location: "Stratford", price: 95, spaces: 5, image: "images/art.png", imageAlt: "Art lesson" },
    { id: 5, subject: "Music", location: "Knightsbridge", price: 120, spaces: 5, image: "images/music.png", imageAlt: "Music lesson" },
    { id: 6, subject: "Drama", location: "Camden", price: 85, spaces: 5, image: "images/drama.png", imageAlt: "Drama lesson" },
    { id: 7, subject: "French", location: "Shoreditch", price: 110, spaces: 5, image: "images/french.png", imageAlt: "French lesson" },
    { id: 8, subject: "Computing", location: "Islington", price: 105, spaces: 5, image: "images/computing.png", imageAlt: "Computing lesson" },
    { id: 9, subject: "History", location: "Greenwich", price: 75, spaces: 5, image: "images/history.png", imageAlt: "History lesson" },
    { id: 10, subject: "Geography", location: "Clapham", price: 90, spaces: 5, image: "images/geography.png", imageAlt: "Geography lesson" },
    { id: 11, subject: "Sports", location: "Brixton", price: 70, spaces: 5, image: "images/sports.png", imageAlt: "Sports lesson" },
    { id: 12, subject: "Cooking", location: "Hackney", price: 115, spaces: 5, image: "images/cooking.png", imageAlt: "Cooking lesson" }
];

app.use(function (request, response) {
    console.log("In comes a request to: " + request.url);
    response.json(lessons);
});

app.listen(3001, function () {
    console.log("App started on port 3001");
});
