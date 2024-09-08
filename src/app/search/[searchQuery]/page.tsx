"use client";
import { useState, useEffect, useCallback } from "react";
import PostComponent from "@/components/Post";
import Loading from "@/components/Loading";
import MyFooter from "@/components/Footer";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation"; // Import useRouter for navigation

const POSTS_PER_PAGE = 10; // Number of posts to load per request

export default function Search() {
  const [posts, setPosts] = useState<any[]>([]); // State to hold posts
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [hasMore, setHasMore] = useState(true); // State to determine if more posts are available
  const [page, setPage] = useState(1); // Current page
  const { searchQuery } = useParams();
  const [query, setQuery] = useState(searchQuery.toString()); // Search query
  const [token, setToken] = useState("");
  const router = useRouter(); // Initialize the router


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
    async function fetchPosts() {
      setLoading(true);
      try {
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) {
          return;
        }
        setToken(tokenTemp);

        const response = await fetch(`/api/post/search?search=${query}&page=${page}&limit=${POSTS_PER_PAGE}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        const data = await response.json();

        if (data.posts.length === 0) {
          setHasMore(false);
        }

        setPosts((prevPosts) => [...prevPosts, ...data.posts]);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }

    if (query) {
      fetchPosts();
    }
  }, [query, page]);

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Handle form submit
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    // Update URL to include search query
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };

  // Handle scroll event
  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    if (hasMore) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  return (
    <>
      <div className='card rounded-0 bg-dark border-light text-white'>
        <div className='p-3'>
          <h4>Search Posts</h4>
          <form onSubmit={handleSearchSubmit}>
            <input
              type='text'
              className='form-control'
              placeholder='Search...'
              value={query}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent default behavior of Enter key
                  handleSearchSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // Manually trigger form submit
                }
              }}
            />
          </form>
        </div>
      </div>
      <div id='post-container'>
        {posts.length === 0 ? (
          <MyFooter /> // Display MyFooter only if there are no posts
        ) : (
          posts.map((post) => {
            if (!post) return null; // Return null to skip rendering this item
            return <PostComponent key={post.id} post={post} />;
          })
        )}
      </div>
      <Loading loading={loading} />
    </>
  );
}
