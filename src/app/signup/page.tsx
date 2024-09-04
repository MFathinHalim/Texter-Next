"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";


export default function SignUp() {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
    
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name, username, password }),
        });
    
        if (response.ok) {
          // Check if the token is set in sessionStorage

            router.push('/login');
        } else {
          console.error('Login failed');
        }
      };
 return (
 <div className="border-light rounded-0 p-3 text-center pt-5 pb-5">
    <img
      style={{ maxWidth: 100, maxHeight: 100 }}
      src="https://ik.imagekit.io/9hpbqscxd/SG/image-67.jpg?updatedAt=1705798245623"
      alt=""
    />
    <h4 className="h1 text-center">Join Texter now</h4>
    <h4 className="h4 text-center text-secondary mb-3">Tell us who are you</h4>
    <form action="/signup" method="POST" encType="application/json" onSubmit={handleSubmit}>
      <div className="mb-3">
        <input
          type="text"
          className="form-control border-light p-3"
          id="name"
          placeholder="Display Name"
          autoComplete="off"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="text"
          className="form-control border-light p-3"
          placeholder="Username"
          id="username"
          autoComplete="off"
          name="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
      <div className="mb-3">
        <input
          type="password"
          className="form-control border-light p-3"
          id="password"
          placeholder="Password"
          name="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button
        type="submit"
        style={{ fontSize: "larger" }}
        className="btn btn-success p-3 w-100"
      >
        Sign Up
      </button>
    </form>
    <p className="mt-3">
      Already have an account?
      <a className="ps-1 text-info text-decoration-underline" href="/login">
        Sign In
      </a>
    </p>
  </div>
  )
}
