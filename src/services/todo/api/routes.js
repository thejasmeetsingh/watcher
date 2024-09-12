const express = require("express");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4, validate: validateUUID } = require("uuid");

const db = require("../db/config");
const jwtAuth = require("./middleware");
const { listResponse, successResponse, errorResponse } = require("./response");

const router = express.Router();
const Todo = () => db("todo");

// Add middleware to the router
router.use(jwtAuth);

// Columns which will be return as part of the response
const columns = ["id", "created_at", "modified_at", "movie_id", "is_completed"];

// Get list of items added by the user
router.get("/list", async (req, res) => {
  const items = await Todo()
    .select(columns)
    .where({ user_id: req.userID })
    .orderBy([
      { column: "is_completed", order: "desc" },
      { column: "created_at", order: "desc" },
    ]);

  return listResponse(res, { results: items });
});

// Add an item into DB and associate it with current user
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
    return errorResponse(res, { message: error });
  }

  try {
    // Add item into the DB
    const [item] = await Todo()
      .insert({
        movie_id: movieID,
        user_id: req.userID,
      })
      .returning(columns);

    return successResponse(res, {
      message: "Item added successfully",
      data: item,
      code: StatusCodes.CREATED,
    });
  } catch (error) {
    // Return DB error response
    return errorResponse(res, {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});

// Update the item added by current user and mark it as complete or incomplete
router.put("/update/:id", async (req, res) => {
  const itemID = req.params.id;
  const isCompleted = req.body.is_completed;

  // Validate the itemID format
  if (!validateUUID(itemID)) {
    return errorResponse(res, { message: "Invalid item_id" });
  }

  // Check if isCompleted key have a valid boolean value
  if (typeof isCompleted !== "boolean") {
    return errorResponse(res, { message: "Invalid boolean value" });
  }

  try {
    // Check if the item exists with the given ID
    let item = await Todo().where({ id: itemID, user_id: req.userID }).first();

    if (!item) {
      return errorResponse(res, {
        message: "Item does not exists",
        code: StatusCodes.NOT_FOUND,
      });
    }

    // Update the item in DB
    [item] = await Todo()
      .where({ id: itemID, user_id: req.userID })
      .update({ is_completed: isCompleted })
      .returning(columns);

    return successResponse(res, {
      message: "Updated successfully",
      data: item,
    });
  } catch (error) {
    // Return DB error response
    return errorResponse(res, {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});

// Delete an item which is added by current user
router.delete("/delete/:id", async (req, res) => {
  const itemID = req.params.id;

  // Validate the itemID format
  if (!validateUUID(itemID)) {
    return errorResponse(res, { message: "Invalid item_id" });
  }

  try {
    // Check if the item exists with the given ID
    let item = await Todo().where({ id: itemID, user_id: req.userID }).first();

    if (!item) {
      return errorResponse(res, {
        message: "Item does not exists",
        code: StatusCodes.NOT_FOUND,
      });
    }

    // Delete the item from DB
    await Todo().where({ id: itemID, user_id: req.userID }).del();

    return successResponse(res, { message: "Deleted successfully" });
  } catch (error) {
    // Return DB error response
    return errorResponse(res, {
      message: error.message,
      code: StatusCodes.INTERNAL_SERVER_ERROR,
    });
  }
});

module.exports = router;
