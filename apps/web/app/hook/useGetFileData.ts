import { useState } from "react";

export const useGetFileData = () => {
  const [loading, setLoading] = useState(false);

  const getDocsData = async (workspaceId: string, fileId: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/file/docs/getData?workspaceId=${encodeURIComponent(workspaceId)}&fileId=${encodeURIComponent(fileId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

      if (res.redirected) {
        window.location.href = res.url;
        return;
      }

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          //   localStorage.removeItem('authToken');
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error fetching message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const getListData = async (workspaceId: string, fileId: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/file/list/getData?workspaceId=${encodeURIComponent(workspaceId)}&fileId=${encodeURIComponent(fileId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

       if (res.redirected) {
                window.location.href = res.url;
                return;
            }

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          //   localStorage.removeItem('authToken');
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error fetching message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

    const getCanvasData = async (workspaceId: string, fileId: string) => {
    setLoading(true);

    try {
      const res = await fetch(
        `/api/file/canvas/getData?workspaceId=${encodeURIComponent(workspaceId)}&fileId=${encodeURIComponent(fileId)}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("authToken")}`,
          },
        }
      );

       if (res.redirected) {
                window.location.href = res.url;
                return;
            }

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          //   localStorage.removeItem('authToken');
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error fetching message:", err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return { getDocsData, getListData,getCanvasData, loading };
};
