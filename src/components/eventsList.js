import React, { useState } from "react"
import { compareDates, capitalizeFirstLetter, isBrowser } from "../utils/utils"
import events from "../../data/events.json"
import EventItem from "./eventItem.js"
import Select from "react-dropdown-select"
import "../css/event.css"

const SEARCH_PARAMS = Object.freeze({
  CATEGORY: "category",
  YEAR: "year",
})
const GAME_CATEGORIES_OPTIONS = Object.freeze([
  { value: "All Categories", label: "All Categories" },
  { value: "Classic", label: "Classic" },
  { value: "Rapid", label: "Rapid" },
  { value: "Blitz", label: "Blitz" },
])
const DEFAULT_CATEGORY_OPTION = GAME_CATEGORIES_OPTIONS[0]
const DEFAULT_YEAR_OPTION = { value: "All Years", label: "All Years" }

const EventsList = () => {
  const years = new Set()
  events.forEach(event => {
    years.add(event.date.substr(6, 4))
    if (event.finishDate && !event.finishDate.startsWith("In progress")) {
      years.add(event.finishDate.substr(6, 4))
    }
  })
  const yearsOptions = [...years]
    .sort((y1, y2) => y2 - y1)
    .map(year => ({ value: year, label: year }))
  yearsOptions.splice(0, 0, { value: "All Years", label: "All Years" })

  const getInitialCategoryAndYear = () => {
    if (!isBrowser()) {
      return {
        initialCategory: DEFAULT_CATEGORY_OPTION,
        initialYear: DEFAULT_YEAR_OPTION,
      }
    }
    const searchParams = new URLSearchParams(window.location.search)
    const categorySearchParam = (
      searchParams.get(SEARCH_PARAMS.CATEGORY) || ""
    ).toLowerCase()
    const yearSeachParam = searchParams.get(SEARCH_PARAMS.YEAR)

    return {
      initialCategory: GAME_CATEGORIES_OPTIONS.map(opt =>
        opt.value.toLowerCase()
      ).includes(categorySearchParam)
        ? {
            value: capitalizeFirstLetter(categorySearchParam),
            label: capitalizeFirstLetter(categorySearchParam),
          }
        : DEFAULT_CATEGORY_OPTION,
      initialYear: years.has(yearSeachParam)
        ? { value: yearSeachParam, label: yearSeachParam }
        : DEFAULT_YEAR_OPTION,
    }
  }

  const { initialCategory, initialYear } = getInitialCategoryAndYear()
  const [category, setCategory] = useState(initialCategory)
  const [year, setYear] = useState(initialYear)

  const updateSearchParams = (paramName, paramValue) => {
    console.log("here")
    const origin = window.location.origin
    const searchParams = new URLSearchParams(window.location.search)
    searchParams.set(paramName, paramValue)
    const newSearchParamsStr =
      "?" + [...searchParams.entries()].map(param => param.join("=")).join("&")
    const newUrl = origin + newSearchParamsStr

    if (history.pushState) {
      window.history.replaceState({ path: newUrl }, "", newUrl)
    }
  }

  const updateCategory = categoryOption => {
    setCategory(categoryOption)
    updateSearchParams("category", categoryOption.value)
  }

  const updateYear = yearOption => {
    setYear(yearOption)
    updateSearchParams("year", yearOption.value)
  }

  const resetFilters = () => {
    updateCategory(DEFAULT_CATEGORY_OPTION)
    updateYear(DEFAULT_YEAR_OPTION)
  }

  const filteredEvents = events
    .filter(event => filterEventYear(event, year.value))
    .filter(event => filterEventCategory(event, category.value))
    .sort((e1, e2) => compareDates(e2.date, e1.date))

  return (
    <section className="event-list">
      <header>
        <h2>Tournaments</h2>
        <div className="event-filters">
          <div className="event-filter">
            <Select
              values={[category]}
              options={GAME_CATEGORIES_OPTIONS}
              onChange={([newCategory]) => updateCategory(newCategory)}
              searchable={false}
            />
          </div>
          <div className="event-filter">
            <Select
              values={[year]}
              options={yearsOptions}
              onChange={([newYear]) => updateYear(newYear)}
              searchable={false}
            />
          </div>
        </div>
      </header>

      {filteredEvents.length > 0 ? (
        <div className="grid-list">
          {filteredEvents.map(event => (
            <EventItem key={event.name} {...event} />
          ))}
        </div>
      ) : (
        <div>
          {missingMessage(category.value, year.value)} Click{" "}
          <span className="emphasized-anchor clickable" onClick={resetFilters}>
            here
          </span>{" "}
          to clear the search filters.
        </div>
      )}
    </section>
  )
}

const dateToYear = date => date.substr(6, 4)

const filterEventYear = (event, year) => {
  if (year === DEFAULT_YEAR_OPTION.value) {
    return true
  }

  const startYear = dateToYear(event.date)
  const finishYear = event.finishDate && dateToYear(event.finishDate)

  return startYear == year || finishYear == year
}

const filterEventCategory = (event, category) => {
  return (
    category === DEFAULT_CATEGORY_OPTION.value || category === event.category
  )
}

const missingMessage = (category, year) => {
  if (
    category === DEFAULT_CATEGORY_OPTION.value &&
    year === DEFAULT_YEAR_OPTION.value
  ) {
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

export default EventsList
