import { createClient } from "redis";

if (
  !process.env.REDIS_HOST ||
  !process.env.REDIS_PORT ||
  !process.env.REDIS_PASSWORD ||
  !process.env.REDIS_USERNAME
) {
  throw new Error(
    "REDIS_HOST, REDIS_PORT, REDIS_PASSWORD, and REDIS_USERNAME must be set"
  );
}

let client: ReturnType<typeof createClient>;
let clientPromise: Promise<ReturnType<typeof createClient>>;

if (process.env.NODE_ENV === "development") {
  const globalWithRedis = global as typeof globalThis & {
    _redisClientPromise: Promise<ReturnType<typeof createClient>>;
  };

  if (!globalWithRedis._redisClientPromise) {
    const client = createClient({
      username: process.env.REDIS_USERNAME,
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_HOST,
        port: parseInt(process.env.REDIS_PORT as string),
      },
    });

    globalWithRedis._redisClientPromise = client.connect();
  }

  clientPromise = globalWithRedis._redisClientPromise;
} else {
  client = createClient({
    username: process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT as string),
    },
  });
  clientPromise = client.connect().then(() => client);
}

export default clientPromise;
