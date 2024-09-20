import express, { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { validate } from "uuid";

import { db } from "@db/config";
import { jwtAuth } from "@api/middleware";

const router = express.Router();
const Todo = () => db("todo");

// Add middleware to the router
router.use(jwtAuth);

// Columns which will be return as part of the response
const columns = ["id", "created_at", "modified_at", "movie_id", "is_completed"];

// Get list of items added by the user
router.get("/list", async (req: Request, res: Response) => {
  const items = await Todo()
    .select(columns)
    .where({ user_id: req.userID })
    .orderBy([
      { column: "is_completed", order: "desc" },
      { column: "created_at", order: "desc" },
    ]);

  return res
    .status(StatusCodes.OK)
    .json({
      message: null,
      results: items,
    })
    .end();
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
  if (movieID && !validate(movieID)) {
    error = "Invalid movie_id";
  }

  if (error) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: error,
      })
      .end();
  }

  try {
    // Add item into the DB
    const [item] = await Todo()
      .insert({
        movie_id: movieID,
        user_id: req.userID,
      })
      .returning(columns);

    return res
      .status(StatusCodes.CREATED)
      .json({
        message: "Item added successfully",
        data: item,
      })
      .end();
  } catch (error: any) {
    // Return DB error response
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
      })
      .end();
  }
});

// Update the item added by current user and mark it as complete or incomplete
router.put("/update/:id", async (req, res) => {
  const itemID = req.params.id;
  const isCompleted = req.body.is_completed;

  // Validate the itemID format
  if (!validate(itemID)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "Invalid item_id",
      })
      .end();
  }

  // Check if isCompleted key have a valid boolean value
  if (typeof isCompleted !== "boolean") {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "Invalid boolean value",
      })
      .end();
  }

  try {
    // Check if the item exists with the given ID
    let item = await Todo().where({ id: itemID, user_id: req.userID }).first();

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          message: "Item does not exists",
        })
        .end();
    }

    // Update the item in DB
    [item] = await Todo()
      .where({ id: itemID, user_id: req.userID })
      .update({ is_completed: isCompleted })
      .returning(columns);

    return res
      .status(StatusCodes.OK)
      .json({
        message: "Updated successfully",
        data: item,
      })
      .end();
  } catch (error: any) {
    // Return DB error response
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
      })
      .end();
  }
});

// Delete an item which is added by current user
router.delete("/delete/:id", async (req, res) => {
  const itemID = req.params.id;

  // Validate the itemID format
  if (!validate(itemID)) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({
        message: "Invalid item_id",
      })
      .end();
  }

  try {
    // Check if the item exists with the given ID
    let item = await Todo().where({ id: itemID, user_id: req.userID }).first();

    if (!item) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({
          message: "Item does not exists",
        })
        .end();
    }

    // Delete the item from DB
    await Todo().where({ id: itemID, user_id: req.userID }).del();

    return res
      .status(StatusCodes.OK)
      .json({
        message: "Deleted successfully",
      })
      .end();
  } catch (error: any) {
    // Return DB error response
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({
        message: error.message,
      })
      .end();
  }
});

export { router };
