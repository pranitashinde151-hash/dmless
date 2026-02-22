import { MongoClient } from "mongodb";

let cached = null;

export async function connectDB() {
  if (cached) return cached;

  const client = await MongoClient.connect(process.env.MONGO_URL);
  const db = client.db("dmless");

  cached = db;
  return db;
}
