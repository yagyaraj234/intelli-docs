import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import * as admin from "firebase-admin";
import * as dotenv from "dotenv";
import passport from "passport";
import JWT from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import session from "express-session";
import root from "./routes/index";
import { VercelRequest, VercelResponse } from "@vercel/node";
import "module-alias/register";
import { corsOptions } from "./config/cors";
import { generateToken } from "./utils/token/token";
import { ApiSuccess } from "./utils/response/success";
import { limiter } from "./config/rate-limit";

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use(limiter);

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SECRET?.replace(/\\n/g, "\n"),
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    // @ts-ignore
    storageBucket: process.env.FIREBASE_BUCKET,
  }),
});

export const db = admin.firestore();
db.settings({
  ignoreUndefinedProperties: true,
});
const storage = admin.storage();
export const bucket = storage.bucket(process.env.FIREBASE_BUCKET);

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
    type: "",
  });

  const id = user.sub.slice(0, 10);

  db.collection("users").doc(user.sub).collection("workspaces").doc(id).set({
    id,
    name: "Personal Workspace",
    createdAt: date,
    updatedAt: date,
    history: [],
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
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (accessToken, refreshToken, profile, done) => {
      await createUser(profile._json);
      return done(null, profile);
    }
  )
);

app.use(
  session({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 },
  } as session.SessionOptions)
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  // @ts-ignore
  done(null, user);
});

app.get("/api/v1/auth", async (req, res) => {
  try {
    const token =
      req.cookies["intelli-doc-token"] ||
      req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    let decoded;
    try {
      decoded = JWT.verify(token, process.env.JWT_SECRET || "");
    } catch (error) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!decoded) return res.status(401).json({ message: "Unauthorized" });

    // @ts-ignore
    const userRef = await db.collection("users").doc(decoded?.uid).get();

    if (!userRef.exists) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    let user = userRef.data();

    user = {
      ...user,
      workspace: user?.id.slice(0, 10),
    };

    return res.status(200).json(ApiSuccess("User authenticated", user));
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

app.get(
  "/api/v1/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
  })
);

app.get(
  "/api/v1/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  async (req, res) => {
    const user = req.user;
    if (!user) return;
    // @ts-ignore
    const workspaceId = user.id.slice(0, 10);

    const token = await generateToken({
      // @ts-ignore
      email: user?.email,
      // @ts-ignore
      uid: user?.id,
    });

    res.cookie("intelli-doc-token", token, {
      maxAge: 60 * 60 * 1000 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    });
    res.redirect(`${process.env.APP_URL}workspace/${workspaceId}`);
  }
);

// Logout route
app.get("/api/v1/logout", (req: Request, res: Response) => {
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

module.exports = (req: VercelRequest, res: VercelResponse) => {
  app(req, res);
};
