const express = require("express");
const logger = require("morgan");

const router = require("./api/routes");

const app = express();
const port = process.env.PORT || 3000;

app.use(
  logger(":remote-addr :remote-user :method :url :status - :response-time ms")
);
app.use(express.json());
app.use("/api", router);

const server = app.listen(port, async () => {
  console.log(`Server is up on port: ${port}`);
});

// Graceful Shutdown
process.on("SIGTERM", () => {
  console.debug("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.debug("Server closed");
  });
});
