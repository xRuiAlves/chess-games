import React from "react"
import { Link, graphql } from "gatsby"

import Layout from "../components/layout"
import "../css/game.css"
import "../css/event.css"
import { ordinalNumber, multiDayEventDate } from "../utils/utils"
import SEO from "../components/seo"
import GamesList from "../components/gamesList"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faLocationDot,
  faGlobe,
  faPerson,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import BlitzLogo from "../images/blitz2.png"
import RapidLogo from "../images/rapid2.png"
import ClassicLogo from "../images/classic2.png"

const Event = ({ data }) => {
  const event = data.allSitePage.edges[0].node.pageContext

  return (
    <Layout>
      <SEO title={event.name} />
      <header className="event-header">
        <h2>{event.name}</h2>
        {event.location && (
          <div className="event-header-item">
            <a
              target="_blank"
              rel="noopener noreferrer"
              href={event.location.gmaps}
            >
              <FontAwesomeIcon
                icon={faLocationDot}
                className="event-header-item-logo"
              />
              <span className="event-header-item-field">
                {event.location.name}
              </span>
            </a>
          </div>
        )}
        {event.date && (
          <div className="event-header-item">
            <div>
              <FontAwesomeIcon
                icon={faCalendar}
                className="event-header-item-logo"
              />
              <span className="event-header-item-field">
                {multiDayEventDate(event.date, event.finishDate)}
              </span>
            </div>
          </div>
        )}
        {event.category && (
          <div className="event-header-item">
            <img
              className="event-category-icon event-header-item-logo"
              src={categoryItem(event.category)}
            />
            <span className="event-header-item-field">{event.category}</span>
          </div>
        )}
        {event.team !== null && (
          <div className="event-header-item">
            <FontAwesomeIcon
              icon={eventSoloOrTeamItem(event.team)}
              className="event-header-item-logo"
            />
            <span className="event-header-item-field">
              {event.team ? "Team" : "Individual"} event
            </span>
          </div>
        )}
        {event.page && (
          <div className="event-header-item">
            <a target="_blank" rel="noopener noreferrer" href={event.page}>
              <FontAwesomeIcon
                icon={faGlobe}
                className="event-header-item-logo"
              />
              <span className="event-header-item-field">Online page</span>
            </a>
          </div>
        )}
      </header>
      <div className="event-extra-data">
        {event.timeControl && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">Time Control: </span>
            <span>{event.timeControl}</span>
          </div>
        )}
        {event.rated !== null && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">Rated: </span>
            <span>{event.rated ? "yes" : "no"}</span>
          </div>
        )}
        {event.ratingDiff && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">Rating diff: </span>
            <span>{event.ratingDiff}</span>
          </div>
        )}
        {event.numPlayers && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">
              Number of players:{" "}
            </span>
            <span>{event.numPlayers}</span>
          </div>
        )}
        {event.rank && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">Rank: </span>
            <span>{ordinalNumber(event.rank)}</span>
          </div>
        )}
        {event.score && (
          <div className="event-extra-data-item">
            <span className="event-extra-data-item-key">Score: </span>
            <span>{event.score}</span>
          </div>
        )}
      </div>
      {event.notes && <p className="event-description">{event.notes}</p>}
      {event.category && event.category !== "Classic" && (
        <div className="event-description">
          This is a <strong>{event.category}</strong> event and the games were
          not annotated. Thus, there is no record of this tournament's games.
          Please click{" "}
          <Link to="/" className="emphasized-anchor">
            here
          </Link>{" "}
          to browse return to the main page and browse for other events.
        </div>
      )}
      {event.games && event.games.length > 0 && (
        <GamesList games={event.games} />
      )}
    </Layout>
  )
}

const categoryItem = category => {
  if (category.startsWith("Blitz")) {
    return BlitzLogo
  }
  if (category.startsWith("Rapid")) {
    return RapidLogo
  }
  return ClassicLogo
}

const eventSoloOrTeamItem = isTeamEvent =>
  isTeamEvent ? faPeopleGroup : faPerson

export const query = graphql`
  query($path: String!) {
    allSitePage(filter: { path: { eq: $path } }) {
      edges {
        node {
          pageContext
        }
      }
    }
  }
`

export default Event
