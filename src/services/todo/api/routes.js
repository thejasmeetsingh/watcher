const express = require("express");
const { v4: uuidv4, validate: validateUUID } = require("uuid");

const db = require("../db/config");

const router = express.Router();
const Todo = () => db("todo");

router.get("/health-check", async (req, res) => {
  res
    .status(200)
    .json({
      message: "ToDo service up & running",
    })
    .end();
});

router.get("/list", async (req, res) => {
  const items = await Todo()
    .select()
    .orderBy([
      { column: "is_completed", order: "desc" },
      { column: "created_at", order: "desc" },
    ]);

  res
    .status(200)
    .json({
      message: null,
      results: items,
    })
    .end();
});

router.post("/add", async (req, res) => {
  const movieID = req.body.movie_id;
  let error = null;

  // Check if movieID is present in request data
  if (!movieID) {
    error = "movie_id is required";
  }

  // Check if the movieID is a valid UUID or not
  if (movieID && !validateUUID(movieID)) {
    error = "Invalid movie_id";
  }

  if (error) {
    return res
      .status(400)
      .json({
        message: error,
        data: null,
      })
      .end();
  }

  try {
    // Add item into the DB
    const [item] = await Todo()
      .insert({
        movie_id: movieID,
        user_id: uuidv4(), // This is just temporary, It will be replaced by user actual ID
      })
      .returning("*");

    res
      .status(201)
      .json({
        message: "Added successfully",
        data: item,
      })
      .end();
  } catch (error) {
    // Return DB error response
    res
      .status(500)
      .json({
        message: error.message,
        data: null,
      })
      .end();
  }
});

router.put("/update/:id", async (req, res) => {});

router.delete("/delete/:id", async (req, res) => {});

module.exports = router;