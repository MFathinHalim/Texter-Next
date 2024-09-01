"use client"
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';
export default function Home() {
  const isFollowing = useSelector((state: RootState) => state.following.isFollowing);
  return (
<>
  <div className="card rounded-0 bg-dark border-light text-white">
    <div className="ps-3 px-3 pt-3 d-flex justify-content-between">
      <h4>Explore Fathin’s apps.</h4>
      <h4>
        <i className="fa-solid fa-rectangle-ad" />
      </h4>
    </div>
    <div className="scroll-container d-flex flex-row align-items-center">
      <div className="scroll-item d-flex flex-column text-center align-items-center justify-content-center">
        <a
          href="https://kamusrejang.glitch.me/"
          className="text-decoration-none"
        >
          <img
            src="https://www.fathin.my.id/kamus.png"
            className="rounded-circle border-light p-2"
            style={{ width: 80, height: 80 }}
            alt="Logo"
          />
          <div className="mt-2">Kamus Bahasa Rejang</div>
        </a>
      </div>
      <div className="scroll-item d-flex flex-column text-center align-items-center justify-content-center">
        <a
          href="https://rejangpedia.glitch.me/"
          className="text-decoration-none"
        >
          <img
            src="https://www.fathin.my.id/logo.png"
            className="rounded-circle border-light p-2"
            style={{ width: 80, height: 80 }}
            alt="Logo"
          />
          <div className="mt-2">rejangpedia</div>
        </a>
      </div>
      <div className="scroll-item d-flex flex-column text-center align-items-center justify-content-center">
        <a
          href="https://shared-gallery.glitch.me/"
          className="text-decoration-none"
        >
          <img
            src="https://ik.imagekit.io/9hpbqscxd/SG/image-3.jpg"
            className="rounded-circle border-light p-2"
            style={{ width: 80, height: 80 }}
            alt="Logo"
          />
          <div className="mt-2">Shared Gallery</div>
        </a>
      </div>
      <div className="scroll-item d-flex flex-column text-center align-items-center justify-content-center">
        <a
          href="https://mysimplenotes.glitch.me/"
          className="text-decoration-none"
        >
          <img
            src="https://www.fathin.my.id/images"
            className="rounded-circle border-light p-2"
            style={{ width: 80, height: 80 }}
            alt="Logo"
          />
          <div className="mt-2">My Simple Notes</div>
        </a>
      </div>
      <div className="scroll-item d-flex flex-column text-center align-items-center justify-content-center">
        <a
          href="https://fathinchat.glitch.me/"
          className="text-decoration-none"
        >
          <img
            src="https://cdn.glitch.global/415b2a45-a913-4f2c-96ca-b6598c3c6e8a/logo.png?v=1718077655964"
            className="rounded-circle border-light p-2"
            style={{ width: 80, height: 80 }}
            alt="Logo"
          />
          <div className="mt-2">Fathin Chat</div>
        </a>
      </div>
    </div>
  </div>
  <form
    className="card post bg-dark text-light p-3 border-light rounded-0"
    encType="multipart/form-data"
  >
    <div className="mb-3">
      <div className="d-flex mb-2">
        <img
          className="rounded-circle"
          style={{ width: "100%", height: "100%", maxWidth: 60, maxHeight: 60 }}
          id="mypfp"
          src="https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
          alt="Card image"
        />
        <div className="ms-2 mt-0">
          <h5 className="card-title" id="myname" />
          <h5 className="text-secondary" id="currentTime" />
        </div>
      </div>
      <textarea
        style={{ height: 70, fontSize: "larger" }}
        className="form-control border-0"
        id="title"
        name="title"
        placeholder="What's Happening?!"
        defaultValue={""}
      />
    </div>
    <img
      style={{ borderRadius: "2% !important" }}
      className="mb-3 d-none"
      id="previewForm"
    />
    <video
      id="previewForm"
      height={450}
      className="mb-3 border-light d-none"
      loop
      style={{ borderRadius: "2% !important" }}
      controls
    >
      <source id="videoPreview" type="video/mp4" />
    </video>
    <div className="d-flex justify-content-between">
      <input
        type="file"
        className="form-control d-none"
        id="imgForm"
        name="image"
      />
      <label
        htmlFor="imgForm"
        className="btn btn-outline-secondary rounded-pill p-3 pt-2 pb-2"
        style={{ fontSize: "larger" }}
      >
        <i className="fa-solid fa-file" />
      </label>
      <button
        type="submit"
        className="btn btn-primary rounded-pill p-4 pt-2 pb-2"
        style={{ fontSize: "larger" }}
      >
        Post
      </button>
    </div>
    <div id="loading-screen" className="d-none">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <p>Loading...</p>
    </div>
  </form>
  <p>Following status: {isFollowing ? 'Following' : 'Not Following'}</p>
  <div id="post-container" />
</>
  );
}
