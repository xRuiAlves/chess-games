import React from "react";
import games from "../../games.json";
import GameItem from "./gameItem.js";

const GamesList = () => (
        <>
            <h2>Games List</h2>
            {games
                .sort((game1, game2) => {
                    const date1 = parseInt(`${game1.date.substr(6, 4)}${game1.date.substr(3, 2)}${game1.date.substr(0, 2)}`, 10);
                    const date2 = parseInt(`${game2.date.substr(6, 4)}${game2.date.substr(3, 2)}${game2.date.substr(0, 2)}`, 10);
                    if (game1.round && game2.round && date1 === date2) {
                        return parseInt(game2.round, 0) - parseInt(game1.round, 0);
                    }
                    return date2 - date1;
                })
                .map((game, i) => (
                    <GameItem key={i} {...game} />
                ))}
        </>
);

export default GamesList;
