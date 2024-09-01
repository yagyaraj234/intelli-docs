"use client";
import React, { useEffect } from "react";

const AuthPage = () => {
    
  const verifyToken = async () => {
    // Verify token here

    const res = await fetch(`${process.env.API_URL}/auth/google/callback`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
  };
  useEffect(() => {
    verifyToken();
  }, []);

  return <div>AuthPage</div>;
};

export default AuthPage;
