const admin = require("firebase-admin");
const { MongoClient } = require("mongodb");
const dotenv = require("dotenv");

// Load environment variables
dotenv.config();

// Initialize Firebase Admin SDK with service account credentials
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
  }),
  databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}-default-rtdb.asia-southeast1.firebasedatabase.app/`,
});

// MongoDB connection details
const uri = process.env.MONGO_URI;
const dbName = process.env.MONGO_DB_NAME;
const collectionName = process.env.MONGO_COLLECTION;

// Function to fetch Firebase data
async function fetchFirebaseData() {
  const db = admin.database();
  const ref = db.ref("/");  // Change this to the path of the data you want
  const snapshot = await ref.once("value");
  const data = snapshot.val();
  return data;
}

// Function to upload data to MongoDB
async function uploadToMongo(data) {
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 30000, // 30 seconds timeout
    socketTimeoutMS: 45000,          // 45 seconds socket timeout
  });
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Insert a new document with the fetched data and current timestamp
    await collection.insertOne({ timestamp: new Date(), data: data });

    console.log("Data uploaded successfully to MongoDB");
  } catch (error) {
    console.error("Error uploading data to MongoDB:", error);
  } finally {
    await client.close();
    process.exit(0);
  }
}

// Main function to fetch data from Firebase and upload to MongoDB
async function main() {
  try {
    const firebaseData = await fetchFirebaseData();
    console.log("Fetched data from Firebase:", firebaseData);
    await uploadToMongo(firebaseData);
  } catch (error) {
    console.error("Error in main function:", error);
  }
}

// Run the main function
main();
