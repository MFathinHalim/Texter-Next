"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState, useCallback } from "react";
import PostComponent from "@/components/Post";
import Loading from "@/components/Loading";

const POSTS_PER_PAGE = 10; // Number of posts to load per request

export default function Home() {
  const isFollowing = useSelector((state: RootState) => state.following.isFollowing);
  const [posts, setPosts] = useState<any[]>([]); // State to hold posts
  const [loading, setLoading] = useState(false); // State to indicate loading
  const [hasMore, setHasMore] = useState(true); // State to determine if more posts are available
  const [page, setPage] = useState(1); // Current page
  const [user, setUser] = useState<any>(null); // User state
  const [token, setToken] = useState("");

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
        } else {
          // Handle case where user is banned or check fails
          setUser(null);
        }
      } catch (error) {
        console.error("Error getting token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (user === null) {
      fetchUserData();
    }
  }, [user]);

  // Function to fetch posts from the API
  const fetchPosts = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/post/${isFollowing ? "following" : ""}?page=${pageNumber}&limit=${POSTS_PER_PAGE}`, { method: "GET", headers: { Authorization: `Bearer ${token}` }, });
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
  }, [isFollowing]);

  // Fetch initial posts
  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  // Clear posts when isFollowing changes
  useEffect(() => {
    setPosts([]);
    setHasMore(true); // Reset hasMore when isFollowing changes
    setPage(1); // Reset to first page
  }, [isFollowing]);

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
        <div className='ps-3 px-3 pt-3 d-flex justify-content-between'>
          <h4>Explore Fathin’s apps.</h4>
          <h4>
            <i className='fa-solid fa-rectangle-ad' />
          </h4>
        </div>
        <div className='scroll-container d-flex flex-row align-items-center'>
        <div className='scroll-item d-flex flex-column text-center align-items-center justify-content-center'>
            <a href='https://kamusrejang.glitch.me/' className='text-decoration-none'>
              <img src='https://www.fathin.my.id/kamus.png' className='rounded-circle border-light p-2' style={{ width: 80, height: 80 }} alt='Logo' />
              <div className='mt-2'>Kamus Bahasa Rejang</div>
            </a>
          </div>
          <div className='scroll-item d-flex flex-column text-center align-items-center justify-content-center'>
            <a href='https://rejangpedia.glitch.me/' className='text-decoration-none'>
              <img src='https://www.fathin.my.id/logo.png' className='rounded-circle border-light p-2' style={{ width: 80, height: 80 }} alt='Logo' />
              <div className='mt-2'>rejangpedia</div>
            </a>
          </div>
          <div className='scroll-item d-flex flex-column text-center align-items-center justify-content-center'>
            <a href='https://shared-gallery.glitch.me/' className='text-decoration-none'>
              <img src='https://ik.imagekit.io/9hpbqscxd/SG/image-3.jpg' className='rounded-circle border-light p-2' style={{ width: 80, height: 80 }} alt='Logo' />
              <div className='mt-2'>Shared Gallery</div>
            </a>
          </div>
          <div className='scroll-item d-flex flex-column text-center align-items-center justify-content-center'>
            <a href='https://mysimplenotes.glitch.me/' className='text-decoration-none'>
              <img src='https://www.fathin.my.id/images' className='rounded-circle border-light p-2' style={{ width: 80, height: 80 }} alt='Logo' />
              <div className='mt-2'>My Simple Notes</div>
            </a>
          </div>
          <div className='scroll-item d-flex flex-column text-center align-items-center justify-content-center'>
            <a href='https://fathinchat.glitch.me/' className='text-decoration-none'>
              <img src='https://cdn.glitch.global/415b2a45-a913-4f2c-96ca-b6598c3c6e8a/logo.png?v=1718077655964' className='rounded-circle border-light p-2' style={{ width: 80, height: 80 }} alt='Logo' />
              <div className='mt-2'>Fathin Chat</div>
            </a>
          </div>
        </div>
      </div>
      {user ? (
        <form className='card post bg-dark text-light p-3 border-light rounded-0' encType='multipart/form-data'>
                    <div className='mb-3'>
            <div className='d-flex mb-2'>
              <img className='rounded-circle' style={{ width: "100%", height: "100%", maxWidth: 60, maxHeight: 60 }} id='mypfp' src={user.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"} alt='Card image' />
              <div className='ms-2 mt-0'>
                <h5 className='card-title mb-1' id='myname'>
                  {user.name || ""}
                </h5>
                <h5 className='text-secondary mt-0'>@{user.username || ""}</h5>
              </div>
            </div>
            <textarea style={{ height: 70, fontSize: "larger" }} className='form-control border-0' id='title' name='title' placeholder="What's Happening?!" defaultValue={""} />
          </div>
          <img style={{ borderRadius: "2% !important" }} className='mb-3 d-none' id='previewForm' />
          <video id='previewForm' height={450} className='mb-3 border-light d-none' loop style={{ borderRadius: "2% !important" }} controls>
            <source id='videoPreview' type='video/mp4' />
          </video>
          <div className='d-flex justify-content-between'>
            <input type='file' className='form-control d-none' id='imgForm' name='image' />
            <label htmlFor='imgForm' className='btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2' style={{ fontSize: "larger" }}>
              <i className='fa-solid fa-file' />
            </label>
            <button type='submit' className='btn btn-primary rounded-pill p-4 pt-2 pb-2' style={{ fontSize: "larger" }}>
              Post
            </button>
          </div>
        </form>
      ) : (
        <a href='/login'>Login</a>
      )}
      <div id='post-container'>
        {posts.map((post) => {
          if (!post) return null; // Return null to skip rendering this item
          return <PostComponent key={post.id} post={post} />;
        })}
      </div>
      <Loading loading={loading} />
    </>
  );
}
