import React from "react";
import { Link } from "gatsby";
import { dateToLongFormat, buildGameUrl, prettifyPlayerData, ordinalNumber } from "../utils/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag, faChessBoard } from "@fortawesome/free-solid-svg-icons";
import { faCalendar } from "@fortawesome/free-regular-svg-icons";
import "../css/game.css";

const GameItem = (game) => (
    <Link to={buildGameUrl(game)} className="game-item">
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

        <div className="event-data-item">
            <div>
                <FontAwesomeIcon icon={faCalendar} className="event-data-item-logo"/>
                <span className="event-data-item-field">{dateToLongFormat(game.date)}</span>
            </div>
        </div>

        <div className="event-data-item">
            <FontAwesomeIcon icon={faHashtag} className="event-data-item-logo"/>
            <span className="event-data-item-field">Round {game.round}</span>
        </div>

        {game.table && 
            <div className="event-data-item">
                <FontAwesomeIcon icon={faChessBoard} className="event-data-item-logo"/>
                <span className="event-data-item-field">{ordinalNumber(game.table)} board</span>
            </div>
        }
    </Link>
);

export default GameItem;
