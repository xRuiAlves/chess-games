import type { APIContext } from "astro";
import { formatDate, getGames, getTournaments, playerName, type Game } from "../../../../utils/tournaments";
import { boardFromFen, gameSlug, hasMoves, replay, resultLabel } from "../../../../utils/games";
import { renderOgImage } from "../../../../utils/og";

export async function getStaticPaths() {
    const paths = [];
    for (const tournament of await getTournaments()) {
        for (const game of (await getGames(tournament)).filter(hasMoves)) {
            paths.push({ params: { slug: tournament.id, game: gameSlug(game) }, props: { game } });
        }
    }
    return paths;
}

export async function GET({ props }: APIContext<{ game: Game }>) {
    const { game } = props;
    const { plies, startFen } = replay(game);
    const png = await renderOgImage({
        title: `${playerName(game.data.white)}\nvs ${playerName(game.data.black)}`,
        subtitle: `${resultLabel(game)} · Round ${game.data.round} · ${formatDate(game.data.date)}`,
        board: boardFromFen(plies.at(-1)?.fen ?? startFen),
        orientation: game.data.view,
    });
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
