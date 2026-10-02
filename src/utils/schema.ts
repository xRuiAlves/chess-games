import { AUTHOR, SITE_DESCRIPTION, SITE_NAME } from "../consts";
import type { FideRatings } from "./ratings";
import { isoDate, tournamentUrl, type Game, type Tournament } from "./tournaments";
import { gameTitle, gameUrl, hasMoves } from "./games";

type JsonLd = Record<string, unknown>;

const person: JsonLd = {
    "@type": "Person",
    name: AUTHOR.name,
    url: AUTHOR.url,
    sameAs: AUTHOR.sameAs,
    memberOf: { "@type": "SportsOrganization", name: "Grupo de Xadrez do Porto", url: "http://www.gxp.pt" },
};

function breadcrumbs(site: URL, items: [string, string][]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "BreadcrumbList",
        itemListElement: items.map(([name, path], i) => ({
            "@type": "ListItem",
            position: i + 1,
            name,
            item: new URL(path, site).href,
        })),
    };
}

export function homeSchema(site: URL, tournaments: Tournament[]): JsonLd {
    return {
        "@context": "https://schema.org",
        "@type": "ProfilePage",
        name: SITE_NAME,
        description: SITE_DESCRIPTION,
        url: site.href,
        inLanguage: "en",
        mainEntity: person,
        hasPart: {
            "@type": "ItemList",
            name: "Tournaments",
            numberOfItems: tournaments.length,
            itemListElement: tournaments.map((t, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: new URL(tournamentUrl(t), site).href,
                name: t.data.name,
            })),
        },
    };
}

export function tournamentSchema(site: URL, tournament: Tournament, games: Game[], description: string): JsonLd[] {
    const t = tournament.data;
    const url = new URL(tournamentUrl(tournament), site).href;
    return [
        {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: t.name,
            description,
            url,
            sport: "Chess",
            startDate: isoDate(t.date),
            endDate: isoDate(t.finishDate ?? t.date),
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: t.location.name, address: t.location.name, hasMap: t.location.gmaps },
            ...(t.page && { sameAs: t.page }),
            ...(t.numPlayers && { maximumAttendeeCapacity: t.numPlayers }),
            competitor: person,
            image: new URL(`/og/tournament/${tournament.id}.png`, site).href,
            subEvent: games.map((game) => ({
                "@type": "SportsEvent",
                name: `${t.name}, round ${game.data.round}: ${game.data.white.name} vs ${game.data.black.name}`,
                sport: "Chess",
                startDate: isoDate(game.data.date),
                ...(hasMoves(game) && { url: new URL(gameUrl(game), site).href }),
                competitor: [game.data.white, game.data.black].map((p) => ({ "@type": "Person", name: p.name })),
            })),
        },
        breadcrumbs(site, [
            ["Tournaments", "/"],
            [t.name, tournamentUrl(tournament)],
        ]),
    ];
}

export function ratingsSchema(site: URL, fide: FideRatings | null): JsonLd[] {
    return [
        {
            "@context": "https://schema.org",
            "@type": "WebPage",
            name: "Ratings",
            url: new URL("/ratings/", site).href,
            about: person,
            ...(fide && { dateModified: isoDate(fide.current.period) }),
        },
        breadcrumbs(site, [
            ["Tournaments", "/"],
            ["Ratings", "/ratings/"],
        ]),
    ];
}

export function gameSchema(site: URL, game: Game, tournament: Tournament, description: string): JsonLd[] {
    const url = new URL(gameUrl(game), site).href;
    const players = [game.data.white, game.data.black].map((p) =>
        p.name === AUTHOR.name ? person : { "@type": "Person", name: p.name },
    );
    return [
        {
            "@context": "https://schema.org",
            "@type": "SportsEvent",
            name: `${gameTitle(game)}, round ${game.data.round} of ${tournament.data.name}`,
            description,
            url,
            sport: "Chess",
            startDate: isoDate(game.data.date),
            eventStatus: "https://schema.org/EventScheduled",
            eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
            location: { "@type": "Place", name: tournament.data.location.name, address: tournament.data.location.name },
            competitor: players,
            superEvent: { "@type": "SportsEvent", name: tournament.data.name, url: new URL(tournamentUrl(tournament), site).href },
            image: new URL(`/og/tournament/${tournament.id}/round-${game.data.round}.png`, site).href,
        },
        breadcrumbs(site, [
            ["Tournaments", "/"],
            [tournament.data.name, tournamentUrl(tournament)],
            [`Round ${game.data.round}`, gameUrl(game)],
        ]),
    ];
}
