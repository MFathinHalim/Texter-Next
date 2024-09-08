"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import PostComponent from "@/components/Post";

const fetchPostData = async (postId: string) => {
  const response = await fetch(`/api/post/${postId}`);
  if (!response.ok) {
    throw new Error("Failed to fetch post data");
  }
  const post = await response.json();
  return post.posts.post;
};

const fetchRepliesData = async (postId: string) => {
  const response = await fetch(`/api/post/replies/${postId}/`);
  if (!response.ok) {
    throw new Error("Failed to fetch replies data");
  }
  const data = await response.json();
  console.log(data.replies);
  return data.replies;
};

const Post = () => {
  const { postId } = useParams();
  const [post, setPost] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showRequoteModal, setShowRequoteModal] = useState(false);

  useEffect(() => {
    if (!postId) return;

    const loadPostData = async () => {
      try {
        const data = await fetchPostData(postId as string);
        setPost(data);
        const repliesData = await fetchRepliesData(postId as string);
        setReplies(repliesData);
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

  const handleRequoteSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle requote submission logic here
  };

  return (
    <>
      {post ? (
        <>
          <div className='card rounded-0 bg-dark border-light text-white'>
            <div className='p-3 d-flex'>
              <button className='btn btn-outline-light m-2 ms-0 pb-0 pt-0 text-center' onClick={() => window.history.back()} style={{ border: "none !important", height: "fit-content" }}>
                <i className='fa-solid fa-arrow-left' />
              </button>
              <h4 className='mt-1'>Posts</h4>
            </div>
          </div>
          <PostComponent key={post.id} post={post} />
          <form
            className='bg-dark text-light p-3 border-light rounded-3 shadow-lg'
            id='reply'
            onSubmit={(e) => {
              e.preventDefault();
              // Handle reply submission logic here
            }}>
            <div className='d-flex mb-3'>
              <img
                className='rounded-circle'
                style={{ width: "60px", height: "60px" }}
                src={post.user.pp} // Use dynamic profile picture
                alt='Profile'
              />
              <div className='ms-3 mt-1'>
                <h5 className='mb-1'>{post.user.name}</h5>
                <h6 className='text-secondary'>{post.time}</h6>
              </div>
            </div>

            <div className='mb-3'>
              <textarea className='form-control border-0 rounded-3' style={{ fontSize: "16px", minHeight: "100px" }} name='title' placeholder='Post your reply'></textarea>
            </div>

            <div className='mb-3'>
              <img
                className='img-fluid rounded-3 mb-2 d-none'
                id='previewReply'
                src='' // Set dynamic source as needed
                alt='Preview'
              />
              <video className='img-fluid rounded-3 mb-2 d-none' loop style={{ maxWidth: "100%" }} controls>
                <source type='video/mp4' />
              </video>
            </div>

            <div className='d-flex justify-content-between align-items-center'>
              <input type='file' className='form-control d-none' id='imgReply' name='image' />
              <label htmlFor='imgReply' className='btn btn-outline-secondary rounded-pill p-2 px-3 d-flex align-items-center' style={{ fontSize: "14px" }}>
                <i className='fa-solid fa-file me-2'></i> Image
              </label>
              <button className='btn btn-success rounded-pill px-4 py-2' onClick={() => setShowRequoteModal(true)}>
                <i className='fa-solid fa-retweet me-2'></i> Requote
              </button>
              <button type='submit' className='btn btn-primary rounded-pill px-4 py-2' style={{ fontSize: "16px" }}>
                Reply
              </button>
            </div>
          </form>

          {/* Requote Modal */}
          {showRequoteModal && (
            <div className='popup' onClick={() => setShowRequoteModal(false)}>
              <div className='popup-content' onClick={(e) => e.stopPropagation()}>
                <form className='bg-dark-glass text-light p-3 border-light rounded' onSubmit={handleRequoteSubmit} encType='multipart/form-data'>
                  <button className='close-btn' type='button' onClick={() => setShowRequoteModal(false)}>
                    <i className='fa-solid fa-xmark'></i>
                  </button>
                  <div className='mb-3'>
                    <div className='d-flex mb-2'>
                      <img className='rounded-circle' style={{ width: "70px", height: "70px" }} src={post.user.pp} alt='Profile' />
                      <div className='ms-2 mt-0'>
                        <h5 className='card-title'>{post.user.name}</h5>
                        <h5 className='text-secondary'>{post.time}</h5>
                      </div>
                    </div>
                    <textarea style={{ height: "70px", fontSize: "larger" }} className='form-control border-0' name='title' placeholder='Type your quote here!'></textarea>
                  </div>
                  <img className='mb-3' style={{ borderRadius: "2%" }} id='previewRequote' alt='Preview' />
                  <video className='mb-3 border-light d-none' loop style={{ borderRadius: "2%" }} controls>
                    <source type='video/mp4' />
                  </video>
                  <div className='d-flex justify-content-between'>
                    <input type='file' className='form-control d-none' id='imgRequote' name='image' />
                    <label htmlFor='imgRequote' className='btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2' style={{ fontSize: "larger" }}>
                      <i className='fa-solid fa-file'></i>
                    </label>
                    <button type='submit' className='btn btn-success rounded-pill p-4 pt-2 pb-2' style={{ fontSize: "larger" }}>
                      Quote
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {/* Replies Section */}
          <div>{replies.length > 0 ? replies.map((reply: any) => <PostComponent key={reply.id} post={reply} />) : <p>No replies yet.</p>}</div>
        </>
      ) : (
        <p>No post data available.</p>
      )}
    </>
  );
};

export default Post;
