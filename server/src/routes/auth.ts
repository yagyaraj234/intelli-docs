import session, { SessionData } from "express-session";
import { Router, Request, Response } from "express";
import * as admin from "firebase-admin";
import {
  getGoogleAuthURL,
  getGoogleUser,
  createFirebaseAccount,
} from "utils/auth/auth";

interface CustomSession extends SessionData {
  token?: string;
}

const router = Router();

router.get("/google", (req, res) => {
  res.redirect(getGoogleAuthURL());
});

// Google Auth Callback Route
router.get("/google/callback", async (req: Request, res: Response) => {
  const code = req.query.code as string;

  try {
    const googleUser = await getGoogleUser(code);
    const firebaseUser = await createFirebaseAccount(googleUser);

    // Create a custom token
    const customToken = await admin.auth().createCustomToken(firebaseUser.uid);

    // Store the token in the session
    (req.session as CustomSession).token = customToken;

    res.redirect("/dashboard"); // Redirect to your app's dashboard or main page
  } catch (error) {
    console.error("Error during Google Sign-In:", error);
    res.status(500).send("Authentication failed");
  }
});

// Protected Route Example
router.get("/dashboard", async (req, res) => {
  const token = (req.session as CustomSession).token;

  if (!token) {
    return res.status(401).send("Unauthorized");
  }

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    console.log(decodedToken);
    const { uid } = decodedToken;

    // You can now use this UID to fetch user-specific data from Firestore
    res.send(`Welcome to your dashboard, user ${uid}!`);
  } catch (error) {
    console.error("Error verifying token:", error);
    res.status(401).send("Unauthorized");
  }
});

export default router;
