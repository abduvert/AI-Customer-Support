// lib/firebaseAdmin.js or at the root of your project
import admin from 'firebase-admin';

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://customer-support-ai.firebaseio.com', // Replace with your Firebase Realtime Database URL if using Realtime Database
  });
}

const db = admin.firestore(); // Initialize Firestore
export { db };
