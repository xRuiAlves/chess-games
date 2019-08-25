import React from "react";
import { Link } from "gatsby";
import { buildGameUrl, prettifyPlayerData } from "../utils.js";
import "../css/game.css";

const GameItem = (game) => (
    <div className="game-item">
        <Link to={buildGameUrl(game)}>
            <p className="game-header">
                <span className="game-players">
                    <strong>{game.white.title && `${game.white.title} `}{prettifyPlayerData(game.white)}</strong>
                &nbsp;vs&nbsp;
                    <strong>{game.black.title && `${game.black.title} `}{prettifyPlayerData(game.black)}</strong>
                </span>
                <span className="game-date">
                    {game.date}
                </span>
            </p>
            <p>
                <strong>{game.event}</strong>
                {game.round && <span>,&nbsp;&nbsp;Round <strong>{game.round}</strong></span>}
            </p>
            {game.table && game.white.club && game.black.club &&
        <p>
            <strong>{game.white.club}</strong>
            <span> vs </span>
            <strong>{game.black.club}</strong>
            <span>,&nbsp;&nbsp;Table <strong>{game.table}</strong></span>
        </p>
            }
        </Link>
    </div>
);

export default GameItem;
