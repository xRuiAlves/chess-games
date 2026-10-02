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
    props: { style: Style; children?: Child | Child[] };
}

function h(type: string, style: Style, ...children: Child[]): SatoriNode {
    return { type, props: { style, children: children.length === 1 ? children[0] : children } };
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
}

export async function renderOgImage({ title, subtitle }: OgOptions): Promise<Buffer> {
    const titleSize = title.length > 48 ? 56 : title.length > 28 ? 64 : 72;

    const tree = h(
        "div",
        { display: "flex", width: WIDTH, height: HEIGHT, padding: 56, fontFamily: "Inter" },
        h(
            "div",
            {
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                width: "100%",
                height: "100%",
                padding: "52px 60px",
                backgroundColor: "rgba(21, 24, 30, 0.94)",
                border: "1px solid #2a2e37",
                borderRadius: 32,
            },
            h(
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
            ),
            h(
                "div",
                {
                    display: "flex",
                    color: "#eef1f5",
                    fontSize: titleSize,
                    fontWeight: 700,
                    letterSpacing: -2,
                    lineHeight: 1.12,
                },
                title,
            ),
            h(
                "div",
                { display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 26 },
                h("div", { display: "flex", color: "#9ba3b0" }, subtitle),
                h("div", { display: "flex", color: "#5b8bd6", fontWeight: 600 }, "chess.ruialves.net"),
            ),
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
