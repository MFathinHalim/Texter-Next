"use client";
import { useEffect, useState } from "react";

function MyFooter() {
  const [trendingPosts, setTrendingPosts] = useState<string[]>([]);
  const [follow, setFollow] = useState<any[]>([]);

  // Function to fetch trending posts
  const getTrendingPosts = async () => {
    try {
      const response = await fetch("/api/post/trends"); // Assuming your trend endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.posts || [];
    } catch (error) {
      console.error("Error fetching trending posts:", error);
      return []; // Return empty array on error
    }
  };

  // Function to fetch top users
  const getTopUsers = async () => {
    try {
      const response = await fetch("/api/user/topUser"); // Assuming your top users endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      console.log(data.users)
      setFollow(data.users || []);
    } catch (error) {
      console.error("Error fetching top users:", error);
      setFollow([]); // Clear follow state on error
    }
  };

  // Fetch trending posts and top users on component mount
  useEffect(() => {
    const fetchData = async () => {
      const posts = await getTrendingPosts();
      setTrendingPosts(posts);
      await getTopUsers();
    };

    fetchData();
  }, []);

  return (
    <>
    
      <div className="card bg-dark text-white border-light d-none d-lg-flex rounded-lg">
        <div className="card-body">
          <h5 className="h5 card-title mb-3" style={{ fontWeight: 900 }}>
            Hashtag for you
          </h5>
          <div id="trendingPostsList">
            {trendingPosts.length === 0 ? (
              <div>No trending posts yet!</div>
            ) : (
              trendingPosts.slice(0, 6).map((post) => (
                <div key={post} className="mt-2">
                  <p className="text-secondary mt-1 mb-1">Hashtag</p>
                  <a
                    href={`/search/${encodeURIComponent(post)}`}
                    className="text-white text-decoration-none h5"
                  >
                    #{post}
                  </a>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="card bg-dark text-white border-light d-none d-lg-flex rounded-lg mt-2 mb-2">
        <div className="card-body">
          <h5 className="h5 card-title mb-3" style={{ fontWeight: 900 }}>
            Who to follow
          </h5>
          <div id="topList">
            {follow.length > 0 ? (
              follow.map((mutual: any) => (
                <div key={mutual.id} className="d-flex align-items-center mb-3">
                  <img
                    className="rounded-circle"
                    style={{ width: 50, height: 50 }}
                    src={mutual.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                    alt={mutual.name}
                  />
                  <div className="d-flex flex-column ms-2">
                    <a
                      href={`/${mutual.username}`}
                      className="text-white text-decoration-none h5 mb-1"
                    >
                      {mutual.name}
                    </a>
                    <p className="text-secondary mb-0">{mutual.followersCount} followers</p>
                  </div>
                </div>
              ))
            ) : (
              <p>No top users found.</p>
            )}
          </div>
        </div>
      </div>
      <div className="px-2">
        <a href="/privacy" className="text-secondary" style={{ fontSize: "small" }}>
          Privacy and Policy ·{" "}
        </a>
        <a className="text-secondary" style={{ fontSize: "small" }} href="https://saweria.co/mfathinhalim">
          Support This Web In Saweria ·{" "}
        </a>
        <br className="m-0" />
        <a className="text-secondary" style={{ fontSize: "small" }} href="https://www.fathin.my.id">
          © 2024 Texter by Fathin
        </a>
      </div>
      <div className="navbar navbar-dark bg-dark-glass navbar-expand d-lg-none d-xl-none" style={{ opacity: 0, width: 1 }}>
        <ul className="navbar-nav nav-justified w-100">
          <li className="nav-item">
            <a href="/" className="nav-link" style={{ fontSize: "x-large" }}>
              <i className="fa-solid fa-house" />
            </a>
          </li>
        </ul>
      </div>
      <nav className="navbar navbar-dark bg-dark-glass navbar-expand d-lg-none d-xl-none fixed-bottom">
        <ul className="navbar-nav nav-justified w-100">
          <li className="nav-item">
            <a href="/" className="nav-link home-link" style={{ fontSize: "x-large" }}>
              <i id="home-icon" className="fa-solid fa-home" />
            </a>
          </li>
          <li className="nav-item">
            <a href="/search" className="nav-link search-link" style={{ fontSize: "x-large" }}>
              <i id="search-icon" className="fa-solid fa-magnifying-glass" />
            </a>
          </li>
          <li className="nav-item">
            <button className="nav-link text-white" style={{ fontSize: "x-large" }}>
              <i id="plus-icon" className="fa-solid fa-plus" />
            </button>
          </li>
          <li className="nav-item">
            <a
              id="notifbtn"
              href="/notification"
              className="nav-link notification-link text-white position-relative"
              style={{ fontSize: "x-large" }}
            >
              <span id="notif-dot" className="notif-dot position-absolute top-0 start-0" />
              <i id="bell-icon" className="fa-solid fa-bell bell-icon" />
            </a>
          </li>
          <li className="nav-item">
            <a href="#" id="myDetails" className="nav-link profile-link" style={{ fontSize: "x-large" }}>
              <i id="user-icon" className="fa-solid fa-user" />
            </a>
          </li>
        </ul>
      </nav>
    </>
  );
}

export default MyFooter;
