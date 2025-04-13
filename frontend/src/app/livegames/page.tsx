'use client';
// import React, { useEffect } from "react";
// import { useRouter } from "next/navigation";
import LiveGames from "./components/CurrentGames/CurrentGames";
import BackButton from "../shared/ui/BackButton";

function Chatrooms() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-blue-900 via-white to-red-600 flex flex-col items-center px-4 py-12">
      <header className="relative w-full max-w-5xl mb-10">
        <div className="absolute left-0 top-1">
          <BackButton />
        </div>
        <h1 className="text-5xl font-extrabold text-black drop-shadow-lg text-center">
          NBAChat
        </h1>
      </header>

      <section className="w-full max-w-5xl">
        <LiveGames />
      </section>
    </div>
  );
}

export default Chatrooms;
