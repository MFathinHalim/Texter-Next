type PostComponentProps = {
    postId: string;
    username: string;
  };
export default function PostComponent({ postId, username }: PostComponentProps) {
    return (
      <>
        <h1>Post {postId} by {username}</h1>
      </>
    );
  }
  