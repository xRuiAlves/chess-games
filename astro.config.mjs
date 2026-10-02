import { readFileSync } from "node:fs";
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

const slugify = (text) =>
    text
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");

const toDate = (value) => {
    const [day, month, year] = value.split("-").map(Number);
    return new Date(Date.UTC(year, month - 1, day));
};

// Map each tournament and game URL to its date, for the sitemap's lastmod
const readData = (file) => JSON.parse(readFileSync(new URL(`./data/${file}`, import.meta.url), "utf8"));
const pageDates = new Map([
    ...readData("events.json").map((t) => [`/tournament/${slugify(t.name)}/`, toDate(t.finishDate ?? t.date)]),
    ...readData("games.json")
        .filter((g) => g.pgn)
        .map((g) => [`/tournament/${slugify(g.event)}/round-${g.round}/`, toDate(g.date)]),
]);
const buildDate = new Date();

export default defineConfig({
    site: "https://chess.ruialves.net",
    trailingSlash: "ignore",
    integrations: [
        sitemap({
            // The home and ratings pages show ratings read at build time
            serialize(item) {
                const path = new URL(item.url).pathname;
                item.lastmod = pageDates.get(path) ?? buildDate;
                return item;
            },
        }),
    ],
});
