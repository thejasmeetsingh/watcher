const { createClient } = require("redis");

const getClient = async () => {
  const redisAddr = process.env.REDIS_HOST;
  const [host, port] = redisAddr.split(":");

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

const isUserExistsInCache = async (userID) => {
  const client = await getClient();
  const isExists = await client.exists(userID);

  await client.disconnect();

  return isExists === 1;
};

module.exports = isUserExistsInCache;
