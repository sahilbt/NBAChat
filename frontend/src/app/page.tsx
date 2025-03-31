'use client';
import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function Home() {
  const [username, setUsername] = useState("");
  return (
    <>
      <head>
        <title>NBAChat</title>
        <link rel="icon" type="image/svg+xml" href="/nbachat-logo.svg" />
      </head>
      <div className="flex flex-col items-center justify-start min-h-screen bg-gradient-to-r from-blue-900 via-white to-red-600">
        <Image
          src={'nbachat-logo.svg'}
          alt={'NBA Chat Logo'}
          width={300}
          height={300}
          className="rounded-lg m-10"
        />
        <div className="bg-white p-8 m-10 rounded-2xl shadow-2xl text-center max-w-md w-full border-4 border-blue-500">
          <h1 className="text-3xl font-extrabold mb-4 text-blue-900">NBAChat</h1>
          <p className="text-gray-700 mb-6 font-medium">Enter your username to join the conversation:</p>
          <div className="mb-4">
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 text-center text-lg"
            />
          </div>
          <Link href={`/livegames?username=${encodeURIComponent(username)}`}>
            <button
              disabled={!username}
              className="w-full bg-blue-700 text-white px-4 py-2 rounded-lg text-lg font-semibold hover:bg-red-600 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              Go to Live Games
            </button>
          </Link>
        </div>
      </div>
    </>
  );
}
