"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

export default function Settings() {
  const [displayName, setDisplayName] = useState<string>("");
  const [desc, setDesc] = useState<string>("");
  const [token, setToken] = useState<string>(""); // Token state
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>(""); // For previewing the uploaded image
  const [currentPfp, setCurrentPfp] = useState<string>(""); // Store current profile picture
  const [theme, setTheme] = useState("auto");
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Ref for the file input element
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const applyTheme = (theme: string) => {
    localStorage.setItem("theme", theme);
    if (theme === "auto") {
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.setAttribute("data-theme", "dark");
      } else {
        document.documentElement.setAttribute("data-theme", "light");
      }
      return;
    }
    document.documentElement.setAttribute("data-theme", theme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "auto";
    applyTheme(savedTheme);
  }, []);

  const refreshAccessToken = async () => {
    try {
      const savedToken = sessionStorage.getItem("myToken");
      if (savedToken) {
        setToken(savedToken); // Set token from session storage
        return savedToken;
      }
      const response = await fetch("/api/refreshToken", {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (response.ok) {
        sessionStorage.setItem("myToken", data.token);
        setToken(data.token); // Set the token after refreshing it
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
    const fetchUserData = async () => {
      const fetchedToken = await refreshAccessToken();
      if (!fetchedToken) {
        router.push("/login"); // Redirect if not logged in
        return;
      }

      try {
        const response = await fetch(`/api/user/check`, {
          headers: { Authorization: `Bearer ${fetchedToken}` }, // Use the correct token here
        });
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        if (!data.check && data.user) {
          setDisplayName(data.user.name);
          setDesc(data.user.desc);
          setCurrentPfp(data.user.pp); // Set current profile picture from the API response
        } else {
          console.error("Invalid user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  // Handle image change and preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files ? e.target.files[0] : null;
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string); // Update preview with base64 data
      };
      reader.readAsDataURL(file); // Read image as data URL for preview
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const formData = new FormData();
    formData.append("name", displayName);
    formData.append("desc", desc);
    if (image) {
      formData.append("image", image); // Append the new image if uploaded
    }

    const response = await fetch(`/api/user/updateProfile`, {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` }, // Use token in request headers
      body: formData,
    });
  };

  const handleThemeChange = (theme: string) => {
    setTheme(theme);
    applyTheme(theme);
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className={`card bg-dark p-4 text-light border-light`}>
      <h4 className="text-center mb-4">Settings</h4>
      
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        {/* Profile Section */}
        <h3 className="text-light">Edit Your Profile</h3>
        <div className="card p-4 bg-dark border-light mb-4">
          <div className="text-center mb-1">
            {/* Clickable profile picture */}
            <img
              src={imagePreview || currentPfp || "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"}
              alt="Profile Preview"
              className="rounded-circle mb-3"
              style={{ width: 120, height: 120, objectFit: "cover", cursor: "pointer", boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)" }}
              onClick={() => fileInputRef.current?.click()} // Trigger file input when clicking on the image
            />

            {/* Hidden file input */}
            <input
              type="file"
              className="d-none"
              id="imgEdit"
              name="image"
              accept="image/*"
              onChange={handleImageChange} // Handle image change
              ref={fileInputRef} // Use ref to control this input
            />
          </div>

          <div className="mb-1">
            <label htmlFor="displayName" className="form-label text-light">Display Name</label>
            <input
              type="text"
              className="form-control border-light bg-dark text-light"
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your new display name"
            />
          </div>

          <div className="mb-3">
            <label htmlFor="desc" className="form-label text-light">Description</label>
            <textarea
              className="form-control border-light bg-dark text-light"
              id="desc"
              name="desc"
              rows={4}
              placeholder="Enter your new description"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-success w-100 rounded-pill p-2" style={{ fontSize: "larger" }}>
            Save Changes
          </button>
        </div>

        {/* Theme Section */}
        <h3 className="text-light">Edit Your Display</h3>
        <div className="card bg-dark text-light p-4 border-light">
          <h4 className="mb-3">Background Theme</h4>
          <div className="d-flex justify-content-between">
            <button onClick={() => handleThemeChange("auto")} className="btn btn-primary w-100 me-2">
              Auto
            </button>
            <button onClick={() => handleThemeChange("light")} className="btn btn-light w-100">
               Light Mode
            </button>
          </div>
          <div className="d-flex justify-content-between mt-3">
            <button onClick={() => handleThemeChange("dark")} className="btn btn-dark w-100 me-2">
               Dark Mode
            </button>
            <button onClick={() => handleThemeChange("dim")} className="btn btn-secondary w-100">
              Dim
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
