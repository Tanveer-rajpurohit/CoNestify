import { useState } from "react";

export function useCreateChannel() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createChannel = async (
    workspaceId: string,
    name: string,
    description: string
  ) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(`/api/channel/create`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
        body: JSON.stringify({ workspaceId, name, description }),
      });

      const data = await res.json();
      if (!res.ok) {
        if (data.message === "Not authorized, token failed") {
          alert("Session expired, please logIn again.");
          //   localStorage.removeItem('authToken');
          window.location.href = "/login";
          return;
        }

        if (res.status === 409) {
          setError(data.error);
          console.log(data.error);
          return;
        }

        const err = await res.json();
        throw new Error(err.error || "Something went wrong");
      }

      return data;
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
        throw err;
      } else {
        setError("An unknown error occurred");
        throw new Error("An unknown error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return { createChannel, loading, error };
}
