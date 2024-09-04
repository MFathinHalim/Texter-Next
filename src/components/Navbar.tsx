"use client"

import { useDispatch, useSelector } from 'react-redux';
import { toggleFollowing } from '../store/followingSlice';
import { RootState, AppDispatch } from '../store/store';
import { usePathname } from 'next/navigation'; // Import usePathname
function MyNavbar() {
  const dispatch = useDispatch<AppDispatch>();
  const isFollowing = useSelector((state: RootState) => state.following.isFollowing);
  const pathName = usePathname()
  const isHomePage = pathName === '/';
  return (
    <nav
      className="navbar container navbar-dark sticky-top bg-dark-glass"
      style={{ paddingTop: "10px", paddingBottom: "10px" }}
    >
      <a className="navbar-brand ms-3 pb-0" href="/">
        <img
          src="https://ik.imagekit.io/9hpbqscxd/SG/image-67.jpg?updatedAt=1705798245623"
          width={30}
          height={30}
          alt="Logo"
        />
      </a>
        <div
          id="followingfollowers"
          className="text-light border-0 pb-0 rounded-0 mx-auto"
        >
          <div className={`d-flex ${!isHomePage ? 'd-none' : ''}`}>
            <a
              id="forYou"
              className={`bg-0 rounded-0 flex-fill text-center ${!isFollowing ? 'active' : ''}`}
              onClick={() => dispatch(toggleFollowing())}
              >
              For you
            </a>
            <a
              id="following"
              className={`bg-0 ms-3 rounded-0 flex-fill text-center ${isFollowing ? 'active' : ''}`}
              onClick={() => dispatch(toggleFollowing())}
            >
              Following
            </a>
          </div>
        </div>
      <a
        className="btn btn-outline-dark rounded-pill m-2 mt-0 mb-0 ms-0"
        style={{ fontSize: "larger", border: "none" }}
        href="/video"
      >
        <i className="fa-solid fa-clapperboard" />
      </a>
    </nav>
    
  );
}

export default MyNavbar;
