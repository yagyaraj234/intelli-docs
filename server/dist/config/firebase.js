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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.initializeFirebase = void 0;
const admin = __importStar(require("firebase-admin"));
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
exports.initializeFirebase = admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, "\n"),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    }),
});
