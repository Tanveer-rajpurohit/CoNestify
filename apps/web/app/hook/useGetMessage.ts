import { useState } from "react";

export const useGetMessage = () => {
  const [loading, setLoading] = useState(false);

  const channelMessage = async(workspaceId:string, channelId:string) =>{
    setLoading(true);

    try {
      const res = await fetch(`/api/channel/message?workspaceId=${encodeURIComponent(workspaceId)}&channelId=${encodeURIComponent(channelId)}`, {
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
          localStorage.removeItem('authToken');
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
  }

  const DMMessage = async(workspaceId:string, receiverId:string) =>{
    setLoading(true);

     try {
      const res = await fetch(`/api/message?workspaceId=${encodeURIComponent(workspaceId)}&receiverId=${encodeURIComponent(receiverId)}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

        if (res.redirected) {
                window.location.href = res.url;
                return;
            }

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          localStorage.removeItem('authToken');
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
  }

  return { channelMessage,DMMessage, loading };

}