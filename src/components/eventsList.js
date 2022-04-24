import React from "react";
import { minDate, maxDate, compareDates } from "../utils/utils";
import events from "../../data/events.json";
import games from "../../data/games.json";
import EventItem from "./eventItem.js";

const buildEvents = () => {
    const eventsMap = {};

    events.forEach((event) => {
        console.log(event);
        eventsMap[event.name] = {
            name: event.name,
            rounds: 0,
            start: event.date,
            end: event.finishDate,
            in_progress: event.finishDate && event.finishDate.startsWith("In progress"),
        };
    })

    games.forEach((game) => {
        ++eventsMap[game.event].rounds;
    });

    return Object.values(eventsMap)
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
