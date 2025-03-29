"use client";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";
import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import PostComponent from "@/components/Post";
import Loading from "@/components/Loading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFile } from "@fortawesome/free-solid-svg-icons";

const POSTS_PER_PAGE = 10;

export default function Home() {
  const isFollowing = useSelector((state: RootState) => state.following.isFollowing);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [user, setUser] = useState<any>(null);
  const [token, setToken] = useState("");
  const [title, setTitle] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null); // For preview
  const router = useRouter();

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
        const tokenTemp = await refreshAccessToken();
        if (!tokenTemp) return;

        setToken(tokenTemp);
        const response = await fetch(`/api/user/check`, {
          headers: { Authorization: `Bearer ${tokenTemp}` },
        });
        if (!response.ok) throw new Error("Failed to fetch user data");

        const check = await response.json();
        setUser(check.check ? null : check.user);
      } catch (error) {
        console.error("Error getting token:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    if (user === null) fetchUserData();
  }, [user]);

  const fetchPosts = useCallback(async (pageNumber: number) => {
    setLoading(true);
    try {
      const response = await fetch(
        `/api/post/${isFollowing ? "following" : ""}?page=${pageNumber}&limit=${POSTS_PER_PAGE}`,
        { method: "GET", headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
      );
      const data = await response.json();
      if (data.posts.length === 0) setHasMore(false);
      setPosts((prevPosts) => [...prevPosts, ...data.posts]);
    } catch (error) {
      console.error("Error fetching posts:", error);
    } finally {
      setLoading(false);
    }
  }, [isFollowing]);

  useEffect(() => {
    fetchPosts(page);
  }, [page, fetchPosts]);

  useEffect(() => {
    setPosts([]);
    setHasMore(true);
    setPage(1);
  }, [isFollowing]);

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) return;
    if (hasMore) setPage((prevPage) => prevPage + 1);
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImage(file);
    setImagePreview(file ? URL.createObjectURL(file) : null); // Create image preview
  };

  const handlePostSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    if (image) {
      formData.append("image", image);
    }

    try {
      setLoading(true);
      const response = await fetch("/api/post", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.post && data.post.id) {
        router.push(`/post/${data.post.id}`);
      } else {
        console.error("Failed to post", data.error);
      }
    } catch (error) {
      console.error("Error posting:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Header section with ads */}
      <div className="card rounded-0 bg-dark border-light text-white">
        {/* Ads content can go here */}
      </div>

      {user ? (
        <form onSubmit={handlePostSubmit} className="card post bg-dark text-light p-3 border-light rounded-0">
          <div className="mb-3">
            <div className="d-flex mb-2">
              <img
                className="rounded-circle"
                style={{ width: "100%", height: "100%", maxWidth: 60, maxHeight: 60 }}
                src={user.pp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
                alt="User profile"
              />
              <div className="ms-2">
                <h5>{user.name}</h5>
                <h5 className="text-secondary">@{user.username}</h5>
              </div>
            </div>
            <textarea
              className="form-control border-0"
              placeholder="What's Happening?!"
              style={{ height: 70, fontSize: "larger" }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          {/* Image Preview */}
          {imagePreview && (
            <div className="mb-3">
              <img src={imagePreview} alt="Preview" className="img-fluid rounded" style={{ maxHeight: 200 }} />
            </div>
          )}

          <div className="d-flex justify-content-between">
            <input type="file" className="form-control d-none" id="imgForm" onChange={handleImageChange} />
            <label htmlFor="imgForm" className="btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2" style={{ fontSize: "larger" }}>
              <FontAwesomeIcon icon={faFile} />
            </label>
            <button type="submit" className="btn btn-primary rounded-pill p-4 pt-2 pb-2" style={{ fontSize: "larger" }}>
              Post
            </button>
          </div>
        </form>
      ) : (
        <a href="/login">Login</a>
      )}

      <div id="post-container">
        {posts.map((post) => post && <PostComponent key={post.id} post={post} />)}
      </div>
      <Loading loading={loading} />
    </>
  );
}
