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
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const admin = __importStar(require("firebase-admin"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const passport_google_oauth20_1 = require("passport-google-oauth20");
const express_session_1 = __importDefault(require("express-session"));
const index_1 = __importDefault(require("./routes/index"));
require("module-alias/register");
const cors_2 = require("./config/cors");
const token_1 = require("./utils/token/token");
const success_1 = require("./utils/response/success");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)(cors_2.corsOptions));
app.use((0, cookie_parser_1.default)());
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
exports.db.settings({
    ignoreUndefinedProperties: true,
});
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
    callbackURL: "/api/v1/auth/google/callback",
}, (accessToken, refreshToken, profile, done) => __awaiter(void 0, void 0, void 0, function* () {
    yield createUser(profile._json);
    return done(null, profile);
})));
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET || "",
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 60 * 60 * 1000 * 24 * 30 },
}));
passport_1.default.serializeUser((user, done) => {
    done(null, user);
});
passport_1.default.deserializeUser((user, done) => {
    // @ts-ignore
    done(null, user);
});
app.get("/api/v1/auth", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    try {
        const token = req.cookies["intelli-doc-token"] ||
            ((_b = req.headers.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
        if (!token) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const decoded = yield jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "");
        if (!decoded)
            return res.status(401).json({ message: "Unauthorized" });
        // @ts-ignore
        const userRef = yield exports.db.collection("users").doc(decoded === null || decoded === void 0 ? void 0 : decoded.uid).get();
        if (!userRef.exists) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let user = yield userRef.data();
        user = Object.assign(Object.assign({}, user), { workspace: user === null || user === void 0 ? void 0 : user.id.slice(0, 10) });
        return res.status(200).json((0, success_1.ApiSuccess)("User authenticated", user));
    }
    catch (error) {
        console.log(error);
    }
}));
app.get("/api/v1/auth/google", passport_1.default.authenticate("google", {
    scope: ["profile", "email"],
}));
app.get("/api/v1/auth/google/callback", passport_1.default.authenticate("google", { failureRedirect: "/" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    if (!user)
        return;
    // @ts-ignore
    const workspaceId = user.id.slice(0, 10);
    const token = yield (0, token_1.generateToken)({
        // @ts-ignore
        email: user === null || user === void 0 ? void 0 : user.email,
        // @ts-ignore
        uid: user === null || user === void 0 ? void 0 : user.id,
    });
    res.cookie("intelli-doc-token", token, {
        maxAge: 60 * 60 * 1000 * 24 * 30,
        httpOnly: true,
    });
    res.redirect(`${process.env.APP_URL}workspace/${workspaceId}`);
}));
// Logout route
app.get("/api/v1/logout", (req, res) => {
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
module.exports = (req, res) => {
    app(req, res);
};
