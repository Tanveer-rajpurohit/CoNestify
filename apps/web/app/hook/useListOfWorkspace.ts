// src/hooks/useCreateWorkspace.ts
import { useState } from "react";

export function useListOfWorkspace() {
  const [loading, setLoading] = useState(false);

  const listWorkspaces = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/workspace/list", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          // localStorage.removeItem('authToken');
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error fetching workspaces:", err.message);
        throw err;
      } else {
        console.error("An unknown error occurred while fetching workspaces:", err);
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };
  

  return { listWorkspaces, loading };
}

