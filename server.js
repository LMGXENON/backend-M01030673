var express = require("express");
var cors = require("cors");
var path = require("path");
// loads the MongoDB connection details from .env into process.env
require("dotenv").config({ path: "./.env" });
const { MongoClient, ObjectId } = require("mongodb");

var app = express();

app.use(cors());
app.use(express.json());

// logger middleware: records the type and url of every incoming request
app.use(function (request, response, next) {
    console.log("Incoming " + request.method + " request to: " + request.url);
    next();
});

// MongoDB connection setup: the whole connection string is in MONGODB_URI in .env,
// so the username and password are never in the code or on GitHub.
const uri = (process.env.MONGODB_URI || "").trim();

if (!uri) {
    console.log("MONGODB_URI is not set. Put your Atlas connection string in .env,"
        + " for example mongodb+srv://user:password@cluster0.xxxxx.mongodb.net/");
    process.exit(1);
}
const client = new MongoClient(uri);
const db = client.db("LessonShop");

client.connect()
    .then(function () {
        console.log("You successfully connected to MongoDB!");
    })
    .catch(function (err) {
        console.log("Could not connect to MongoDB. Check the MONGODB_ values in .env,"
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

// bonus task 8.4: GET route that only returns the lessons that still have spaces left
app.get("/altlessons", async function (request, response) {
    let collection = await db.collection("lessons");
    let results = await collection.find({ spaces: { $gt: 0 } }).toArray();
    response.send(results);
});

// challenge task: GET route that searches the lessons in every field at once
app.get("/search/:query", async function (request, response) {
    let searchText = request.params.query.toLowerCase();
    let collection = await db.collection("lessons");
    let lessons = await collection.find({}).toArray();

    // price is a number, so it is turned into text before comparing
    // only the start of each field counts, so typing "a" finds Art but not Drama in Camden
    let results = lessons.filter(function (lesson) {
        return String(lesson.subject).toLowerCase().startsWith(searchText)
            || String(lesson.location).toLowerCase().startsWith(searchText)
            || String(lesson.price).startsWith(searchText);
    });

    console.log("Search for " + searchText + " found " + results.length + " lessons");
    response.send(results);
});

// challenge task: GET route that returns all the teachers from the database as JSON
app.get("/teachers", async function (request, response) {
    let collection = await db.collection("teachers");
    let results = await collection.find({}).toArray();
    response.send(results);
});

// challenge task: GET route that returns the lessons one teacher teaches
app.get("/teachers/:teacherid/lessons", async function (request, response) {
    let teacherId = Number(request.params.teacherid);

    if (isNaN(teacherId)) {
        response.status(400).send("The teacher id must be a number");
    } else {
        let teacherCollection = await db.collection("teachers");
        let teacher = await teacherCollection.findOne({ id: teacherId });

        if (!teacher) {
            response.status(404).send("Teacher not found");
        } else {
            // the teacher document only stores the lesson id numbers, so the
            // lesson details are read from the lessons collection with $in
            let lessonCollection = await db.collection("lessons");
            let lessons = await lessonCollection.find({ id: { $in: teacher.lessons } }).sort({ id: 1 }).toArray();
            response.send({ teacherId: teacherId, lessons: lessons });
        }
    }
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

// bonus task 8.5: POST route that only saves the order if the phone number is new
app.post("/altorders", async function (request, response) {
    var body = request.body;
    let collection = await db.collection("orders");
    let existingOrder = await collection.findOne({ phone: body.phone });

    if (existingOrder) {
        console.log("Order not saved, this phone number is already used: " + body.phone);
        response.status(409).send("This phone number already has an order");
    } else {
        let result = await collection.insertOne(body);
        console.log("Order saved for: " + body.phone);
        response.send(result);
    }
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

// challenge task: GET route that returns how many spaces of one lesson have been sold so far
app.get("/enrolment/:lessonid", async function (request, response) {
    let lessonId = Number(request.params.lessonid);

    if (isNaN(lessonId)) {
        response.status(400).send("The lesson id must be a number");
    } else {
        let collection = await db.collection("orders");
        let orders = await collection.find({ "lessons.id": lessonId }).toArray();

        // add up the quantity of this lesson in every order that has it
        let enrolment = 0;
        for (const order of orders) {
            for (const entry of order.lessons) {
                if (entry.id === lessonId) {
                    enrolment += entry.quantity;
                }
            }
        }

        response.send({ lessonId: lessonId, enrolment: enrolment });
    }
});

// final middleware: returns a 404 error for any unrecognised request
app.use(function (request, response, next) {
    response.status(404).send("Page not found!");
});

// Render decides the port when the server is hosted, so the port number comes from
// the PORT environment variable if there is one, and 3001 is used when running locally
const port = process.env.PORT || 3001;

app.listen(port, function () {
    console.log("App started on port " + port);
});
