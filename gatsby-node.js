const path = require("path");
const games = require("./data/games.json");
const tournaments = require("./data/tournaments.json");
const utils = require("./src/utils/utils");

exports.createPages = ({ actions }) => {
    const { createPage } = actions;

    const game_template = path.resolve("./src/templates/game.js");
    const event_template = path.resolve("./src/templates/event.js");

    const tournamentsMap = {};
    tournaments.forEach((tournament) => {
        tournamentsMap[tournament.name] = tournament;
    });

    games.forEach((game) => {
        if (!tournamentsMap[game.event].games) {
            tournamentsMap[game.event].games = [];
        }
        tournamentsMap[game.event].games.push(game);

        createPage({
            path: utils.buildGameUrl(game),
            component: game_template,
            context: game,
        });
    });

    Object.values(tournamentsMap).forEach((tournament) => {
        createPage({
            path: utils.buildEventUrl(tournament.name),
            component: event_template,
            context: {
                event: tournament.name,
                games: tournament.games,
            },
        });
    });
};
