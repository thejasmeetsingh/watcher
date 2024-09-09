const express = require("express");
const logger = require("morgan");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  logger(":remote-addr :remote-user :method :url :status - :response-time ms")
);
app.use(express.json());

app.get("/health-check/", async (req, res) => {
  res.status(200).json({
    message: "ToDo service up & running",
  });
});

app.listen(port, async () => {
  console.log(`Server is up on port: ${port}`);
});
