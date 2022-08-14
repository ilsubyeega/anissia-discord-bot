import Caption from "./caption";

export default interface AnimeInfo {
    animeNo: number,
    captionCount: number,
    captions: Caption[],
    endDate: string,
    genres: string,
    startDate: string,
    status: string,
    subject: string,
    time: string,
    website: string,
    week: string
}