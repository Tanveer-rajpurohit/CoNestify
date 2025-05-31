import { useState } from "react";

export function useGetUserInvitation() {
  const [loading, setLoading] = useState(false);

  const userInvitation = async () => {
    setLoading(true);

    try {
      const res = await fetch("/api/user/invitationList", {
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
          window.location.href = "/login";
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        console.log("Error fetching user invitations:", err.message);
        throw err;
      } else {
        console.error("An unknown error occurred while fetching user invitations:", err);
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  }

  return { userInvitation, loading };

}
