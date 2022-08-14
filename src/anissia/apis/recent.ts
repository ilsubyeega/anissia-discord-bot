import AnimeRecent from "../interfaces/animerecent";

export default async function recent() : Promise<AnimeRecent[]> {
    const req = await fetch("https://anissia.net/api/anime/caption/recent")
    const json = await req.json()
    return json as AnimeRecent[]
}