import React from "react";
import games from "../../games.json";
import GameItem from "./gameItem.js";

const GamesList = () => (
        <>
            <h2>Games List</h2>
            {games.map((game, i) => (
                <GameItem key={i} {...game} />
            ))}
        </>
);

export default GamesList;
