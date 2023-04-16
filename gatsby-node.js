const path = require("path")
const events = require("./data/events.json")
const utils = require("./src/utils/utils")

exports.createPages = ({ actions }) => {
  const { createPage } = actions

  const event_template = path.resolve("./src/templates/event.js")

  const eventsMap = {}
  events.forEach(event => {
    eventsMap[event.name] = event
  })

  Object.values(eventsMap).forEach(event => {
    createPage({
      path: utils.buildEventUrl(event.name),
      component: event_template,
      context: event,
    })
  })
}
