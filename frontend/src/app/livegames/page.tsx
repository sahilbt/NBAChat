import React from "react";
import CurrentGames from "./components/CurrentGames/CurrentGames";
import LiveChat from "./components/LiveChat/LiveChat";

function Chatrooms() {
  return (
    <div>
      <div className="flex items-center justify-center pt-8">
        <h1 className="text-5xl font-bold">NBAChat</h1>
      </div>
      <div className="flex h-[70vh] gap-[5%] mt-[8vh] mx-auto justify-center items-center">
        <CurrentGames />
        {/* <LiveChat /> */}
      </div>
    </div>
  );
}

export default Chatrooms;