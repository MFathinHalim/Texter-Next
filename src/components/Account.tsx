import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const Account = ({ user, username, handleFollow }: any) => {
  const router = useRouter();
  const [isFollowing, setIsFollowing] = useState(false);
  const [showProfileLink, setShowProfileLink] = useState(false);
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
      const tokenTemp = await refreshAccessToken();
      if (!tokenTemp) {
        return;
      }
      setToken(tokenTemp);
    }
  });
  useEffect(() => {
    const fetchUserStatus = async () => {
      try {
        const response = await fetch(`/api/user/check`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const check = await response.json();

        if (check.check === true) {
          //logout();
        }
        if (user.username === username) {
          setShowProfileLink(true);
        } else {
          const followResponse = await fetch(`/user/follow/${user.username}?myname=${username}`);
          const followCheck = await followResponse.json();
          setIsFollowing(followCheck.isFollowing);
        }
      } catch (error) {
        console.error("Error fetching user status:", error);
      }
    };

    fetchUserStatus();
  }, [username, user.username]);

  const handleLogout = () => {
    // Implement logout functionality here
    //logout();
  };

  return (
    <div className='p-3 border-light rounded-0 pb-0'>
      <div className='d-flex align-items-center' id='top'>
        <button className='btn btn-outline-light m-2 ms-0 pb-0 pt-0 text-center' onClick={() => router.back()} style={{ border: "none !important", height: "fit-content" }}>
          <i className='fa-solid fa-arrow-left'></i>
        </button>
        <img src={user.pp} className='rounded-circle pfp' alt={`${user.name}'s profile`} />
        <div className='d-flex flex-column ms-2 me-auto'>
          <h5 style={{ marginBottom: "3px" }}>{user.name}</h5>
          <p style={{ marginBottom: "5px" }} className='text-secondary'>
            @{username}
          </p>
        </div>{" "}
        {!showProfileLink && (
          <button className={`btn ${isFollowing ? "btn-outline-danger" : "btn-outline-success"} rounded-pill ms-0 p-3 pt-1 pb-1`} style={{ height: "fit-content", fontSize: "larger" }} onClick={handleFollow}>
            {isFollowing ? "Remove" : "Follow"}
          </button>
        )}
        {showProfileLink && (
          <>
            <a className='btn btn-outline-white rounded-pill border-0 ms-1' href={`/settings/${username}`}>
              <i className='fa-solid fa-gear'></i>
            </a>
            <a id='bookmarkLink' className='btn btn-outline-warning text-warning rounded-pill border-0 ms-1' href={`/bookmark?username=${user.username}`}>
              <i className='fa-solid fa-bookmark'></i>
            </a>
            <button className='btn btn-outline-danger rounded-pill ms-1' onClick={handleLogout}>
              <i className='fa-solid fa-right-from-bracket'></i>
            </button>
          </>
        )}
      </div>
      <p className='mt-2'>{user.desc || ""}</p>
      <div className='d-flex mt-3' style={{ paddingLeft: "5px" }}>
        <p>
          <strong>{user.following.length}</strong> following
        </p>
        <p className='ms-2'>
          <strong>{user.followers.length}</strong> followers
        </p>
      </div>
    </div>
  );
};

export default Account;
