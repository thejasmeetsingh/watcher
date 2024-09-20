import { createClient } from "redis";

const getClient = async () => {
  const redisAddr: string | undefined = process.env.REDIS_HOST;

  if (!redisAddr) {
    return;
  }

  const [host, portStr] = redisAddr.split(":");
  const port = parseInt(portStr, 10);

  const client = await createClient({
    username: "default",
    password: "",
    database: 0,
    socket: {
      host,
      port,
    },
  })
    .on("error", (err) => console.log("Redis conn error:", err))
    .connect();

  return client;
};

export const isUserExistsInCache = async (userID: string) => {
  const client = await getClient();

  if (!client) {
    throw new Error("Error: While connecting to cache");
  }

  const isExists = await client.exists(userID);

  await client.disconnect();

  return isExists === 1;
};
