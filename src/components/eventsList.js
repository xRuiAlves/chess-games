import React, { useState } from "react";
import { compareDates, capitalizeFirstLetter } from "../utils/utils";
import events from "../../data/events.json";
import EventItem from "./eventItem.js";
import Select from "react-dropdown-select";
import "../css/event.css";

const SEARCH_PARAMS = Object.freeze({
    CATEGORY: "category",
    YEAR: "year"
});
const GAME_CATEGORIES_OPTIONS = Object.freeze([
    { value: "All Categories", label: "All Categories" },
    { value: "Classic", label: "Classic" },
    { value: "Rapid", label: "Rapid" },
    { value: "Blitz", label: "Blitz" },
]);
const DEFAULT_CATEGORY_OPTION = GAME_CATEGORIES_OPTIONS[0];
const DEFAULT_YEAR_OPTION = { value: "All Years", label: "All Years" };


const EventsList = () => {
    const years = new Set();
    events.forEach((event) => {
        years.add(event.date.substr(6, 4));
        if (event.finishDate && !event.finishDate.startsWith("In progress")) {
            years.add(event.finishDate.substr(6, 4));
        }
    });
    const yearsOptions = [...years].sort((y1, y2) => y2 - y1).map((year) => ({ value: year, label: year }));
    yearsOptions.splice(0, 0, { value: "All Years", label: "All Years" });

    const searchParams = new URLSearchParams(window.location.search);
    const categorySearchParam = (searchParams.get(SEARCH_PARAMS.CATEGORY) || "").toLowerCase();
    const yearSeachParam = searchParams.get(SEARCH_PARAMS.YEAR);

    const initialCategory = GAME_CATEGORIES_OPTIONS.map(opt => opt.value.toLowerCase()).includes(categorySearchParam)
        ? { value: capitalizeFirstLetter(categorySearchParam), label: capitalizeFirstLetter(categorySearchParam) }
        : DEFAULT_CATEGORY_OPTION;
    const initialYear = years.has(yearSeachParam) 
        ? { value: yearSeachParam, label: yearSeachParam }
        : DEFAULT_YEAR_OPTION;

    const [category, setCategory] = useState(initialCategory);
    const [year, setYear] = useState(initialYear);
    
    const resetFilters = () => {
        setCategory(DEFAULT_CATEGORY_OPTION);
        setYear(DEFAULT_YEAR_OPTION);
    }

    const filteredEvents = events
        .filter((event) => filterEventYear(event, year.value))
        .filter((event) => filterEventCategory(event, category.value))
        .sort((e1, e2) => compareDates(e2.date, e1.date));
    
    return (
        <section className="event-list">
            <header>
                <h2>Tournaments</h2>
                <div className="event-filters">
                    <div className="event-filter">
                        <Select 
                            values={[category]} 
                            options={GAME_CATEGORIES_OPTIONS}
                            onChange={([newCategory]) => setCategory(newCategory)} 
                            searchable={false}
                        />
                    </div>
                    <div className="event-filter">
                        <Select 
                            values={[year]} 
                            options={yearsOptions} 
                            onChange={([newYear]) => setYear(newYear)} 
                            searchable={false}
                        />
                    </div>
                </div>
            </header>
            
            {filteredEvents.length > 0 
                ? <div className="grid-list">
                    {filteredEvents.map((event) => 
                        <EventItem key={event.name} {...event} />
                    )}
                </div>
                : <div>
                    {missingMessage(category.value, year.value)}{" "}
                    Click{" "}
                    <span 
                        className="emphasized-anchor clickable"
                        onClick={resetFilters}
                    >
                        here
                    </span> to clear the search filters.
                </div>
            }
        </section>
    );
}

const dateToYear = (date) => date.substr(6, 4);

const filterEventYear = (event, year) => {
    if (year === DEFAULT_YEAR_OPTION.value) {
        return true;
    }

    const startYear = dateToYear(event.date);
    const finishYear = event.finishDate && dateToYear(event.finishDate);

    return startYear == year 
        || finishYear == year;
}

const filterEventCategory = (event, category) => {
    return category === DEFAULT_CATEGORY_OPTION.value
        || category === event.category;
}

const missingMessage = (category, year) => {
    if (category === DEFAULT_CATEGORY_OPTION.value
        && year === DEFAULT_YEAR_OPTION.value) {
        return "There are no tournaments."
    }
    if (category === DEFAULT_CATEGORY_OPTION.value) {
        return `There is no record of any tournaments in ${year}.`
    }
    if (year === DEFAULT_YEAR_OPTION.value) {
        return `There is no record of any ${category} tournaments.`
    }
    return `There is no record of any ${category} tournaments in ${year}.`
}



export default EventsList;
