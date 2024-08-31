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
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const admin = __importStar(require("firebase-admin"));
const auth_1 = require("../utils/auth/auth");
const router = (0, express_1.Router)();
router.get("/google", (req, res) => {
    res.redirect((0, auth_1.getGoogleAuthURL)());
});
// Google Auth Callback Route
router.get("/google/callback", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const code = req.query.code;
    try {
        const googleUser = yield (0, auth_1.getGoogleUser)(code);
        console.log({ googleUser });
        const firebaseUser = yield (0, auth_1.createFirebaseAccount)(googleUser);
        console.log({ firebaseUser });
        // Create a custom token
        const customToken = yield admin.auth().createCustomToken(firebaseUser.uid);
        // Store the token in the session
        req.session.token = customToken;
        res.redirect("/dashboard"); // Redirect to your app's dashboard or main page
    }
    catch (error) {
        console.error("Error during Google Sign-In:", error);
        res.status(500).send("Authentication failed");
    }
}));
// Protected Route Example
router.get("/dashboard", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const token = req.session.token;
    if (!token) {
        return res.status(401).send("Unauthorized");
    }
    try {
        const decodedToken = yield admin.auth().verifyIdToken(token);
        console.log(decodedToken);
        const { uid } = decodedToken;
        // You can now use this UID to fetch user-specific data from Firestore
        res.send(`Welcome to your dashboard, user ${uid}!`);
    }
    catch (error) {
        console.error("Error verifying token:", error);
        res.status(401).send("Unauthorized");
    }
}));
exports.default = router;
