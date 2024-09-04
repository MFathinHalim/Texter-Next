"use client";
import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Account from '@/components/Account';
import PostComponent from '@/components/Post';

const fetchUserData = async (username: string) => {
  const res = await fetch(`/api/${username}`);
  if (!res.ok) throw new Error('Failed to fetch user data');
  return res.json();
};

const fetchPosts = async (username: string, page: number, search: string) => {
  const res = await fetch(`/api/post/user/${username}?page=${page}&limit=10${search ? `&search=${search}` : ''}`);
  if (!res.ok) throw new Error('Failed to fetch posts');
  return res.json();
};

const UserProfile = () => {
  const [user, setUser] = useState<userType | null>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [search, setSearch] = useState<string>('');
  const [page, setPage] = useState(1);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  const params = useParams();
  const router = useRouter();
  const username = params.username as string;

  useEffect(() => {
    if (!username) return;

    const loadData = async () => {
      try {
        setLoading(true);

        const userData = await fetchUserData(username);
        setUser(userData.user.user);

        const postsData = await fetchPosts(username, page, search);
        setPosts(postsData.posts.posts);
        setHasMorePosts(postsData.posts.posts.length > 0);
      } catch (error) {
        console.error('Error loading data:', error);
        router.push('/');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [username, search, page]);

  const loadMorePosts = useCallback(async () => {
    if (!hasMorePosts || loadingMore) return;

    setLoadingMore(true);
    try {
      const postsData = await fetchPosts(username, page + 1, search);
      setPosts(prevPosts => [...prevPosts, ...postsData.posts.posts]);
      setPage(prevPage => prevPage + 1);
      setHasMorePosts(postsData.posts.posts.length > 0);
    } catch (error) {
      console.error('Error loading more posts:', error);
    } finally {
      setLoadingMore(false);
    }
  }, [username, page, search, hasMorePosts, loadingMore]);

  useEffect(() => {
    const handleScroll = () => {
      if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loadingMore) return;
      loadMorePosts();
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loadMorePosts, loadingMore]);

  const handleFollow = async () => {
    // Implement follow functionality here
  };

  if (loading) {
    return (
      <div id="loading-screen">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p>Loading...</p>
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
        {loadingMore && (
          <div id="loading-more">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading more...</span>
            </div>
          </div>
        )}
      </div>

      <footer> {/* Implement footer here */} </footer>
    </div>
  );
};

export default UserProfile;
