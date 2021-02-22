const formatPgnDate = (date) => {
    const day = date.substr(0, 2);
    const month = date.substr(3, 2);
    const year = date.substr(6, 4);
    return `${year}.${month}.${day}`;
};

const resultToNumericResult = (result) => {
    if (result === "white") {
        return "1-0";
    } else if (result === "black") {
        return "0-1";
    } else if (result === "draw") {
        return "1/2-1/2";
    } else {
        return "*";
    }
};

export const buildPGNString = ({ pgn, white, black, date, event, round, table, result }) => {
    const pgn_tags = {
        "Event": event,
        "Date": formatPgnDate(date),
        "UTCDate": formatPgnDate(date),
        "White": white.name,
        "WhiteElO": white.elo,
        "WhiteTitle": white.title ? white.title : undefined,
        "Black": black.name,
        "BlackElo": black.elo,
        "BlackTitle": black.title ? black.title : undefined,
        "Result": resultToNumericResult(result),
        "Variant": "Standard",
        "Round": round,
        "Board": table,
    };

    const pgn_arr = Object.entries(pgn_tags)
        .filter(([_k, v]) => !!v)
        .map(([k, v]) => `[${k} "${v}"]`);
    pgn_arr.push("");
    pgn_arr.push(pgn);
    return pgn_arr.join("\n");
};
