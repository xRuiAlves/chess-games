const path = require("path");
const games = require("./data/games.json");
const events = require("./data/events.json");
const utils = require("./src/utils/utils");

exports.createPages = ({ actions }) => {
    const { createPage } = actions;

    const game_template = path.resolve("./src/templates/game.js");
    const event_template = path.resolve("./src/templates/event.js");

    const eventsMap = {};
    events.forEach((event) => {
        eventsMap[event.name] = event;
    });

    games.forEach((game) => {
        if (!eventsMap[game.event].games) {
            eventsMap[game.event].games = [];
        }
        eventsMap[game.event].games.push(game);

        createPage({
            path: utils.buildGameUrl(game),
            component: game_template,
            context: game,
        });
    });

    Object.values(eventsMap).forEach((event) => {
        createPage({
            path: utils.buildEventUrl(event.name),
            component: event_template,
            context: {
                event: event.name,
                games: event.games,
            },
        });
    });
};
