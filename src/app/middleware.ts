import { authenticate } from "@/services/user";
import { useWorkspace } from "@/hooks/use-workspace";
import { useRouter } from "next/router";

import { NextRequest, NextResponse } from "next/server";
// Middleware to check if the user is logged in

const protectedRoutes = ["workspace", "workspaces", "chat", "file"];

export async function middleware(request: NextRequest) {
  console.log("middleware");
  const token = request.cookies.get("intelli-doc-token")?.value;

  if (token) {
    return NextResponse.redirect(
      new URL("/workspace/432", request.url).toString()
    );
  }
}
