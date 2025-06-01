import { useState } from "react";

export const useCreateFile = () => {
  const [loading, setLoading] = useState(false);

  const createCanvas = async (workspaceId: string, name: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/canvas/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please log in again.");
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error creating canvas:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while creating canvas:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const createDocs = async (workspaceId: string, name: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/docs/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId, name }),
      });

      const data = await res.json();
      console.log("createDocs data:", data);

      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please log in again.");
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error creating document:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while creating document:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const createList = async (workspaceId: string, name: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/list/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId, name }),
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please log in again.");
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error creating list:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while creating list:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

    return {
        loading,
        createCanvas,
        createDocs,
        createList,
    };
}