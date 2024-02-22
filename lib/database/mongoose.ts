import mongoose, { Mongoose } from "mongoose";

const MONGODB_URL = process.env.MONGODB_URL;

interface MongooseConnection {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = {
    conn: null,
    promise: null
  };
}

export const connectToDatabase = async () => {
  if (cached.conn) return cached.conn;

  if (!MONGODB_URL) throw new Error("Missing MONGODB_URL");

  cached.promise =
    cached.promise ||
    mongoose.connect(MONGODB_URL, {
      dbName: "myway-imaginify",
      bufferCommands: false
    });

  cached.conn = await cached.promise;

  return cached.conn;
};
/*
In Express DB and Mongo DB connection - only once.

In Next.js and Mongo DB connection - For every request it will reset the connection.
If one request is done, then Next.js will shutdown the connection with Mongo DB. 
When other request will come it will connect again

Next.js will run in a serverless environment. As serverless environment are stateless.

Every request will run independently allowing for better scalability & reliability


Interview Question:
Difference between:
ServerFull
ServerLess

Both of them have their pros and cons - but server less is more scalable
*/
