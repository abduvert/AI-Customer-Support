'use client';
import React from 'react';
import Landing from './Landing/page';
import SignIn from './sign-in/page';
import Chatbot from './Chatbot/page';
import SignUp from './sign-up/page';
import { usePathname } from 'next/navigation';

const Page = () => {
  const pathname = usePathname();

  if (pathname === '/sign-in') {
    return <SignIn />;
  }

  if (pathname === '/sign-up') {
    return <SignUp />;
  }

  if (pathname === '/Chatbot') {
    return <Chatbot />;
  }

  return <Landing />;
};

export default Page;