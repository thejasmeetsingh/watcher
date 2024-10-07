import { createClient } from "redis";

interface User {
  id: string;
  email: string;
  name: string;
  age: number | null;
  gender: string | null;
  genres: [string] | null;
  created_at: Date;
  modified_at: Date;
}

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

export const getUserFromCache = async (userID: string) => {
  const client = await getClient();

  if (!client) {
    throw new Error("Error: While connecting to cache");
  }

  const userDataStr: string | null = await client.get(userID);

  await client.disconnect();

  if (userDataStr) {
    return JSON.parse(userDataStr);
  }

  return null;
};

// Add a given key/value in the user details in cache,
// So that common data can be accessed across the services.
export const updateUserInCache = async (
  userID: string,
  key: number,
  value: string | null
) => {
  const client = await getClient();

  if (!client) {
    throw new Error("Error: While connecting to cache");
  }

  const user: User | null = await getUserFromCache(userID);

  if (user) {
    const updatedUser = {
      ...user,
      [key]: value,
    };

    console.log("updatedUser:", updatedUser);

    // Save the updated details in cache.
    await client.set(userID, JSON.stringify(updatedUser));
  }

  await client.disconnect();
};
