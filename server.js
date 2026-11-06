var express = require("express");
var cors = require("cors");
var path = require("path");
// loads the MongoDB connection details from config.env into process.env
require("dotenv").config({ path: "./config.env" });
const { MongoClient, ObjectId } = require("mongodb");

var app = express();

app.use(cors());
app.use(express.json());

// logger middleware: records the type and url of every incoming request
app.use(function (request, response, next) {
    console.log("Incoming " + request.method + " request to: " + request.url);
    next();
});

// MongoDB connection setup: the four parts of the connection string come from
// config.env, so the username and password are never in the code or on GitHub
const uri = process.env.MONGODB_PREFIX
    + process.env.MONGODB_USERNAME + ":"
    + process.env.MONGODB_PASSWORD
    + process.env.MONGODB_URL;
const client = new MongoClient(uri);
const db = client.db("LessonShop");

client.connect()
    .then(function () {
        console.log("You successfully connected to MongoDB!");
    })
    .catch(function (err) {
        console.log("Could not connect to MongoDB. Check the MONGODB_ values in config.env,"
            + " and check your IP address is in the Atlas IP Access List.");
        console.dir(err);
    });

// static file middleware: serves the lesson images from the staticFiles folder
var publicPath = path.resolve(__dirname, "staticFiles");
app.use("/images", express.static(publicPath));

// if the image file does not exist, return an error message
app.use("/images", function (request, response) {
    response.status(404).send("Image not found!");
});

// GET route that returns all the lessons from the database as JSON
app.get("/lessons", async function (request, response) {
    let collection = await db.collection("lessons");
    let results = await collection.find({}).toArray();
    response.send(results);
});

// POST route that saves a new order into the Orders collection
app.post("/orders", async function (request, response) {
    var body = request.body;
    var orderLessons = body.lessons || [];
    console.log("Order received"
        + "\nName: " + body.name
        + "\nPhone: " + body.phone
        + "\nLessons: " + orderLessons.map(function (entry) {
            return entry.id + " x" + entry.quantity;
        }).join(", "));
    let collection = await db.collection("orders");
    let result = await collection.insertOne(body);
    response.send(result);
});

// PUT route that updates any attribute of one lesson in the database.
// The front-end uses it after an order to store the new number of spaces.
app.put("/lessons/:_id", async function (request, response) {
    let collection = await db.collection("lessons");
    let tempid = request.params._id;

    const query = { _id: new ObjectId(tempid) };
    const updates = {
        $set: request.body
    };
    let result = await collection.updateOne(query, updates);
    console.log(result);
    response.send(result);
});

// final middleware: returns a 404 error for any unrecognised request
app.use(function (request, response, next) {
    response.status(404).send("Page not found!");
});

app.listen(3001, function () {
    console.log("App started on port 3001");
});
