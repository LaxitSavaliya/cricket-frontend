"use client";

import { useState } from "react";

import { logoutUser } from "../auth.api";

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    if (isLoading) {
      return;
    }

    try {
      setIsLoading(true);

      await logoutUser();

      window.location.replace("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button type="button" onClick={handleLogout} disabled={isLoading}>
      {isLoading ? "Signing out..." : "Sign out"}
    </button>
  );
}
