import type { APIContext } from "astro";
import { formatDateRange, getTournaments, type Tournament } from "../../../utils/tournaments";
import { renderOgImage } from "../../../utils/og";

export async function getStaticPaths() {
    const tournaments = await getTournaments();
    return tournaments.map((tournament) => ({ params: { slug: tournament.id }, props: { tournament } }));
}

export async function GET({ props }: APIContext<{ tournament: Tournament }>) {
    const { name, date, finishDate, category, timeControl } = props.tournament.data;
    const png = await renderOgImage({
        title: name,
        subtitle: `${category} · ${timeControl} · ${formatDateRange(date, finishDate)}`,
    });
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
