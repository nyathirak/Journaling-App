import { FiBookmark, FiHome, FiPenTool, FiSettings } from "react-icons/fi";
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
          <FiPenTool/> <span>Create Journal</span>
        </a>
        <a
          href="/summary"
          className={`flex items-center space-x-2 ${
            isActive("/summary")
              ? "text-pink-700"
              : "text-gray-600 hover:text-pink-700"
          }`}
        >
          <FiBookmark/> <span>Summary</span>
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
          onClick={() => signOut({ callbackUrl: "/" })}
          className="px-4 py-2 bg-red-500 hover:bg-red-600 transition text-white font-semibold rounded-lg shadow-lg"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}