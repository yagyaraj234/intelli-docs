import express, { Request, Response } from "express";
import * as admin from "firebase-admin";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import root from "./routes/index";

const firebase = require("../.account.json");

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: firebase.project_id,
    privateKey: firebase.private_key?.replace(/\\n/g, "\n"),
    clientEmail: firebase.client_email,
    // @ts-ignore
    storageBucket: firebase.storage_bucket,
  }),
});

export const db = admin.firestore();
const storage = admin.storage();
export const bucket = storage.bucket("gs://chat-doc-46080.appspot.com");

app.get("/", (req, res) => {
  res.send(`Server up and running.`);
});

const createUser = async (user: any) => {
  if (!user) return;
  const userRef = await db.collection("users").doc(user.sub).get();
  if (userRef.exists) return;

  const date = new Date().toISOString();

  await db.collection("users").doc(user.sub).set({
    id: user.sub,
    name: user.name,
    email: user.email,
    image: user.picture,
    verified: true,
    createdAt: date,
    updatedAt: date,
    lastLogin: date,
    plan: "free",
    limit: 10,
    type:""
  });

  const id = user.sub.slice(0, 10);

  await db
    .collection("users")
    .doc(user.sub)
    .collection("workspaces")
    .doc(id)
    .set({
      id,
      name: "Personal Workspace",
      createdAt: date,
      updatedAt: date,
      files: [],
      usage: 0,
    });
  return user;
};

// Passport setup

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      callbackURL: "http://localhost:8000/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      await createUser(profile._json);
      return done(null, profile);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // @ts-ignore
  done(null, user);
});

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 * 10 },
  } as session.SessionOptions)
);

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;
    // @ts-ignore
    const workspaceId = user.id.slice(0, 10);

    res.redirect(`/workspace/${workspaceId}`);
  }
);

// Logout route
app.get("/logout", (req: Request, res: Response) => {
  // @ts-ignore
  req.logOut();
  // @ts-ignore
  res.session.destroy(() => {
    //  @ts-ignore
    if (res.session) {
      res.clearCookie("connect.sid");
      res.redirect("/");
    } else {
      res.send("No session to log out of");
    }
  });
});

app.use("/api/v1/", root);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
