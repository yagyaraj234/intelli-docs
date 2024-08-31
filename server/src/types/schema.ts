interface User {
  name: string;
  uid: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  plan: "free" | "pro" | "enterprise";
}
