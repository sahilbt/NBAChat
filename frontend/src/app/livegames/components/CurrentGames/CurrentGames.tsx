"use client";
import React from "react";
import Image from "next/image";
import BackButton from "@/app/shared/ui/BackButton";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { GAMES } from "./games"; // Import the GAMES data

function LiveGames() {
  const searchParams = useSearchParams();
  const username = searchParams.get("username") || ""; // Extract username from query params

  return (
    <div className="flex flex-col items-center bg-gradient-to-r from-blue-900 via-white to-red-600 py-10 w-full">
      <BackButton />
      <h2 className="text-4xl font-extrabold text-black-900 pb-4 mb-8">Welcome, {username}</h2>
      <h3 className="text-3xl font-extrabold text-blue-900 border-b-4 border-red-600 pb-2 mb-8">Current Games</h3>
      <div className="border-4 border-blue-500 rounded-2xl p-6 w-[90%] max-w-4xl bg-white shadow-xl">
        <div className="flex flex-col gap-5">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}?username=${encodeURIComponent(username)}`} // Preserve username
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
    </div>
  );
}

export default LiveGames;
