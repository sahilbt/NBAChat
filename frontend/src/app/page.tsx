'use client';
import React, { useState } from "react";
import Link from "next/link";

export default function Home() {
  const [username, setUsername] = useState("");
  return (
    <>
      <head>
        <title>NBAChat</title>
      </head>
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <h1 className="text-2xl font-bold mb-4">Welcome to the NBAChat</h1>
          <p className="text-gray-600 mb-6">Please enter your username to proceed:</p>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Link href={`/chatrooms?username=${encodeURIComponent(username)}`}>
            <button
              disabled={!username}
              className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Go to Chatrooms
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
