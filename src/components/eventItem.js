import React from "react";
import { Link } from "gatsby";
import { buildEventUrl } from "../utils.js";
import "../css/game.css";

const EventItem = ({ name, start, end, rounds }) => (
    <div className="game-item event-item">
        <Link to={buildEventUrl(name)}>
            <p className="game-header">
                <strong>{name}</strong>
            </p>
            {start === end ?
                <p>
                    <strong>Date: </strong>{start}
                </p>
                :
                <div>
                    <p>
                        <strong>Start: </strong>{start}
                    </p>
                    <p>
                        <strong>End: </strong>{end}
                    </p>
                </div>
            }
            <p>
                <strong>Rounds: </strong>{rounds}
            </p>
        </Link>
    </div>
);

export default EventItem;
