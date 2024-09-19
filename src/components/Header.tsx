"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

function MyHeader() {
  const [user, setUser] = useState<any>(null);

  const [mutuals, setMutuals] = useState<any[]>([]);
  const pathname = usePathname(); // Get the current pathname
  const router = useRouter(); // Hook for programmatic navigation
  const [loading, setLoading] = useState(true);

  function applyTheme(theme: string) {
    localStorage.setItem("theme", theme);
    if (theme === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
  }

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    applyTheme(savedTheme);
  }, []);

  const refreshAccessToken = async () => {
    try {
      if (sessionStorage.getItem("myToken")) {
        return sessionStorage.getItem("myToken");
      }
      const response = await fetch("/api/refreshToken", {
        method: "POST",
        credentials: "include",
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
          if (pathname !== "/" && pathname !== "/login" && pathname !== "/signup") {
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
          setUser(null);
        }

        // Fetch mutuals data
        const mutualsResponse = await fetch(`/api/user/mutuals`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (mutualsResponse.ok) {
          const mutualsData = await mutualsResponse.json();
          setMutuals(mutualsData.users || []);
        } else {
          console.error("Failed to fetch mutuals data");
        }
      } catch (error) {
        console.error("Error getting token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    fetchUserData();
  }, [router, pathname]);

  // Scroll behavior for sticky elements
  useEffect(() => {
    const stickyElements = document.querySelectorAll(".sticky-element");

    const handleScroll = () => {
      const currentScrollTop = window.scrollY || document.documentElement.scrollTop;
      stickyElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const viewportHeight = window.innerHeight;

        const dynamicTop = 1000; // Adjust this value if needed
        if (rect.bottom < viewportHeight) {
          el.style.top = `${viewportHeight - dynamicTop}px`; // Adjust positioning relative to viewport height
        }
      });
    };

    // Attach the scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Perform initial scroll check
    handleScroll();

    // Clean up the event listener on component unmount
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className='d-flex flex-column mt-0 pt-0 fixed-on-navbar' style={{ height: "100vh", overflowY: "auto" }}>
        <div className='card border-0 bg-dark text-white rounded-0 d-none d-lg-flex post' style={{ flexGrow: 1 }}>
          <>
            <div className='card-body p-0'>
              <div>
                <div className='p-3 pb-2 d-flex align-items-center'>
                  <i className='fa-solid h4 fa-home me-2' />
                  <a href='/home' className='h4 mb-0'>
                    Home
                  </a>
                </div>
                <div className='p-3 pb-2 d-flex align-items-center'>
                  <i className='fa-solid h4 fa-magnifying-glass me-2'></i>
                  <a href='/search' className='h4 mt-0'>
                    Search
                  </a>
                </div>
                <div className='p-3 pb-2 d-flex align-items-center'>
                  <i className='fa-solid h4 fa-bookmark me-3' />
                  <a href='/bookmark' className='h4 mt-0'>
                    Saved
                  </a>
                </div>
                <div className='p-3 pb-2 d-flex align-items-center'>
                  <i className='fa-solid h4 fa-clapperboard me-3' />
                  <a href='/videos' className='h4 mt-0'>
                    Videos
                  </a>
                </div>
                <div className='p-3 pb-2 d-flex align-items-center'>
                  <i className='fa-solid h4 fa-bell me-3' />
                  <a className='h4 mt-0'>Notification</a>
                </div>
              </div>

              <div className='text-center pb-4 p-3'>
                <button className='btn btn-primary rounded-pill ' style={{ width: "100%", fontSize: "x-large" }}>
                  Post
                </button>
              </div>
            </div>
          </>
        </div>
        <div className='card border-0 bg-dark text-white rounded-0 d-none d-lg-flex post h-100'>
          <div className='card-body'>
            <h5 className='h5 card-title mb-3' style={{ fontWeight: 900 }}>
              Mutuals
            </h5>
            <div id='follower'>
              {mutuals.length > 0 ? (
                mutuals.map((mutual: any) => (
                  <div key={mutual.id} className='d-flex align-items-center mb-3'>
                    <img className='rounded-circle' style={{ width: 50, height: 50 }} src={mutual.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt={mutual.name} />
                    <div className='d-flex flex-column ms-2'>
                      <a
                        href={`/${mutual.username}`} // Use mutual.username for correct URL
                        className='text-white text-decoration-none h5 mb-1' // Add CSS classes directly
                      >
                        {mutual.name}
                      </a>
                      <p className='text-secondary mb-0'>@{mutual.username}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No mutuals found.</p>
              )}
            </div>
           {user ? (
              <a href={`/${user.username}`} id='myDetails' className='border-light rounded mt-auto d-flex pt-2 pb-2 p-3'>
                <img
                  className='rounded-circle me-3'
                  style={{
                    width: "50%",
                    height: "50%",
                    maxWidth: 50,
                    maxHeight: 50,
                  }}
                  id='mypfp'
                  src={user.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                  alt='Profile'
                />
                <div>
                  <h5 className='card-title mb-0' id='myname'>
                    {user.name || ""}
                  </h5>
                  <p className='card-text text-secondary' id='myusername'>
                    @{user.username || ""}
                  </p>
                </div>
              </a>
            ) : (
              <p className='text-center'>Loading...</p>
            )}
        </div>
        </div>

      </div>
    </>
  );
}

export default MyHeader;
