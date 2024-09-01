type AccountComponentProps = {
    username: string;
  };
export default function AccountComponent({ username }: AccountComponentProps) {
    return (
      <>
        <h1>Hello {username}</h1>
      </>
    );
  }
  