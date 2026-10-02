import type { APIContext } from "astro";
import { getGames, getTournaments } from "../../../utils/tournaments";
import { gameSlug, hasMoves, pgnFile, pgnFileName } from "../../../utils/games";
import type { Game } from "../../../utils/tournaments";

export async function getStaticPaths() {
    const paths = [];
    for (const tournament of await getTournaments()) {
        for (const game of (await getGames(tournament)).filter(hasMoves)) {
            paths.push({ params: { slug: tournament.id, game: gameSlug(game) }, props: { game } });
        }
    }
    return paths;
}

export function GET({ props }: APIContext<{ game: Game }>) {
    return new Response(pgnFile(props.game), {
        headers: {
            "Content-Type": "application/vnd.chess-pgn; charset=utf-8",
            "Content-Disposition": `attachment; filename="${pgnFileName(props.game)}"`,
        },
    });
}
