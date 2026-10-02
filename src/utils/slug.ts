// "Campeonato Nacional 3ª Divisão 2022/2023" -> "campeonato-nacional-3a-divisao-2022-2023"
export function slugify(text: string): string {
    return text
        .normalize("NFKD")
        .replace(/[̀-ͯ]/g, "")
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
}
