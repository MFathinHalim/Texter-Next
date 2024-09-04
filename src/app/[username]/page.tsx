"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Account from '@/components/Account';
import PostComponent from '@/components/Post';
import Loading from '@/components/Loading';

const POSTS_PER_PAGE = 5;

const fetchUserData = async (username: string) => {
  const res = await fetch(`/api/${username}`);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

const fetchPosts = async (username: string, page: number, search: string) => {
  const res = await fetch(`/api/post/user/${username}?page=${page}&limit=${POSTS_PER_PAGE}${search ? `&search=${search}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

const UserProfile = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);

  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  // Fetch user data once
  useEffect(() => {
    if (!username) return;

    const loadUserData = async () => {
      try {
        const userData = await fetchUserData(username);
        setUser(userData.user.user);
      } catch (error) {
        console.error('Error loading user data:', error);
        router.push('/');
      } finally {
        setLoadingUser(false);
      }
    };

    loadUserData();
  }, [username, router]);

  // Fetch posts data
  const fetchPostsData = useCallback(async (pageNumber: number) => {
    if (loadingPosts || !hasMorePosts) return;

    setLoadingPosts(true);
    try {
      const postsData = await fetchPosts(username, pageNumber, search);
      setPosts((prevPosts) => [...prevPosts, ...postsData.posts.posts]);
      setHasMorePosts(postsData.posts.posts.length === POSTS_PER_PAGE);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoadingPosts(false);
    }
  }, [username, search, loadingPosts, hasMorePosts]);

  // Load initial posts
  useEffect(() => {
    fetchPostsData(page); // Load posts for current page
  }, [page, fetchPostsData]);

  // Handle scroll to load more posts
  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop >= document.documentElement.offsetHeight - 100) {
        if (!loadingPosts && hasMorePosts) {
          setPage((prevPage) => prevPage + 1);
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadingPosts, hasMorePosts]);

  const handleFollow = async () => {
    // Implement follow functionality here
  };

  if (loadingUser) {
    return (
      <div id="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading user data...</p>
      </div>
    );
  }

  if (!user) {
    return <p>No user data available</p>;
  }

  return (
    <div>
      <Account
        user={user}
        username={username}
        handleFollow={handleFollow}
      />
      <div id="post-container">
        {posts.length > 0 ? (
          posts.map(post => (
            post ? <PostComponent key={post.id} post={post} /> : null
          ))
        ) : (
          <p>No posts available</p>
        )}
        {loadingPosts && (
          <Loading />
        )}
      </div>
    </div>
  );
};

export default UserProfile;
