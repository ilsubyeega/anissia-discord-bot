import AnimeInfo from "../interfaces/animeinfo";

export default async function animeInfo(text: string) : Promise<AnimeInfo> {
    const req = await fetch('https://anissia.net/api/anime/animeNo/' + encodeURIComponent(text));
    const json = await req.json()
    return json as AnimeInfo
}