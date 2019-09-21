import React from "react";
import { Link } from "gatsby";
import { buildGameUrl, prettifyPlayerData } from "../utils.js";
import "../css/game.css";

const GameItem = (game) => (
    <div className="game-item">
        <Link to={buildGameUrl(game)}>
            <div className="game-header">
                <p>
                    <span className="game-players">
                        <strong>{game.white.title && `${game.white.title} `}{prettifyPlayerData(game.white)}</strong>
                        {" "}vs{" "}
                        <strong>{game.black.title && `${game.black.title} `}{prettifyPlayerData(game.black)}</strong>
                    </span>
                </p>

                {game.table && game.white.club && game.black.club &&
                    <p>
                        <strong>{game.white.club}</strong>
                        <span> vs </span>
                        <strong>{game.black.club}</strong>
                    </p>
                }
            </div>

            <p>
                <strong>Date: </strong>{game.date}
            </p>

            {game.round &&
                <p>
                    <strong>Round: </strong>{game.round}
                </p>
            }

            {game.table &&
                <p>
                    <strong>Table: </strong>{game.table}
                </p>
            }
        </Link>
    </div>
);

export default GameItem;
