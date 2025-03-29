import React, { useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRetweet, faFlag, faHeart, faComment, faShare, faBookmark } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";

export default function PostComponent({ post }: any) {
  const [likeCount, setLikeCount] = useState(post.like.users.length);
  const [isLiked, setIsLiked] = useState(post.like.users.includes("currentUserId")); // Change based on logged-in user

  if (!post || !post.user) return;

  // Function to handle image loading error
  const handleImageError = (e: any) => {
    e.currentTarget.remove();
  };

  // Function to escape HTML entities in strings
  const decodeHTML = (html: any) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  // Function to handle like button click
  const handleLike = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      const response = await axios.post(`/api/post/like/${post._id}`, {}, config);

      // Update UI after liking/unliking
      setLikeCount(response.data.post.like.users.length);
      setIsLiked(!isLiked);
    } catch (error) {
      console.error("Error liking post:", error);

      // If token expired, refresh it and retry
      if (error.response && error.response.status === 401) {
        const refreshed = await refreshAccessToken(); // Refresh token function
        if (refreshed) handleLike(); // Retry like after token refresh
      }
    }
  };

  const refreshAccessToken = async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      const response = await axios.post("/api/auth/refresh", { token: refreshToken });

      if (response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      return false;
    }
  };

  const renderTitleWithLinks = (title: string) => {
    // Split the title by hashtags
    const parts = title.split(/(#\w+)/g);

    return parts.map((part, index) => {
      // Check if the part starts with '#' (indicating a hashtag)
      if (part.startsWith("#")) {
        const tag = part.slice(1); // Remove the '#' character for the URL
        return (
          <a key={index} href={`/search/${tag}`} className='text-info'>
            {part}
          </a>
        );
      }
      return part;
    });
  };

  return (
    <div className='card post bg-dark text-white p-3 rounded-0 border-light'>
      <a href={`/${post.user.username}/${post.id.includes("txtr") ? post._id : post.id}`}>
        <div>
          {post.repost && (
            <p className='text-secondary mb-1 ms-1'>
              <FontAwesomeIcon icon={faRetweet} /> {decodeHTML(post.user.name)} reposted
            </p>
          )}
          <article className='d-flex pt-2 justify-content-between'>
            <article className='d-flex'>
              <a href={`/${post.user.username}/`}>
                <img className='pfp rounded-circle' src={post.repost ? post.repost.pp : post.user.pp} alt='Profile' />
              </a>
              <a href={`/${post.user.username}/`} className='ms-2'>
                <h4 className='font-weight-bold h5'>
                  {post.repost ? decodeHTML(post.repost.name) : decodeHTML(post.user.name)}
                  {post.reQuote ? ` Requoted ${decodeHTML(post.reQuote.user.name)}` : ""}
                </h4>
                <h5 className='text-secondary'>{post.time}</h5>
              </a>
            </article>
            <button className='btn btn-outline-light border-none rounded-pill ms-2' style={{ border: "0px !important" }}>
              <FontAwesomeIcon icon={faFlag} />
            </button>
          </article>
        </div>
        <h3 className='h5 mt-2'>
          {renderTitleWithLinks(post.title)}
        </h3>
        {post.img &&
          (post.img.includes(".mp4") || post.img.includes(".ogg") ? (
            <video height={450} className='mb-3 border-light' loop style={{ borderRadius: "2% !important", width: "100%" }} controls>
              <source src={post.img} type='video/mp4' />
            </video>
          ) : (
            <img style={{ borderRadius: "2% !important" }} className='mb-3' src={post.img} alt='Post' onError={handleImageError} />
          ))}
      </a>
      <div className='d-flex'>
        <button
          className={`btn ${isLiked ? "btn-danger" : "btn-outline-danger"} rounded-pill`}
          id={`like-btn-${post.id}`}
          onClick={handleLike}
        >
          <FontAwesomeIcon icon={faHeart} /> {likeCount}
        </button>
        <a href={`/?id=${post.id}`} className='btn btn-outline-secondary rounded-pill text-black ms-2'>
          <FontAwesomeIcon icon={faComment} />
        </a>
        <button className='btn btn-outline-success rounded-pill ms-2'>
          <FontAwesomeIcon icon={faRetweet} />
        </button>
        <button className='btn btn-outline-info rounded-pill ms-2'>
          <FontAwesomeIcon icon={faShare} />
        </button>
        <button className='btn btn-outline-secondary rounded-pill ms-2'>
          <FontAwesomeIcon icon={faBookmark} />
        </button>
      </div>
    </div>
  );
}
