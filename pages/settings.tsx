import { useState } from "react";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const [nickname, setNickname] = useState("");
  const { data: session } = useSession();

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl text-black font-semibold">Settings</h2>
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <p className="text-gray-600">You are logged in as</p>
          <p className="text-pink-900 font-semibold">{session?.user?.email}</p>
          
          <div className="mt-4">
            <label className="block text-gray-700">Name</label>
            <p className="text-gray-500 text-sm">What should we call you, {session?.user?.name}?</p>
            <div className="mt-2 flex space-x-2">
              <input 
                type="text" 
                placeholder="Change your name..." 
                className="border border-black text-pink-900 p-2 rounded-lg flex-1"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
              />
              <button className="px-4 py-2 bg-pink-600 text-white rounded-lg">
                Update Nickname
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
