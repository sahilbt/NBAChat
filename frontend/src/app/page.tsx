'use client'
import LiveChat from "./components/LiveChat/LiveChat";
import CurrentGames from "./components/CurrentGames/CurrentGames";

export default function Home() {
  return (
    <>
    <head>
      <title>NBAChat</title>
    </head>
    <div>
      <div className="flex items-center justify-center pt-8">
        <h1 className="text-5xl font-bold">NBAChat</h1>
      </div>
      <div className="flex h-[70vh] gap-[5%] mt-[8vh] ml-30 mr-30">
        <CurrentGames />
        <LiveChat />
      </div>
    </div>
    </>
  );
}
