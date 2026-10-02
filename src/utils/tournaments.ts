import { getCollection, type CollectionEntry } from "astro:content";

export type Tournament = CollectionEntry<"tournaments">;
export type Game = CollectionEntry<"games">;
export type Player = Game["data"]["white"];

const longDate = new Intl.DateTimeFormat("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
const monthYear = new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

export async function getTournaments(): Promise<Tournament[]> {
    const tournaments = await getCollection("tournaments");
    return tournaments.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf() || a.data.name.localeCompare(b.data.name));
}

export async function getGames(tournament: Tournament): Promise<Game[]> {
    const games = await getCollection("games", (game) => game.data.event === tournament.data.name);
    return games.sort((a, b) => a.data.date.valueOf() - b.data.date.valueOf() || a.data.round - b.data.round);
}

export function tournamentUrl(tournament: Tournament): string {
    return `/tournament/${tournament.id}/`;
}

export function tournamentYears(tournament: Tournament): number[] {
    const { date, finishDate } = tournament.data;
    return [...new Set([date, finishDate ?? date].map((d) => d.getUTCFullYear()))];
}

export function rounds(tournament: Tournament): number | null {
    const total = tournament.data.score?.match(/\/\s*(\d+)/)?.[1];
    return total ? Number(total) : null;
}

export function isoDate(date: Date): string {
    return date.toISOString().slice(0, 10);
}

export function formatDate(date: Date): string {
    return longDate.format(date);
}

export function formatMonthYear(date: Date): string {
    return monthYear.format(date);
}

export function formatDateRange(start: Date, end: Date | null): string {
    if (!end || end.valueOf() === start.valueOf()) {
        return formatDate(start);
    }
    const sameYear = start.getUTCFullYear() === end.getUTCFullYear();
    const sameMonth = sameYear && start.getUTCMonth() === end.getUTCMonth();
    if (sameMonth) {
        return `${start.getUTCDate()}–${formatDate(end)}`;
    }
    if (sameYear) {
        return `${formatDate(start).replace(/ \d{4}$/, "")} – ${formatDate(end)}`;
    }
    return `${formatDate(start)} – ${formatDate(end)}`;
}

export function ordinal(n: number): string {
    const tens = n % 100;
    const suffix = tens >= 11 && tens <= 13 ? "th" : ({ 1: "st", 2: "nd", 3: "rd" } as Record<number, string>)[n % 10] ?? "th";
    return `${n}${suffix}`;
}

export function playerName(player: Player): string {
    return player.title ? `${player.title} ${player.name}` : player.name;
}

export function gameOutcome(game: Game): "win" | "loss" | "draw" {
    if (game.data.result === "draw") {
        return "draw";
    }
    return game.data.result === game.data.view ? "win" : "loss";
}
