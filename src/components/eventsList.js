import React from "react";
import { minDate, maxDate, compareDates } from "../utils/utils";
import events from "../../data/events.json";
import EventItem from "./eventItem.js";

const EventsList = () => (
    <section>
        <h2>Tournaments</h2>
        <div className="grid-list">
            {events.sort((e1, e2) => compareDates(e2.date, e1.date)).map((event) =>
                <EventItem key={event.name} {...event} />,
            )}
        </div>
    </section>
);

export default EventsList;
