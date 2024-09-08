"use client";
import { useState } from "react";
import { useRouter } from "next/navigation"; // Import useRouter for navigation
import MyFooter from "@/components/Footer";


export default function Search() {
  const router = useRouter(); // Initialize the router
  const [query, setQuery] = useState(""); // Search query

  // Handle search input change
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  // Handle form submit
  const handleSearchSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault(); // Prevent default form submission
    // Update URL to include search query
    if (query.trim()) {
      router.push(`/search/${encodeURIComponent(query.trim())}`);
    }
  };


  return (
    <>
      <div className='card rounded-lg mb-2 bg-dark border-light text-white'>
        <div className='p-3'>
          <h4>Search Posts</h4>
          <form onSubmit={handleSearchSubmit}>
            <input
              type='text'
              className='form-control'
              placeholder='Search...'
              value={query}
              onChange={handleSearchChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault(); // Prevent default behavior of Enter key
                  handleSearchSubmit(e as unknown as React.FormEvent<HTMLFormElement>); // Manually trigger form submit
                }
              }}
            />
          </form>
        </div>
      </div>
      <div id='post-container'>
          <MyFooter /> // Display MyFooter only if there are no posts
      </div>
    </>
  );
}
