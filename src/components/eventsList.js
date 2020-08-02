import React from "react";
import { minDate, maxDate, compareDates } from "../utils/utils";
import games from "../../games.json";
import EventItem from "./eventItem.js";

const buildEvents = () => {
    const events = {};

    games.forEach((game) => {
        if (!events[game.event]) {
            events[game.event] = {
                name: game.event,
                start: game.date,
                end: game.date,
                rounds: 1,
                in_progress: game.in_progress,
            };
        } else {
            events[game.event].rounds++;
            events[game.event].start = minDate(game.date, events[game.event].start);
            events[game.event].end = maxDate(game.date, events[game.event].end);
        }
    });

    return Object.values(events)
        .sort((ev1, ev2) => compareDates(ev2.start, ev1.start));
};

const EventsList = () => (
    <section>
        <h2>Tournaments</h2>
        <div className="grid-list">
            {buildEvents().map((event) =>
                <EventItem key={event.name} {...event} />,
            )}
        </div>
    </section>
);

export default EventsList;
