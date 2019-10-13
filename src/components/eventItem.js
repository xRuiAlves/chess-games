import React from "react";
import { Link } from "gatsby";
import { buildEventUrl } from "../utils/utils";
import "../css/game.css";
import Watermark from "../css/images/watermark.jpg";

const EventItem = ({ name, start, end, rounds }) => (
    <div className="game-item event-item">
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
        <Link to={buildEventUrl(name)}>
            <img src={Watermark} alt="" />
        </Link>
    </div>
);

export default EventItem;
