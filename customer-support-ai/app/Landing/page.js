import Link from 'next/link';
import NavBar from '../Components/NavBar';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-cyan-600 font-mono">
      <NavBar />
      {/* Main Content */}
      <div className="flex-grow flex flex-col items-center justify-center pt-16 px-4 lg:px-6 xl:px-8">
        <h1 className="text-4xl text-white mb-4 md:text-5xl lg:text-6xl xl:text-7xl text-center">
          Welcome to UniBuddy!
        </h1>
        <p className="text-white mb-8 text-center mx-4 md:mx-6 lg:mx-8 xl:mx-10">
          Feeling tangled up in university life? Dive into our page and let our super-smart AI chatbot unravel the answers for you! Your go-to guide for all things university is just a click away!
        </p>
        <Link href="/Chatbot">
          <button className="p-3 bg-white text-cyan-600 rounded-md shadow-md hover:bg-gray-100 transition-colors duration-300">
            Start Chat
          </button>
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-cyan-600 text-center py-4">
        <p className="text-white text-sm">
          &copy; {new Date().getFullYear()} University Support. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
