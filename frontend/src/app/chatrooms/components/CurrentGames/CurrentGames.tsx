import React from "react";
import Image from "next/image";
import Link from "next/link";
import { GAMES } from "./games"; // Import the GAMES data

function CurrentGames() {
  return (
    <div className="flex flex-col items-center h-full w-[30%]">
      <h1 className="text-3xl font-bold mb-8 underline">Current Games</h1>
      <div className="border-2 border-gray-300 rounded-lg p-6 w-full max-w-2xl bg-[#e0e1dd]">
        <div className="flex flex-col gap-5">
          {GAMES.map((game) => (
            <Link
              key={game.id}
              href={`/game/${game.id}`} // Route to a specific game page
              className="flex justify-between items-center p-4 border-2 border-gray-300 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer"
            >
              {/* Away Team */}
              <div className="flex flex-col items-center">
                <Image
                  src={`/teams/${game.awayTeamImg}`}
                  alt={game.awayTeam}
                  width={0}
                  height={0}
                  style={{ width: '75%', height: 'auto' }}
                />
                <p className="mt-2 text-sm text-center">{game.awayTeam}</p>
              </div>


              <div className="text-xl font-bold">@</div>

              {/* Home Team */}
              <div className="flex flex-col items-center">
                <Image
                  src={`/teams/${game.homeTeamImg}`}
                  alt={game.homeTeam}
                  width={0}
                  height={0}
                  style={{ width: '75%', height: 'auto' }}
                />
                <p className="mt-2 text-sm text-center">{game.homeTeam}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default CurrentGames;