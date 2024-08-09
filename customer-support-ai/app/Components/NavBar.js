// components/NavBar.js
"use client";
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../firebase'; // Adjust path as necessary
import { useRouter } from 'next/navigation'; // Import useRouter for navigation

export default function NavBar() {
  const [user, setUser] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const router = useRouter(); // Initialize the router

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setMessage(`Welcome! You have been signed in.`);
      } else {
        setMessage('You are logged off. Sign in to continue.');
      }
      setOpenSnackbar(true);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setMessage('You are logged off. Sign in to continue.');
      setOpenSnackbar(true);
      router.push('/Landing'); // Redirect to the landing page
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <div className="w-full fixed top-0 bg-white z-10 flex flex-col md:flex-row md:justify-between items-center p-4 shadow-md">
      <div className="flex justify-between w-full md:w-auto">
        <h1 className="text-4xl text-left">🎓 UniBuddy</h1>
        <button
          className="md:hidden text-cyan-600 hover:text-cyan-800"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          ☰
        </button>
      </div>

      <div className={`md:flex md:space-x-4 ${isMenuOpen ? 'block' : 'hidden'}`}>
        <div className="space-y-2 md:space-y-0 md:flex md:space-x-4">
          {!user ? (
            <>
              <Link href="/sign-in" className="block text-cyan-600 hover:text-cyan-800 text-center py-2 px-4">
                Sign In
              </Link>
              <Link href="/sign-up" className="block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700">
                Sign Up
              </Link>
            </>
          ) : (
            <button
              className="block bg-cyan-600 text-white px-4 py-2 rounded hover:bg-cyan-700"
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          )}
        </div>
      </div>

      {/* Snackbar component with smaller width and a cross icon */}
      {openSnackbar && (
        <div className="fixed bottom-4 right-4 p-4 bg-gray-800 text-white rounded flex items-center space-x-2">
          <span>{message}</span>
          <button className="text-xl" onClick={handleCloseSnackbar}>
            &times; {/* Cross icon */}
          </button>
        </div>
      )}
    </div>
  );
}
