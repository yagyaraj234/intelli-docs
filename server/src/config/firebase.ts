// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import * as admin from "firebase-admin";

const firebaseConfig = {
  apiKey: "AIzaSyAWMpyMT63keFxCPX4da8xOn5oCbcfRKhU",
  authDomain: "chat-doc-46080.firebaseapp.com",
  projectId: "chat-doc-46080",
  storageBucket: "chat-doc-46080.appspot.com",
  messagingSenderId: "135601055838",
  appId: "1:135601055838:web:bdc3f402a19fe1913a2ccf",
  measurementId: "G-QN2QP2D86X",
};

// export const initializeFirebase = async () => {
//   try {
//     const app = initializeApp(firebaseConfig);
//     // const db = getFirestore(app);
//     console.log("Firebase initialized successfully");
//     return app;
//   } catch (error) {
//     console.log(error);
//   }
// };

export const initializeFirebase = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
  }),
});
