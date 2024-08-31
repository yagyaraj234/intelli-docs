interface User {
  name: string;
  uid: string;
  photoURL: string;
  createdAt: string;
  updatedAt: string;
  lastLogin: string;
  plan: "free" | "pro" | "enterprise";
}

interface file {
  id: string;
  name: string;
  type: string;
  size: number;
  createdAt: string;
}

interface Workspace {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  files: file[];
  usage: number;
  url?: string;
}
