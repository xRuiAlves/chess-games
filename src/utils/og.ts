import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { Resvg } from "@resvg/resvg-js";
import satori from "satori";

const WIDTH = 1200;
const HEIGHT = 630;
const ROOT = process.cwd();

type Style = Record<string, string | number>;
type Child = SatoriNode | string;
interface SatoriNode {
    type: string;
    props: { style: Style; children?: Child | Child[]; [key: string]: unknown };
}

function h(type: string, style: Style, ...children: Child[]): SatoriNode {
    return { type, props: { style, children: children.length === 1 ? children[0] : children } };
}

const PIECE_FILES: Record<string, string> = {
    K: "white_king", Q: "white_queen", R: "white_rook", B: "white_bishop", N: "white_knight", P: "white_pawn",
    k: "black_king", q: "black_queen", r: "black_rook", b: "black_bishop", n: "black_knight", p: "black_pawn",
};
const pieceImages = new Map<string, Promise<string>>();

function pieceImage(piece: string): Promise<string> {
    if (!pieceImages.has(piece)) {
        const file = join(ROOT, `public/pieces/${PIECE_FILES[piece]}.png`);
        pieceImages.set(piece, readFile(file).then((data) => `data:image/png;base64,${data.toString("base64")}`));
    }
    return pieceImages.get(piece)!;
}

// board: 64 characters from a8 to h1, "." for an empty square
async function boardNode(board: string, orientation: "white" | "black", size: number): Promise<SatoriNode> {
    const square = size / 8;
    const indexes = [...Array(64).keys()];
    const ordered = orientation === "white" ? indexes : indexes.toReversed();
    const squares = await Promise.all(
        ordered.map(async (i) => {
            const dark = (Math.floor(i / 8) + (i % 8)) % 2 === 1;
            const node = h("div", { display: "flex", width: square, height: square, backgroundColor: dark ? "#8ca2ad" : "#dee3e6" });
            const piece = board[i];
            if (piece !== ".") {
                node.props.children = { type: "img", props: { src: await pieceImage(piece), width: square, height: square, style: {} } };
            }
            return node;
        }),
    );
    return h("div", { display: "flex", flexWrap: "wrap", width: size, height: size, borderRadius: 10, overflow: "hidden", flexShrink: 0 }, ...squares);
}

async function font(weight: 400 | 600 | 700) {
    const data = await readFile(join(ROOT, `node_modules/@fontsource/inter/files/inter-latin-${weight}-normal.woff`));
    return { name: "Inter", data, weight, style: "normal" as const };
}

async function waves(): Promise<string> {
    const svg = await readFile(join(ROOT, "public/waves-dark.svg"), "utf8");
    const inner = svg.slice(svg.indexOf(">") + 1, svg.lastIndexOf("</svg>"));
    return `<svg x="0" y="0" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 1600 1000" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;
}

export interface OgOptions {
    title: string;
    subtitle: string;
    board?: string;
    orientation?: "white" | "black";
}

export async function renderOgImage({ title, subtitle, board, orientation = "white" }: OgOptions): Promise<Buffer> {
    const longestLine = Math.max(...title.split("\n").map((line) => line.length));
    const titleSize = board
        ? longestLine > 22 ? 42 : 50
        : title.length > 48 ? 56 : title.length > 28 ? 64 : 72;

    const logo = h(
        "div",
        { display: "flex", alignItems: "center", gap: 18 },
        h(
            "div",
            {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: 60,
                height: 60,
                backgroundColor: "#1f4e8c",
                borderRadius: 16,
                color: "#ffffff",
                fontSize: 24,
                fontWeight: 700,
            },
            "RA",
        ),
        h("div", { display: "flex", color: "#eef1f5", fontSize: 30, fontWeight: 600 }, "Rui Alves"),
        h("div", { display: "flex", color: "#9ba3b0", fontSize: 30, fontWeight: 400 }, "· Chess"),
    );
    // A "\n" in the title starts a new line
    const heading = h(
        "div",
        { display: "flex", flexDirection: "column", color: "#eef1f5", fontSize: titleSize, fontWeight: 700, letterSpacing: -2, lineHeight: 1.12 },
        ...title.split("\n").map((line) => h("div", { display: "flex" }, line)),
    );
    const footer = h(
        "div",
        board
            ? { display: "flex", flexDirection: "column", gap: 10, fontSize: 24 }
            : { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 },
        h("div", { display: "flex", color: "#9ba3b0" }, subtitle),
        h("div", { display: "flex", color: "#5b8bd6", fontWeight: 600 }, "chess.ruialves.net"),
    );
    const text = h(
        "div",
        { display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, height: "100%" },
        logo,
        heading,
        footer,
    );

    const tree = h(
        "div",
        { display: "flex", width: WIDTH, height: HEIGHT, padding: 56, fontFamily: "Inter" },
        h(
            "div",
            {
                display: "flex",
                alignItems: "center",
                gap: 48,
                width: "100%",
                height: "100%",
                padding: board ? "52px 52px 52px 60px" : "52px 60px",
                backgroundColor: "rgba(21, 24, 30, 0.94)",
                border: "1px solid #2a2e37",
                borderRadius: 32,
            },
            text,
            ...(board ? [await boardNode(board, orientation, 408)] : []),
        ),
    );

    const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
        width: WIDTH,
        height: HEIGHT,
        fonts: await Promise.all([font(400), font(600), font(700)]),
    });
    const withBackground = svg.replace(/^<svg([^>]*)>/, `<svg$1>${await waves()}`);
    return new Resvg(withBackground, { fitTo: { mode: "width", value: WIDTH } }).render().asPng();
}
