const { MongoClient } = require("mongodb");

const url = "mongodb://127.0.0.1:27017";
const client = new MongoClient(url);

const dbName = "studentDB";

async function main() {
  await client.connect();
  console.log("Connected to MongoDB");

  const db = client.db(dbName);
  const students = db.collection("students");

  // -------- INSERT OPERATIONS --------

  await students.insertOne({
    name: "Arun",
    age: 22,
    course: "MERN Stack",
    status: "ongoing"
  });

  await students.insertMany([
    { name: "Priya", age: 21, course: "MERN Stack", status: "ongoing" },
    { name: "Karthik", age: 23, course: "Python", status: "completed" },
    { name: "Divya", age: 20, course: "Java", status: "ongoing" }
  ]);

  // -------- READ OPERATIONS --------

  const allStudents = await students.find().toArray();
  console.log("All Students:", allStudents);

  const mernStudents = await students.find({ course: "MERN Stack" }).toArray();
  console.log("MERN Students:", mernStudents);

  // -------- UPDATE OPERATIONS --------

  await students.updateOne(
    { name: "Arun" },
    { $set: { status: "completed" } }
  );

  await students.updateMany(
    { course: "MERN Stack" },
    { $set: { status: "completed" } }
  );

  // -------- DELETE OPERATIONS --------

  await students.deleteOne({ name: "Divya" });

  // (optional for practice)
  // await students.deleteMany({});

  // -------- QUERY OPERATORS --------

  const greaterThan = await students.find({ age: { $gt: 21 } }).toArray();
  console.log("Age > 21:", greaterThan);

  const lessThan = await students.find({ age: { $lt: 22 } }).toArray();
  console.log("Age < 22:", lessThan);

  const inQuery = await students.find({
    course: { $in: ["MERN Stack", "Python"] }
  }).toArray();
  console.log("$in result:", inQuery);

  const andQuery = await students.find({
    $and: [{ age: { $gt: 20 } }, { status: "completed" }]
  }).toArray();
  console.log("$and result:", andQuery);

  const orQuery = await students.find({
    $or: [{ course: "Java" }, { status: "completed" }]
  }).toArray();
  console.log("$or result:", orQuery);

  const existsQuery = await students.find({
    age: { $exists: true }
  }).toArray();
  console.log("$exists result:", existsQuery);

  // -------- USE CASE: LIBRARY SYSTEM --------

  const books = db.collection("books");

  await books.insertMany([
    { title: "The Alchemist", author: "Paulo Coelho", available: true },
    { title: "Atomic Habits", author: "James Clear", available: true },
    { title: "Clean Code", author: "Robert C. Martin", available: false }
  ]);

  const availableBooks = await books.find({ available: true }).toArray();
  console.log("Available Books:", availableBooks);

  await books.updateOne(
    { title: "Clean Code" },
    { $set: { available: true } }
  );

  await books.deleteOne({ title: "The Alchemist" });

  await client.close();
}

main();
