# backend-M01030673

CST3144 coursework. Student ID: M01030673.

This is the server for Lesson Shop, my online shop for lessons. I built it with Node.js and Express.js.

It gets the lessons from a MongoDB Atlas database and sends them to the frontend as JSON, serves the lesson pictures, saves every new order to the database and prints a summary of it to the console. It lets the frontend request the data from a different origin (CORS).

## Links

These are the four links the coursework brief asks for.

1. [Vue.js App] GitHub repository: https://github.com/LMGXENON/frontend-M01030673
2. [Vue.js App] GitHub Pages, the app runs from here: https://lmgxenon.github.io/frontend-M01030673/
3. [Express.js App] GitHub repository: https://github.com/LMGXENON/backend-M01030673
4. [Express.js App] render.com route that returns all the lessons: https://backend-m01030673.onrender.com/

## API

| Method | Route | What it does |
|---|---|---|
| GET | /lessons | Returns all the lessons from the lessons collection in MongoDB as JSON. Each lesson has an id, subject, location, price, spaces, an image path and image alt text |
| POST | /orders | Saves the order from the frontend into the orders collection in MongoDB, prints a summary to the console and returns the result of the insert |
| PUT | /lessons/:_id | Updates any attribute of one lesson in the lessons collection, for example { "spaces": 7 }. The frontend uses it after an order to store the new number of spaces left |
| GET | /images/filename.png | Returns that picture from the staticFiles folder, or an error message if the picture does not exist |

Any other request gets a 404 with the message Page not found. A logger middleware also prints the method and url of every request to the console.

## Database

The data is stored in MongoDB Atlas, in a database called `LessonShop` with two collections:

- `lessons` holds the 12 lessons
- `orders` holds one document for every order placed

The connection details are not in the code. They are in a file called `.env`, which is in .gitignore so the username and password are never pushed to GitHub:

```
MONGODB_PREFIX="mongodb+srv://"
MONGODB_USERNAME="your_db_username"
MONGODB_PASSWORD="your_db_password"
MONGODB_URL="@yourcluster.xxxxx.mongodb.net/"
```

The connection to the database is checked when the server starts: it prints `You successfully connected to MongoDB!` if the database is reachable, and the error if it is not. The lesson data is inserted in the Atlas interface, by opening the lessons collection and using Insert Document.

When the server is hosted on Render the same four values are added in the Render dashboard as environment variables, because .env is not on GitHub.

If you would rather not keep the parts separate, set a single `MONGODB_URI` variable with the whole connection string instead, for example `mongodb+srv://user:pass@cluster.xxxxx.mongodb.net/`. When `MONGODB_URI` is set it is used on its own and the four parts are ignored.

## Running the server

```
npm install
node server.js
```

The server runs on http://localhost:3001/ and prints every request to the console. The frontend fetches the lessons from here so start this first.

## What I built it with

Node.js with Express.js, the cors middleware, the MongoDB Node.js driver and dotenv for the .env file. The data is stored in MongoDB Atlas.
