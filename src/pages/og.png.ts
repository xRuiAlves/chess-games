import { renderOgImage } from "../utils/og";

export async function GET() {
    const png = await renderOgImage({
        title: "Chess tournaments, games and ratings",
        subtitle: "Grupo de Xadrez do Porto",
    });
    return new Response(new Uint8Array(png), { headers: { "Content-Type": "image/png" } });
}
