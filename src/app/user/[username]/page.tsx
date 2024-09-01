"use client";

import AccountComponent from '@/components/Account';
import { useParams } from 'next/navigation';

export default function Account() {
  const {username} = useParams();
  return (
    <>
      <AccountComponent username={username as string} />
    </>
  );
}
