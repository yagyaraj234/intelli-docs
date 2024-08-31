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
exports.createFirebaseAccount = exports.getGoogleUser = exports.getGoogleAuthURL = void 0;
const google_auth_library_1 = require("google-auth-library");
const admin = __importStar(require("firebase-admin"));
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8000/auth/google/callback"; // Update this with your actual redirect URI
const oAuth2Client = new google_auth_library_1.OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
function getGoogleAuthURL() {
    const scopes = [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
    ];
    return oAuth2Client.generateAuthUrl({
        access_type: "offline",
        prompt: "consent",
        scope: scopes,
    });
}
exports.getGoogleAuthURL = getGoogleAuthURL;
function getGoogleUser(code) {
    return __awaiter(this, void 0, void 0, function* () {
        const { tokens } = yield oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);
        const { data } = yield oAuth2Client.request({
            url: "https://www.googleapis.com/oauth2/v2/userinfo",
        });
        return data;
    });
}
exports.getGoogleUser = getGoogleUser;
function createFirebaseAccount(googleUser) {
    return __awaiter(this, void 0, void 0, function* () {
        const { email, name, picture } = googleUser;
        // Check if the user already exists
        const userRecord = yield admin
            .auth()
            .getUserByEmail(email)
            .catch(() => null);
        if (userRecord) {
            // Update existing user
            yield admin.auth().updateUser(userRecord.uid, {
                displayName: name,
                photoURL: picture,
            });
            return userRecord;
        }
        else {
            // Create new user
            const newUser = yield admin.auth().createUser({
                email,
                emailVerified: true,
                displayName: name,
                photoURL: picture,
            });
            return newUser;
        }
    });
}
exports.createFirebaseAccount = createFirebaseAccount;
