import React from "react";
import Image from "next/image";
import { TEAMS } from "./teams";

function DisplayTeam(props: {
  url: string;
  altText: string;
}) {
  return (
    <div className="flex justify-center items-center">
      <Image
        src={`/teams/${props.url}`}
        alt={props.altText}
        width={150}
        height={150}
        className="rounded-full"
      />
    </div>
  )
}

function CurrentGames() {
  return (
    <div className="p-8 flex flex-col items-center h-full ">
      <h1 className="text-3xl font-bold mb-8 underline">Current Games</h1>
      <div className="border-2 border-gray-300 rounded-lg p-6 w-full max-w-2xl bg-[#e0e1dd]">
        <div className="grid grid-cols-2 gap-10">
          {TEAMS.map((team) => (
            <DisplayTeam key={team.id} url={team.url} altText={team.alt} />
          )
          )}
        </div>
      </div>
    </div>
  )
}

export default CurrentGames;