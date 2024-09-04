"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

export default function LandingPage() {
  const [token, setToken] = useState("");
  const router = useRouter();
  const [user, setUser] = useState<any>(null); // User state

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("myToken")) {
        return sessionStorage.getItem("myToken");
      }
      const response = await fetch("/api/refreshToken", {
        method: "POST",
        credentials: "include", // This ensures cookies are sent
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("myToken", data.token);
        return data.token;
      } else {
        console.error("Failed to refresh token");
      }
    } catch (error) {
      console.error("Error refreshing access token:", error);
    }
    return null;
  };

  useEffect(() => {
    async function fetchUserData() {
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) {
          return;
        }
        setToken(tokenTemp)

        const response = await fetch(`/api/user/check`, {
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const check = await response.json();
        if (!check.check) {
          setUser(check.user);
          router.push('/home');

        } else {
          // Handle case where user is banned or check fails
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting token:", error);
        setUser(null);
      }
    }

    if (user === null) {
      fetchUserData();
    }
  }, [user]);

  return (
    <>
       <div className="border-light rounded-0 p-3 text-center pt-5 pb-5">
      <img 
        style={{ maxWidth: '100px', maxHeight: '100px' }} 
        src="https://ik.imagekit.io/9hpbqscxd/SG/image-67.jpg?updatedAt=1705798245623" 
        alt="Texter Logo"
      />
      <h4 className="h1 text-center">Texter</h4>
      <h4 className="h4 text-center text-secondary">See what's happening?</h4>

      <a className="btn btn-primary mt-3 w-50 rounded-pill" href="/login"
          style={{ fontSize: 'x-large' }}>Join Us</a>
    </div>
    </>
  );
}
