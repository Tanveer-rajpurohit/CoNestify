import { useState } from "react";

export const useGetWorkspaceData = () => {
    const [loading, setLoading] = useState(false);
    
    const WorkspaceData = async (workspaceId: string) => {
        setLoading(true);

        try {
            const res = await fetch(`/api/workspace/home`, {
                method: "GET",
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
                console.log("Error fetching workspace people list:", err.message);
                throw err;
            } else {
                console.error("An unknown error occurred while fetching workspace people list:", err);
                throw new Error("An unknown error occurred");
            }
        } finally {
            setLoading(false);
        }
    }

    return { WorkspaceData,loading };
};