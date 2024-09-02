"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PostComponent from "@/components/Post";

// Utility function to fetch post data
const fetchPostData = async (postId: string) => {
  const response = await fetch(`/api/post/${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post data");
  }
  const post = await response.json();
  return post.posts.post;
};

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null); // Replace `any` with the correct type if known
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!postId) return; // Ensure postId is available before fetching

    const loadPostData = async () => {
      try {
        const data = await fetchPostData(postId as string);
        setPost(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadPostData();
  }, [postId]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      {post ? (
        <>
          <PostComponent key={post.id} post={post} />

          <form
            className="bg-dark text-white post p-3 border-light rounded-0 pb-0"
            id="reply"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle reply submission logic here
            }}
          >
            <div className="d-flex flex-column mb-2">
              <div className="d-flex mb-2">
                <img
                  className="rounded-circle"
                  style={{ width: "100%", height: "100%", maxWidth: "60px", maxHeight: "60px" }}
                  src={post.user.pp} // Use dynamic profile picture
                  alt="Profile"
                />
                <div className="ms-2 mt-0">
                  <h5 className="card-title">{post.user.name}</h5>
                  <h5 className="text-secondary">{post.time}</h5>
                </div>
              </div>
              <textarea
                className="form-control border-0"
                style={{ fontSize: "larger" }}
                name="title"
                placeholder="Post your reply"
              ></textarea>
            </div>
            <img
              className="mb-3"
              style={{ borderRadius: "2%" }}
              id="previewReply"
              src="" // Set dynamic source as needed
              alt="Preview"
            />
            <video
              className="mb-3 border-light d-none"
              loop
              style={{ width: "100%", borderRadius: "2%" }}
              controls
            >
              <source type="video/mp4" />
            </video>
            <div className="mb-3 d-flex justify-content-between">
              <input type="file" className="form-control d-none" id="imgReply" name="image" />
              <label
                htmlFor="imgReply"
                className="btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2"
                style={{ fontSize: "larger" }}
              >
                <i className="fa-solid fa-file"></i>
              </label>
              <button
                type="submit"
                className="btn btn-primary rounded-pill p-4 pt-2 pb-2"
                style={{ fontSize: "larger" }}
              >
                Reply
              </button>
            </div>
          </form>

          {/* Requote Form */}
          <form
            className="bg-dark text-white post p-3 border-light rounded-0 pb-0"
            onSubmit={(e) => {
              e.preventDefault();
              // Handle requote submission logic here
            }}
          >
            <div className="d-flex flex-column mb-2">
              <div className="d-flex mb-2">
                <img
                  className="rounded-circle"
                  style={{ width: "100%", height: "100%", maxWidth: "60px", maxHeight: "60px" }}
                  src={post.user.pp} // Use dynamic profile picture
                  alt="Profile"
                />
                <div className="ms-2 mt-0">
                  <h5 className="card-title">{post.user.name}</h5>
                  <h5 className="text-secondary">{post.time}</h5>
                </div>
              </div>
              <textarea
                className="form-control border-0"
                style={{ fontSize: "larger" }}
                name="title"
                placeholder="Type your quote here!"
              ></textarea>
            </div>
            <img
              className="mb-3"
              style={{ borderRadius: "2%" }}
              id="previewRequote"
              src="" // Set dynamic source as needed
              alt="Preview"
            />
            <video
              className="mb-3 border-light d-none"
              loop
              style={{ width: "100%", borderRadius: "2%" }}
              controls
            >
              <source type="video/mp4" />
            </video>
            <div className="mb-3 d-flex justify-content-between">
              <input type="file" className="form-control d-none" id="imgRequote" name="image" />
              <label
                htmlFor="imgRequote"
                className="btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2"
                style={{ fontSize: "larger" }}
              >
                <i className="fa-solid fa-file"></i>
              </label>
              <button
                type="submit"
                className="btn btn-success rounded-pill p-4 pt-2 pb-2"
                style={{ fontSize: "larger" }}
              >
                Quote
              </button>
            </div>
          </form>
        </>
      ) : (
        <p>No post data available.</p>
      )}
    </>
  );
};

export default Post;
