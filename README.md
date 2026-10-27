# backend-M01030673

CST3144 coursework. Student ID: M01030673.

This is the server for Lesson Shop, my online shop for lessons. I built it with Node.js and Express.js.

It sends the lessons to the frontend as JSON and lets the frontend request the data from a different origin (CORS).

## Links

These are the four links the coursework brief asks for.

1. [Vue.js App] GitHub repository: https://github.com/LMGXENON/frontend-M01030673
2. [Vue.js App] GitHub Pages, the app runs from here: https://lmgxenon.github.io/frontend-M01030673/
3. [Express.js App] GitHub repository: https://github.com/LMGXENON/backend-M01030673
4. [Express.js App] render.com route that returns all the lessons: https://backend-m01030673.onrender.com/

## API

| Method | Route | What it returns |
|---|---|---|
| GET | / | All 12 lessons as JSON. Each lesson has an id, subject, location, price, spaces, an image path and image alt text |

## Running the server

```
npm install
node server.js
```

The server runs on http://localhost:3001/ and prints every request to the console. The frontend fetches the lessons from here so start this first.

## What I built it with

Node.js with Express.js and the cors middleware.
