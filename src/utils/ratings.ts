import { FIDE_ID, LICHESS_USER } from "../consts";

export interface FideRatingPeriod {
    period: Date;
    standard: number | null;
    rapid: number | null;
    blitz: number | null;
}

export interface FideRatings {
    url: string;
    inactive: boolean;
    history: FideRatingPeriod[];
    current: FideRatingPeriod;
    highestStandard: FideRatingPeriod;
}

export interface LichessRatings {
    url: string;
    username: string;
    blitz: number | null;
    rapid: number | null;
    classical: number | null;
    correspondence: number | null;
    puzzle: number | null;
}

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const TIMEOUT_MS = 15_000;

// Ratings are read once per build, when the site is generated
export const ratingsDate = new Date();

let fide: Promise<FideRatings | null> | undefined;
let lichess: Promise<LichessRatings | null> | undefined;

export function getFideRatings(): Promise<FideRatings | null> {
    return (fide ??= fetchFideRatings());
}

export function getLichessRatings(): Promise<LichessRatings | null> {
    return (lichess ??= fetchLichessRatings());
}

function cellText(html: string): string {
    return html.replace(/<[^>]+>/g, "").replace(/&nbsp;/g, " ").trim();
}

function rating(text: string): number | null {
    const value = Number.parseInt(text, 10);
    return Number.isFinite(value) && value > 0 ? value : null;
}

async function fetchFideRatings(): Promise<FideRatings | null> {
    const url = `https://ratings.fide.com/profile/${FIDE_ID}`;
    try {
        const response = await fetch(url, {
            headers: { "User-Agent": "Mozilla/5.0 (compatible; chess.ruialves.net build)" },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const html = await response.text();
        const table = html.match(/<table[^>]*profile-table_calc[^>]*>([\s\S]*?)<\/table>/)?.[1];
        if (!table) {
            throw new Error("rating history table not found");
        }
        const history = [...table.matchAll(/<tr[^>]*>([\s\S]*?)<\/tr>/g)]
            .map(([, row]) => [...row.matchAll(/<td[^>]*>([\s\S]*?)<\/td>/g)].map(([, cell]) => cellText(cell)))
            .filter((cells) => /^\d{4}-[A-Za-z]{3}$/.test(cells[0] ?? ""))
            .map(([period, standard, , rapid, , blitz]) => {
                const [year, month] = period.split("-");
                return {
                    period: new Date(Date.UTC(Number(year), MONTHS.indexOf(month), 1)),
                    standard: rating(standard),
                    rapid: rating(rapid),
                    blitz: rating(blitz),
                };
            });
        if (history.length === 0) {
            throw new Error("rating history table is empty");
        }
        const highestStandard = history.reduce((best, entry) =>
            (entry.standard ?? 0) > (best.standard ?? 0) ? entry : best,
        );
        return {
            url,
            inactive: /profile-standart[\s\S]{0,300}?inactive/i.test(html),
            history,
            current: history[0],
            highestStandard,
        };
    } catch (error) {
        console.warn(`[ratings] Could not read FIDE ratings: ${(error as Error).message}`);
        return null;
    }
}

async function fetchLichessRatings(): Promise<LichessRatings | null> {
    try {
        const response = await fetch(`https://lichess.org/api/user/${LICHESS_USER}`, {
            headers: { Accept: "application/json" },
            signal: AbortSignal.timeout(TIMEOUT_MS),
        });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        const user = await response.json();
        const perf = (name: string): number | null => user.perfs?.[name]?.rating ?? null;
        return {
            url: user.url ?? `https://lichess.org/@/${LICHESS_USER}`,
            username: user.username,
            blitz: perf("blitz"),
            rapid: perf("rapid"),
            classical: perf("classical"),
            correspondence: perf("correspondence"),
            puzzle: perf("puzzle"),
        };
    } catch (error) {
        console.warn(`[ratings] Could not read Lichess ratings: ${(error as Error).message}`);
        return null;
    }
}
