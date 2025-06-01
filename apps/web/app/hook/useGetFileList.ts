import { useState } from "react";

export const useGetFileList = () => {
  const [loading, setLoading] = useState(false);

  const getCanvasList = async (workspaceId: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/canvas/getList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId }),
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
        console.log("Error fetching file list:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while fetching file list:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const getDocsList = async (workspaceId: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/docs/getList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId }),
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
        console.log("Error fetching docs list:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while fetching docs list:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const getListFileList = async (workspaceId: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/list/getList`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId }),
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
        console.log("Error fetching list file list:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while fetching list file list:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  const getAllFileList = async (workspaceId: string) => {
    setLoading(true);

    try {
      const res = await fetch(`/api/file/all`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId }),
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
        console.log("Error fetching list file list:", err.message);
        throw err;
      } else {
        console.error(
          "An unknown error occurred while fetching list file list:",
          err
        );
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return {loading,getCanvasList,getDocsList,getListFileList,getAllFileList};
}