"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.bucket = exports.db = void 0;
const express_1 = __importDefault(require("express"));
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const express_session_1 = __importDefault(require("express-session"));
const index_1 = __importDefault(require("./routes/index"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
// Initialize Firebase
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (_a = process.env.FIREBASE_SECRET) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        // @ts-ignore
        storageBucket: process.env.FIREBASE_BUCKET,
    }),
});
exports.db = admin.firestore();
const storage = admin.storage();
exports.bucket = storage.bucket(process.env.FIREBASE_BUCKET);
app.get("/", (req, res) => {
    res.send(`Server up and running.`);
});
const createUser = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (!user)
        return;
    const userRef = yield exports.db.collection("users").doc(user.sub).get();
    if (userRef.exists)
        return;
    const date = new Date().toISOString();
    yield exports.db.collection("users").doc(user.sub).set({
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
    yield exports.db
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
});
// Passport setup
passport_1.default.use(new passport_google_oauth20_1.Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackURL: "http://localhost:8000/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield createUser(profile._json);
    return done(null, profile);
})));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    // @ts-ignore
    done(null, user);
});
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 * 10 },
}));
app.get("/auth/google", passport_1.default.authenticate("google", { scope: ["profile", "email"] }));
app.get("/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    // @ts-ignore
    const workspaceId = user.id.slice(0, 10);
    res.redirect(`/workspace/${workspaceId}`);
}));
// Logout route
app.get("/logout", (req, res) => {
    // @ts-ignore
    req.logOut();
    // @ts-ignore
    res.session.destroy(() => {
        //  @ts-ignore
        if (res.session) {
            res.clearCookie("connect.sid");
            res.redirect("/");
        }
        else {
            res.send("No session to log out of");
        }
    });
});
app.use("/api/v1/", index_1.default);
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
