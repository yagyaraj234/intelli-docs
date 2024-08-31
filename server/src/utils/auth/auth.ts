import { OAuth2Client } from "google-auth-library";
import * as admin from "firebase-admin";

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:8000/auth/google/callback"; // Update this with your actual redirect URI

const oAuth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export function getGoogleAuthURL() {
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

export async function getGoogleUser(code: string) {
  const { tokens } = await oAuth2Client.getToken(code);
  oAuth2Client.setCredentials(tokens);

  const { data } = await oAuth2Client.request({
    url: "https://www.googleapis.com/oauth2/v2/userinfo",
  });

  return data;
}

export async function createFirebaseAccount(googleUser: any) {
  const { email, name, picture } = googleUser;

  // Check if the user already exists
  const userRecord = await admin
    .auth()
    .getUserByEmail(email)
    .catch(() => null);

  if (userRecord) {
    // Update existing user
    await admin.auth().updateUser(userRecord.uid, {
      displayName: name,
      photoURL: picture,
    });
    return userRecord;
  } else {
    // Create new user
    const newUser = await admin.auth().createUser({
      email,
      emailVerified: true,
      displayName: name,
      photoURL: picture,
    });
    return newUser;
  }
}


