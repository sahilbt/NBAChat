'use client'
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import CurrentGames from "./components/CurrentGames/CurrentGames";
function Chatrooms() {

  // disconnect client from socket when they leave chat room
  const router = useRouter()
  useEffect(() => {
    router.refresh()
  },[])
  
  return (
    <div>
      <div className="flex items-center justify-center pt-8">
        <h1 className="text-5xl font-bold">NBAChat</h1>
      </div>
      <div className="flex h-[70vh] gap-[5%] mt-[8vh] mx-auto justify-center items-center">
        <CurrentGames />
      </div>
    </div>
  );
}

export default Chatrooms;