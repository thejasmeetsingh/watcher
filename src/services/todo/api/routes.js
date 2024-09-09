const express = require("express");

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

router.post("/add", async (req, res) => {});
router.put("/complete/:id", async (req, res) => {});
router.delete("/delete/:id", async (req, res) => {});

module.exports = router;
