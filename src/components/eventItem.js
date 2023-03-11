import React from "react"
import { Link } from "gatsby"
import { buildEventUrl } from "../utils/utils"
import { multiDayEventDate } from "../utils/utils"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faHashtag,
  faPerson,
  faPeopleGroup,
} from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import "../css/game.css"
import BlitzLogo from "../images/blitz3.png"
import RapidLogo from "../images/rapid3.png"
import ClassicLogo from "../images/classic3.png"

const EventItem = ({
  name,
  date,
  finishDate,
  category,
  timeControl,
  score,
  team,
}) => {
  const numRounds = score && score.substring(score.lastIndexOf(" ") + 1)

  return (
    <Link to={buildEventUrl(name)} className="game-item event-item">
      <div className="game-header">
        <strong>{name}</strong>
      </div>
      <div className="data-fields">
        <div className="event-data-item">
          <div>
            <FontAwesomeIcon
              icon={faCalendar}
              className="event-data-item-logo"
            />
            <span className="event-data-item-field">
              {multiDayEventDate(date, finishDate)}
            </span>
          </div>
        </div>
        <div className="event-data-item">
          <img
            className="event-category-icon event-data-item-logo"
            src={categoryItem(category)}
          />
          <span className="event-data-item-field">{category}</span>
          {timeControl && <span>&nbsp;{`(${timeControl})`}</span>}
        </div>
        <div className="event-data-item">
          <FontAwesomeIcon
            icon={eventSoloOrTeamItem(team)}
            className="event-data-item-logo"
          />
          <span className="event-data-item-field">
            {team ? "Team" : "Individual"} event
          </span>
        </div>
        {numRounds && (
          <div className="event-data-item">
            <FontAwesomeIcon
              icon={faHashtag}
              className="event-data-item-logo"
            />
            <span className="event-data-item-field">
              {numRounds} round{numRounds > 1 ? "s" : ""}
            </span>
          </div>
        )}
      </div>
    </Link>
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

export default EventItem
