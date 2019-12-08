import React from "react";
import { Link } from "gatsby";
import { buildGameUrl, prettifyPlayerData } from "../utils/utils";
import "../css/game.css";
import Watermark from "../css/images/watermark.jpg";

const GameItem = (game) => (
    <div className="game-item">
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

            {game.result && game.view &&
                <p>
                    <strong>
                        {game.result === "draw" &&
                            <span className="game-draw">
                                Draw
                            </span>
                        }
                        {game.result !== "draw" && game.result === game.view &&
                            <span className="game-victory">
                                Victory
                            </span>
                        }
                        {game.result !== "draw" && game.result !== game.view &&
                            <span className="game-defeat">
                                Defeat
                            </span>}
                    </strong>
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
        <Link to={buildGameUrl(game)}>
            <img src={Watermark} alt="" />
        </Link>
    </div>
);

export default GameItem;
