import { FiHome, FiSettings } from "react-icons/fi";
import { MdExplore } from "react-icons/md";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react"; // Import signOut for logout functionality
import { useSession } from "next-auth/react";

export default function Sidebar() {
  const router = useRouter();
  const { data: session } = useSession();

  const isActive = (path: string) => router.pathname === path;

  return (
    <aside className="bg-gradient-to-r from-pink-100 to-pink-100 p-6 shadow-md flex flex-col h-screen w-64 overflow-y-auto">
      {/* Logo */}
      <div className="mb-6">
        <a href="/" className="-m-2 p-2">
          <span className="sr-only">CK'S Personal Journal</span>
          <img
            className="h-15 w-auto"
            src="/CK.png"
            alt="CK'S Personal Journal Logo"
          />
        </a>
      </div>

      {/* Navigation */}
      <nav className="space-y-4">
        <a
          href="/journal"
          className={`flex items-center space-x-2 font-medium ${
            isActive("/journal")
              ? "text-pink-700"
              : "text-gray-600 hover:text-pink-700"
          }`}
        >
          <FiHome /> <span>Create Journal</span>
        </a>
        <a
          href="/summary"
          className={`flex items-center space-x-2 ${
            isActive("/summary")
              ? "text-pink-700"
              : "text-gray-600 hover:text-pink-700"
          }`}
        >
          <MdExplore /> <span>Summary</span>
        </a>
        <a
          href="/settings"
          className={`flex items-center space-x-2 font-bold ${
            isActive("/settings")
              ? "text-pink-700"
              : "text-gray-600 hover:text-pink-700"
          }`}
        >
          <FiSettings /> <span>Settings</span>
        </a>
      </nav>


      {/* Logout Button */}
      <div className="mt-auto">
      <button
        onClick={() => router.push("/settings")}
        className="flex items-center space-x-2 text-gray-700 hover:text-gray-900 transition"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M5.121 17.804A4 4 0 017 16h10a4 4 0 011.879.804M15 11a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
        {session?.user?.email}
      </button>
        <button
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white font-semibold rounded-lg shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}