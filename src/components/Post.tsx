import React from 'react';

export default function PostComponent({ post }: any) {
  if(!post || !post.user) return
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
  const renderTitleWithLinks = (title: string) => {
    // Split the title by hashtags
    const parts = title.split(/(#\w+)/g);

    return parts.map((part, index) => {
      // Check if the part starts with '#' (indicating a hashtag)
      if (part.startsWith('#')) {
        const tag = part.slice(1); // Remove the '#' character for the URL
        return (
          <a
            key={index}
            href={`/?search=${tag}`}
            className="text-info"
          >
            {part}
          </a>
        );
      }

      // Return non-hashtag text as is
      return part;
    });
  };
  return (
    <div className="card bg-dark text-white p-3 post rounded-0 border-light">
      <a href={`/@${post.user.username}/${post.id.includes('txtr') ? post._id : post.id}`}>
        <div>
          {post.repost && (
            <p className="text-secondary mb-1 ms-1">
              <i className="fa-solid fa-recycle" /> {decodeHTML(post.user.name)} reposted
            </p>
          )}
          <article className="d-flex pt-2 justify-content-between">
            <article className="d-flex">
              <img
                className="pfp rounded-circle"
                src={post.repost ? post.repost.pp : post.user.pp}
                alt="Profile"
              />
              <div className="ms-2">
                <h5 className="font-weight-bold">
                  {post.repost
                    ? decodeHTML(post.repost.name)
                    : decodeHTML(post.user.name)}
                  {post.reQuote ? ` Requoted ${decodeHTML(post.reQuote.user.name)}` : ''}
                </h5>
                <h5 className="text-secondary">{post.time}</h5>
              </div>
            </article>
            <button
              className="btn btn-outline-light border-none rounded-pill ms-2"
              style={{ border: "0px !important" }}
            >
              <i className="fa-solid fa-flag" />
            </button>
          </article>
        </div>
      </a>
      <h3 className="h5 mt-2">
        <a href={`/@${post.user.username}/${post.id.includes('txtr') ? post._id : post.id}`}>
        { renderTitleWithLinks(post.title)}
        </a>
      </h3>
      {post.img && (
        post.img.includes(".mp4") || post.img.includes(".ogg") ? (
          <video
            height={450}
            className="mb-3 border-light"
            loop
            style={{ borderRadius: "2% !important", width: "100%" }}
            controls
          >
            <source src={post.img} type="video/mp4" />
          </video>
        ) : (
          <img
            style={{ borderRadius: "2% !important" }}
            className="mb-3"
            src={post.img}
            alt="Post"
            onError={handleImageError}
          />
        )
      )}
      {post.reQuote && (
        <div className="card bg-dark text-white p-2 mb-2 mt-2 border-1 border-secondary">
          <a href={`/?id=${post.reQuote.id}`}>
            <article className="d-flex pt-2">
              <img className="pfp rounded-circle" src={post.reQuote.user.pp} alt="Profile" />
              <div className="ms-2">
                <h4 className="mb-0">{decodeHTML(post.reQuote.user.name)}</h4>
                <h5 className="text-secondary">{post.reQuote.time}</h5>
              </div>
            </article>
            <h3 className="h4 mt-2">{renderTitleWithLinks(post.title)}</h3>
            {post.reQuote.img && (
              post.reQuote.img.includes(".mp4") || post.reQuote.img.includes(".ogg") ? (
                <video
                  height={450}
                  className="border-light"
                  loop
                  style={{ borderRadius: "2% !important", width: "100%" }}
                  controls
                >
                  <source src={post.reQuote.img} type="video/mp4" />
                </video>
              ) : (
                <img
                  style={{ borderRadius: "2% !important" }}
                  className="mb-3"
                  src={post.reQuote.img}
                  alt="Requoted Post"
                  onError={handleImageError}
                />
              )
            )}
          </a>
        </div>
      )}
      <div className="d-flex">
        <button
          className="btn btn-outline-danger rounded-pill"
          id={`like-btn-${post.id}`}
        >
          <i className="fa-solid fa-heart" /> {post.like.users.length}
        </button>
        <a
          href={`/?id=${post.id}`}
          className="btn btn-outline-secondary rounded-pill text-black ms-2"
        >
          <i className="fa-solid fa-comment" />
        </a>
        <button
          className="btn btn-outline-success rounded-pill ms-2"
        >
          <i className="fa-solid fa-recycle" />
        </button>
        <button
          className="btn btn-outline-info rounded-pill ms-2"
        >
          <i className="fa-solid fa-share" />
        </button>
        <button
          className="btn btn-outline-secondary rounded-pill ms-2"
        >
          <i className="fa-solid fa-bookmark" />
        </button>
      </div>
    </div>
  );
}
