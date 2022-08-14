import AnimeInfo from "../interfaces/animeinfo";
import Week from "../enums/week";

export default async function schedule(week: Week) : Promise<AnimeInfo[]> {
    const req = await fetch('https://anissia.net/api/anime/schedule/' + week, {
        headers: new Headers({
            "User-Agent": "anissia-discord-bot"
        })
    })
    const json = await req.json()
    return json as AnimeInfo[]
}