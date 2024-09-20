import express, { Response } from "express";
import logger from "morgan";

import { router } from "@api/routes";
import { StatusCodes } from "http-status-codes";

const app = express();
const port = process.env.PORT || "3000";

app.use(
  logger(":remote-addr :remote-user :method :url :status - :response-time ms")
);
app.use(express.json());
app.use("/api", router);

// A health check API for determining the readiness of the app
app.get("/health-check", async (_, res: Response) => {
  return res
    .status(StatusCodes.OK)
    .json({
      message: "ToDo service up & running",
    })
    .end();
});

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
