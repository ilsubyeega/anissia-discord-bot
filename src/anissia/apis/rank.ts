import AnimeRank from "../interfaces/animerank";
import RankingType from "../enums/ranking";

export default async function schedule(type: RankingType) : Promise<AnimeRank[]> {
    const req = await fetch('https://anissia.net/api/anime/rank/' + type.toString())
    const json = await req.json()
    return json as AnimeRank[]
}