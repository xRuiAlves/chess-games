import React from "react";
import { compareDates } from "../utils/utils";
import GameItem from "./gameItem.js";

const GamesList = ({ header, games }) => (
        <>
            <h2 style={{ marginBottom: "1.5em" }}>{header}</h2>
            <div className="grid-list">
                {games
                    .sort((game1, game2) => {
                        const comparison = compareDates(game1.date, game2.date);
                        if (game1.round && game2.round && comparison === 0) {
                            return parseInt(game1.round, 0) - parseInt(game2.round, 0);
                        }
                        return comparison;
                    })
                    .map((game, i) => (
                        <GameItem key={i} {...game} />
                    ))
                }
            </div>
        </>
);

export default GamesList;
