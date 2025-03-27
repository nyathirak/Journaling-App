import { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { useSession } from "next-auth/react";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    // Fetch user data if session is available
    if (session?.user?.email) {
      setEmail(session.user.email);
      fetchUserData(session.user.email);
    }
  }, [session]);

  const fetchUserData = async (email: string) => {
    try {
      const response = await fetch(`/api/auth/settings?email=${email}`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        setName(data.user.name);
      } else {
        console.error("Failed to fetch user data.");
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const updateName = async () => {
    if (!email) return;

    try {
      const response = await fetch("/api/auth/settings", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          name,
        }),
      });

      if (response.ok) {
        alert("Name updated successfully!");
      } else {
        alert("Failed to update name.");
      }
    } catch (error) {
      console.error("Error updating name:", error);
      alert("An error occurred while updating your name.");
    }
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 p-10">
        <h2 className="text-3xl text-black font-semibold">Settings</h2>
        <div className="mt-6 bg-white p-6 rounded-lg shadow">
          <p className="text-black">You are logged in as</p>
          <p className="text-pink-900 font-semibold">{email}</p>

          <div className="mt-4">
            <label className="block text-black">Name</label>
            <p className="text-black text-sm">What should we call you, {name}</p>
            <div className="mt-2 flex space-x-2">
              <input
                type="text"
                placeholder="Change your name..."
                className="border border-black text-pink-900 p-2 rounded-lg flex-1"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <button
                className="px-4 py-2 bg-pink-600 text-white rounded-lg"
                onClick={updateName}
              >
                Update Name
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}