/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const functions = require("firebase-functions");
const admin = require("firebase-admin");

// Initialize Firebase Admin SDK
admin.initializeApp();

// Define a Cloud Function that runs every 24 hours
exports.backupRealtimeData = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
    const db = admin.database();
    
    // Reference to the real-time data location
    const ref = db.ref('Data'); // Replace with your actual data path
    
    try {
        const snapshot = await ref.once('value');
        const data = snapshot.val();

        // Save the current snapshot of the data, e.g., to a new node with a timestamp
        const timestamp = new Date().toISOString();
        await db.ref('DailyCucumberDBSnapshots/' + timestamp).set(data);

        console.log("Data saved successfully:", data);
    } catch (error) {
        console.error("Error saving daily data:", error);
    }
});

