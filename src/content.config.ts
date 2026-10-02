import { defineCollection } from "astro:content";
import { file } from "astro/loaders";
import { z } from "astro/zod";
import { slugify } from "./utils/slug";

// Dates in the data files use the DD-MM-YYYY format
const date = z
    .string()
    .regex(/^\d{2}-\d{2}-\d{4}$/)
    .transform((value) => {
        const [day, month, year] = value.split("-").map(Number);
        return new Date(Date.UTC(year, month - 1, day));
    });

const player = z.object({
    title: z.string(),
    name: z.string(),
    elo: z.number(),
    club: z.string().nullable(),
});

const tournaments = defineCollection({
    loader: file("data/events.json", {
        parser: (text) => JSON.parse(text).map((event: { name: string }) => ({ id: slugify(event.name), ...event })),
    }),
    schema: z.object({
        name: z.string(),
        date,
        finishDate: date.nullable(),
        location: z.object({ name: z.string(), gmaps: z.url() }),
        page: z.url().nullable(),
        category: z.enum(["Classic", "Rapid", "Blitz"]),
        timeControl: z.string(),
        team: z.boolean(),
        rated: z.boolean(),
        ratingDiff: z.string().nullable(),
        performance: z.number().nullable(),
        numPlayers: z.number().nullable(),
        rank: z.number().nullable(),
        score: z.string().nullable(),
        notes: z.string().nullable(),
    }),
});

const games = defineCollection({
    loader: file("data/games.json", {
        parser: (text) => JSON.parse(text).map((game: object, index: number) => ({ id: String(index + 1), ...game })),
    }),
    schema: z.object({
        event: z.string(),
        date,
        round: z.number(),
        table: z.number().nullable(),
        white: player,
        black: player,
        result: z.enum(["white", "black", "draw"]),
        view: z.enum(["white", "black"]),
        pgn: z.string().nullable(),
        lichess_url: z.url().nullable(),
        in_progress: z.boolean(),
    }),
});

export const collections = { tournaments, games };
