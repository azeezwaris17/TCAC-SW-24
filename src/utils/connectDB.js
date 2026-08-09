import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://TIMSAN:TIMSANSOUTH@ac-rec9yej-shard-00-00.raww7tm.mongodb.net:27017,ac-rec9yej-shard-00-01.raww7tm.mongodb.net:27017,ac-rec9yej-shard-00-02.raww7tm.mongodb.net:27017/TCAC?ssl=true&replicaSet=atlas-mzifxm-shard-0&authSource=admin&appName=TCAC";

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable inside .env");
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development, preventing connections from growing exponentially.
 */
let cached = globalThis.mongoose;

if (!cached) {
  cached = globalThis.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;