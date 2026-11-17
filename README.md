# backend-M01030673

CST3144 coursework. Student ID: M01030673.

This is the server for Lesson Shop, my online shop for lessons. I built it with Node.js and Express.js.

It gets the lessons from a MongoDB Atlas database and sends them to the frontend as JSON, serves the lesson pictures, saves every new order to the database and prints a summary of it to the console. It also holds the teachers and can send the lessons that one teacher teaches. It lets the frontend request the data from a different origin (CORS).

## Links

These are the four links the coursework brief asks for.

1. [Vue.js App] GitHub repository: https://github.com/LMGXENON/frontend-M01030673
2. [Vue.js App] GitHub Pages, the app runs from here: https://lmgxenon.github.io/frontend-M01030673/
3. [Express.js App] GitHub repository: https://github.com/LMGXENON/backend-M01030673
4. [Express.js App] render.com route that returns all the lessons: https://backend-m01030673.onrender.com/lessons

## API

| Method | Route | What it does |
|---|---|---|
| GET | /lessons | Returns all the lessons from the lessons collection in MongoDB as JSON. Each lesson has an id, subject, location, price, spaces, an image path and image alt text |
| POST | /orders | Saves the order from the frontend into the orders collection in MongoDB, prints a summary to the console and returns the result of the insert |
| PUT | /lessons/:_id | Updates any attribute of one lesson in the lessons collection, for example { "spaces": 7 }. The frontend uses it after an order to store the new number of spaces left |
| GET | /search/:query | Challenge task. Searches the lessons in every field at once (subject, location, price and spaces) and returns only the matches as JSON, for example /search/cook. It is not case sensitive |
| GET | /altlessons | Bonus task 8.4. Same as /lessons but only returns the lessons that still have spaces left, so the lessons with 0 spaces are left out |
| POST | /altorders | Bonus task 8.5. Saves the order like /orders, but if the phone number is already in the orders collection it refuses the order with a 409 and a message instead of saving it twice |
| GET | /enrolment/:lessonid | Returns how many spaces of that lesson have already been sold, as { "lessonId": 1, "enrolment": 3 }. It reads every order that contains the lesson and adds up the quantities |
| GET | /teachers | Challenge task. Returns all the teachers from the teachers collection. Each teacher has an id, a first name, a last name and the lesson id numbers they teach |
| GET | /teachers/:teacherid/lessons | Challenge task. Returns the lessons one teacher teaches as { "teacherId": 2, "lessons": [ ... ] }, for example /teachers/2/lessons. The lesson ids in the teacher document are used to find the lessons, so the lessons stay in one place. It returns a 404 if there is no teacher with that id, and a 400 if the id is not a number |
| GET | /images/filename.png | Returns that picture from the staticFiles folder, or an error message if the picture does not exist |

Any other request gets a 404 with the message Page not found. A logger middleware also prints the method and url of every request to the console.

## Database

The data is stored in MongoDB Atlas, in a database called `LessonShop` with three collections:

- `lessons` holds the 12 lessons
- `orders` holds one document for every order placed
- `teachers` holds one document for every teacher: an id, a first name, a last name and a `lessons` array with the id numbers of the lessons they teach

The connection string is not in the code. It is in a file called `.env`, which is in .gitignore so the username and password are never pushed to GitHub. There is one variable, and it holds the whole connection string:

```
MONGODB_URI="mongodb+srv://your_db_username:your_db_password@cluster0.xxxxx.mongodb.net/"
```

The connection to the database is checked when the server starts: it prints `You successfully connected to MongoDB!` if the database is reachable, and the error if it is not. The lesson data is inserted in the Atlas interface, by opening the lessons collection and using Insert Document. The teachers are added the same way, with the lesson id numbers typed into the `lessons` array of the teacher document.

If the variable is missing the server stops at startup and says so, instead of failing later with a connection error.

When the server is hosted on Render the same `MONGODB_URI` value is added in the Render dashboard as an environment variable, because .env is not on GitHub.

## Running the server

```
npm install
node server.js
```

The server runs on http://localhost:3001/ and prints every request to the console. The frontend fetches the lessons from here so start this first.

The port is not hard-coded. The server uses the `PORT` environment variable if there is one, and 3001 if there is not. Render sets `PORT` itself, so the same code runs on my computer and on Render without any changes.

## What I built it with

Node.js with Express.js, the cors middleware, the MongoDB Node.js driver and dotenv for the .env file. The data is stored in MongoDB Atlas.
