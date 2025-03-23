'use client';
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import CurrentGames from "./components/CurrentGames/CurrentGames";

function Chatrooms() {
  // Refresh router when component mounts
  const router = useRouter();
  useEffect(() => {
    router.refresh();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-900 via-white to-red-600 flex flex-col items-center pt-8">
      <h1 className="text-5xl font-extrabold text-blue-900 border-b-4 border-red-600 pb-2">NBAChat</h1>
      <div className="flex h-[70vh] gap-5 mt-12 mx-auto justify-center items-center w-full">
        <CurrentGames />
      </div>
    </div>
  );
}

export default Chatrooms;
