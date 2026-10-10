import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/buroia";

let connectionPromise: Promise<typeof mongoose> | null = null;

export async function connectToDatabase() {
  if (mongoose.connection.readyState === 1) return mongoose;
  if (!connectionPromise) connectionPromise = mongoose.connect(MONGODB_URI);

  try {
    return await connectionPromise;
  } finally {
    if (mongoose.connection.readyState !== 2) connectionPromise = null;
  }

}
