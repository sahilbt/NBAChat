"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import BackButton from "@/app/shared/ui/BackButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

function LiveGames() {
  const [todaysGames, setTodaysGames] = useState([]);
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || ""; // Extract username from query params

  // fetch games for today
  useEffect(() => {
    const ports = [8000, 8001, 8002, 8003, 8004];

    const fetchFromServers = async () => {
      for (let i = 0; i < ports.length; i++) {
        try {
          const response = await fetch(`http://127.0.0.1:${ports[i]}/get/todays_games`);
          if (response.ok) {
            const data = await response.json();
            setTodaysGames(data.message);
            return; // Exit on first successful fetch
          }
        } catch (error) {
          console.warn(`Server on port ${ports[i]} failed. Trying next...`);
        }
      }

      console.error("All servers failed to respond.");
    };

    fetchFromServers();
  }, []);

  return (
    <div>
      <div className="min-h-screen w-full bg-gradient-to-r from-blue-900 via-white to-red-600 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
        <div className="w-full max-w-4xl text-center mb-12">
          {/* <BackButton /> */}
          <h2 className="text-4xl font-extrabold text-black mb-4">Welcome, {username}</h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 border-b-4 border-red-600 inline-block pb-2">
            Current Games
          </h3>
        </div>
        <div className="w-full max-w-4xl bg-white border-4 border-blue-500 rounded-2xl shadow-xl p-6">
          <div className="flex flex-col gap-5 max-h-[60vh] overflow-y-auto pr-2">
            {todaysGames.map((game) => (
              <Link
                key={game.id}
                href={`/game/${game.id}?username=${encodeURIComponent(username)}`}
                className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-xl bg-gray-100 hover:bg-red-500 hover:text-white transition-colors cursor-pointer shadow-md"
              >
                {/* Away Team */}
                <div className="flex flex-col items-center">
                  <Image
                    src={`/teams/${game.awayTeamImg}`}
                    alt={game.awayTeam}
                    width={75}
                    height={75}
                    className="rounded-lg"
                  />
                  <p className="mt-2 text-sm text-center font-semibold">{game.awayTeam}</p>
                </div>

                <div className="text-2xl font-bold">@</div>

                {/* Home Team */}
                <div className="flex flex-col items-center">
                  <Image
                    src={`/teams/${game.homeTeamImg}`}
                    alt={game.homeTeam}
                    width={75}
                    height={75}
                    className="rounded-lg"
                  />
                  <p className="mt-2 text-sm text-center font-semibold">{game.homeTeam}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div >
    </div>
  );
}

export default LiveGames;
