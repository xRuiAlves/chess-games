const MONTHS = Object.freeze({
    "01": "January",
    "02": "February",
    "03": "March",
    "04": "April",
    "05": "May",
    "06": "June",
    "07": "July",
    "08": "August",
    "09": "September",
    "10": "October",
    "11": "November",
    "12": "December",
});

const normalizePlayerName = (name) => name.split(" ").join("").toLowerCase();

const normalizeEventName = (name) => name.split(" ").join("-").toLowerCase();

const buildGameUrl = (game) => {
    const white = normalizePlayerName(game.white.name);
    const black = normalizePlayerName(game.black.name);
    return `/game/${white}-vs-${black}-${game.date}`;
};

const buildEventUrl = (event_name) => `tournament/${normalizeEventName(event_name)}`;

const prettifyPlayerName = (name) => {
    let comma_index = name.indexOf(",");

    if (comma_index === -1) {
        const name_parts = name.split(" ");

        if (name_parts.length === 1) {
            return name;
        }

        name = `${name_parts[name_parts.length - 1]}, ${name_parts[0]}`;
        comma_index = name.indexOf(",");
    }

    if (name.length > 20) {
        return `${name.substr(0, comma_index + 3)}..`;
    } else {
        return name;
    }
};

const prettifyPlayerData = (player) => {
    const name = prettifyPlayerName(player.name);

    if (player.elo === 0) {
        player.elo = "no elo";
    }

    return player.elo ? `${name} (${player.elo})` : name;
};

const parseDate = (date) => parseInt(`${date.substr(6, 4)}${date.substr(3, 2)}${date.substr(0, 2)}`, 10);

const compareDates = (date1, date2) => parseDate(date1) - parseDate(date2);

const minDate = (date1, date2) => compareDates(date1, date2) < 0 ? date1 : date2;

const maxDate = (date1, date2) => compareDates(date1, date2) < 0 ? date2 : date1;

const parseShortDate = (date) => `${MONTHS[date.substr(4)]} ${date.substr(0, 4)}`;

module.exports = {
    buildGameUrl,
    prettifyPlayerData,
    parseShortDate,
    buildEventUrl,
    compareDates,
    minDate,
    maxDate,
};
