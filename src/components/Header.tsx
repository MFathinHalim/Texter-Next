"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function MyHeader() {
  const [user, setUser]: any = useState(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Hook for programmatic navigation
  function applyTheme(theme: string) {
    localStorage.setItem("theme", theme);
    console.log(theme);
    if (theme === "auto") {
      // If data-theme is auto, check the color scheme preference
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
  }

  // Load the theme from localStorage on page load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    applyTheme(savedTheme);
  }, []);

  // Function to refresh access token
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
        const token = await refreshAccessToken();
        if (!token) {
            if (pathname !== '/' && pathname !== '/login' && pathname !== '/signup') {
            router.push("/");
            }
          return;
        }

        const response = await fetch(`/api/user/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const check = await response.json();
        if (!check.check) {
          setUser(check.user);
        } else {
          // Handle case where user is banned or check fails
          setUser(null);
          // Optionally redirect or show a message
        }
      } catch (error) {
        console.error("Error getting token:", error);
        // Optionally handle error
        setUser(null);
        //router.push('/login');
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router]);
  return (
    <>
      <div className='d-flex'>
        <a id='notifbtn' className='d-none d-lg-flex btn pe-4 ps-4 text-center bg-dark text-white border-light rounded-lg d-flex align-items-center justify-content-center' href='/notification'>
          <i id='bell-icon' className='fas fa-bell' />
          <span id='notif-dot' className='notif-dot ms-1' />
        </a>
        <div className='card bg-dark text-white ms-2 border-light d-none d-lg-flex rounded-lg' style={{ maxWidth: 300 }}>
          <div className='card-body'>
            <input type='text' autoComplete='off' id='searchInput' className='form-control' placeholder='Search' />
          </div>
        </div>
      </div>
      <div className='card bg-dark text-white border-light d-none d-lg-flex pt-3 rounded-lg mt-2'>
        {user ? (
          <>
            <a href={`/${user.username}`} id='myDetails' className='d-lg-flex'>
              <img
                className='rounded-circle mx-auto'
                style={{
                  width: "100%",
                  height: "100%",
                  maxWidth: 100,
                  maxHeight: 100,
                }}
                id='mypfp'
                src={user.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt='Profile'
              />
            </a>
            <div className='card-body'>
              <h5 className='card-title text-center' id='myname'>
                {user.name || ""}
              </h5>
              <p className='card-text text-secondary text-center' id='myusername'>
                {user.username || ""}
              </p>
              <p className='card-text' id='mydesc' style={{ height: "fit-content !important" }}>
                {user.desc || ""}
              </p>
              <p className='card-text mb-0' id='myfollowing' style={{ color: "var(--text)" }}>
                <strong>{user.following.length || 0}</strong> following
              </p>
              <p className='card-text' id='myfollowers' style={{ color: "var(--text)" }}>
                <strong>{user.followers.length || 0}</strong> followers
              </p>
              <div className='text-center'>
                <button className='btn btn-primary rounded-pill ms-3' style={{ width: "70%", fontSize: "x-large" }}>
                  Post
                </button>
              </div>
            </div>
          </>
        ) : (
          <p className='text-center'>Loading...</p>
        )}
      </div>
      <div className='card bg-dark text-white border-light d-none d-lg-flex rounded-lg mt-2 mb-2'>
        <div className='card-body'>
          <h5 className='h5 card-title mb-3' style={{ fontWeight: 900 }}>
            Mutuals
          </h5>
          <div id='follower' />
        </div>
      </div>
    </>
  );
}

export default MyHeader;
