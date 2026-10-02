import { Chess } from "chess.js";
import { getCollection } from "astro:content";
import { slugify } from "./slug";
import { formatDate, isoDate, playerName, type Game } from "./tournaments";

export interface Ply {
    san: string;
    from: string;
    to: string;
    fen: string;
}

export interface Replay {
    startFen: string;
    plies: Ply[];
}

const RESULTS = { white: "1-0", black: "0-1", draw: "1/2-1/2" } as const;

export function tournamentId(game: Game): string {
    return slugify(game.data.event);
}

export function gameSlug(game: Game): string {
    return `round-${game.data.round}`;
}

export function gameUrl(game: Game): string {
    return `/tournament/${tournamentId(game)}/${gameSlug(game)}/`;
}

export function hasMoves(game: Game): boolean {
    return Boolean(game.data.pgn);
}

export async function getPlayableGames(): Promise<Game[]> {
    return (await getCollection("games")).filter(hasMoves);
}

export function gameTitle(game: Game): string {
    return `${playerName(game.data.white)} vs ${playerName(game.data.black)}`;
}

export function resultLabel(game: Game): string {
    return RESULTS[game.data.result];
}

// 64 characters, one per square from a8 to h1, "." for an empty square
export function boardFromFen(fen: string): string {
    return fen
        .split(" ")[0]
        .replace(/\//g, "")
        .replace(/\d/g, (n) => ".".repeat(Number(n)));
}

export function replay(game: Game): Replay {
    const chess = new Chess();
    chess.loadPgn(game.data.pgn!);
    const moves = chess.history({ verbose: true });
    return {
        startFen: moves[0]?.before ?? chess.fen(),
        plies: moves.map((move) => ({ san: move.san, from: move.from, to: move.to, fen: move.after })),
    };
}

// Full PGN with the standard Seven Tag Roster and a few extra tags
export function pgnFile(game: Game): string {
    const { event, date, round, table, white, black, pgn } = game.data;
    const pgnDate = isoDate(date).replace(/-/g, ".");
    const tags: [string, string | number | null][] = [
        ["Event", event],
        ["Site", "?"],
        ["Date", pgnDate],
        ["Round", round],
        ["White", white.name],
        ["Black", black.name],
        ["Result", resultLabel(game)],
        ["Board", table],
        ["WhiteElo", white.elo || null],
        ["BlackElo", black.elo || null],
        ["WhiteTitle", white.title || null],
        ["BlackTitle", black.title || null],
    ];
    const header = tags
        .filter(([, value]) => value !== null && value !== "")
        .map(([key, value]) => `[${key} "${String(value).replace(/"/g, '\\"')}"]`)
        .join("\n");
    const movetext = pgn!.trim().replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "");
    return `${header}\n\n${movetext} ${resultLabel(game)}\n`;
}

export function pgnFileName(game: Game): string {
    const name = (p: Game["data"]["white"]) => p.name.replace(/\s+/g, "");
    return `${name(game.data.white)}_vs_${name(game.data.black)}_${isoDate(game.data.date)}.pgn`;
}

export function gameDescription(game: Game): string {
    const { white, black, event, round, date } = game.data;
    const elo = (p: Game["data"]["white"]) => (p.elo > 0 ? ` (${p.elo})` : "");
    const plies = replay(game).plies.length;
    const outcome = { white: "White wins", black: "Black wins", draw: "Draw" }[game.data.result];
    return `${playerName(white)}${elo(white)} vs ${playerName(black)}${elo(black)}, round ${round} of ${event}, ${formatDate(date)}. ${outcome} (${resultLabel(game)}) in ${Math.ceil(plies / 2)} moves. Replay the game move by move.`;
}
