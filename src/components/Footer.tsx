"use client";
import { useEffect, useState } from "react";

function MyFooter() {
  const [trendingPosts, setTrendingPosts] = useState<string[]>([]);

  // Function to fetch trending posts
  const getTrendingPosts = async () => {
    try {
      const response = await fetch("/api/post/trends"); // Assuming your trend endpoint
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data.posts;
    } catch (error) {
      console.error("Error fetching trending posts:", error);
      return []; // Return empty array on error
    }
  };

  // Function to update trending posts in the DOM
  const updateTrendingPosts = (posts: string[]) => {
    const trendingPostsList = document.querySelector("#trendingPostsList");
    if (trendingPostsList) {
      trendingPostsList.innerHTML = ""; // Clear existing content

      if (posts.length === 0) {
        trendingPostsList.innerHTML = "<div>No trending posts yet!</div>";
      } else {
        const maxItemsToShow = 6;
        const limitedPosts = posts.slice(0, maxItemsToShow);

        limitedPosts.forEach((post) => {
          const listItem = document.createElement("div");
          listItem.classList.add("mt-2");

          // Create link to post details page (replace with your logic)
          const postLink = document.createElement("a");
          const trendingtext = document.createElement("p");
          trendingtext.classList.add("text-secondary", "mt-1", "mb-1");
          trendingtext.textContent = "Hashtag";
          listItem.appendChild(trendingtext);

          postLink.href = `/?search=${post}`;
          postLink.classList.add("text-white", "text-decoration-none", "h5");
          postLink.textContent = "#" + post;
          listItem.appendChild(postLink);

          trendingPostsList.appendChild(listItem);
        });
      }
    }
  };

  // Fetch trending posts and update display on component mount
  useEffect(() => {
    const fetchAndDisplayPosts = async () => {
      const posts = await getTrendingPosts();
      setTrendingPosts(posts);
      updateTrendingPosts(posts);
    };

    fetchAndDisplayPosts();
  }, []);

  // Handle scroll event
  useEffect(() => {
    const handleScroll = () => {
      const stickyElements = document.querySelectorAll<HTMLElement>(".sticky-element");
      const viewportHeight = window.innerHeight;

      stickyElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        const dynamicTop = 1000; // Adjust this value if needed

        if (rect.bottom < viewportHeight) {
          el.style.top = `${viewportHeight - dynamicTop}px`; // Set top to be -10px from the viewport height
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial check

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className="col-12 col-lg-3 h-100 sticky-element">
        <div className="card bg-dark text-white border-light d-none d-lg-flex rounded-lg">
          <div className="card-body">
            <h5 className="h5 card-title mb-3" style={{ fontWeight: 900 }}>
              Hashtag for you
            </h5>
            <div id="trendingPostsList" />
          </div>
        </div>
        <div className="card bg-dark text-white border-light d-none d-lg-flex rounded-lg mt-2 mb-2">
          <div className="card-body">
            <h5 className="h5 card-title mb-3" style={{ fontWeight: 900 }}>
              Who to follow
            </h5>
            <div id="topList" />
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
