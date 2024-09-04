"use client"; // Ensure this file is treated as a client-side component

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    const response = await fetch('/api/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      // Check if the token is set in sessionStorage
      const data = await response.json();
      if (data.token) {
        sessionStorage.setItem('myToken', data.token);
        router.push('/home');
      }
    } else {
      console.error('Login failed');
    }
  };

  return (
    <div className="border-light rounded-0 p-3 text-center pt-5 pb-5">
      <img 
        style={{ maxWidth: '100px', maxHeight: '100px' }} 
        src="https://ik.imagekit.io/9hpbqscxd/SG/image-67.jpg?updatedAt=1705798245623" 
        alt="Texter Logo"
      />
      <h4 className="h1 text-center">Texter</h4>
      <h4 className="h4 text-center text-secondary">See what's happening?</h4>

      <form onSubmit={handleSubmit}>
        <div className="mb-3 pt-3">
          <input 
            type="text" 
            className="form-control border-light p-3" 
            id="username" 
            name="username" 
            autoComplete="off" 
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <input 
            type="password" 
            className="form-control border-light p-3" 
            id="password" 
            name="password" 
            placeholder="Your Password" 
            autoComplete="off"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button 
          type="submit" 
          className="btn btn-primary p-3 w-100" 
          style={{ fontSize: 'larger' }}
        >
          Sign In
        </button>
      </form>
      <p className="mt-3">
        Don't have an account?{' '}
        <a className="text-info text-decoration-underline" href="/signup">
          Sign up
        </a>
      </p>
    </div>
  );
}
