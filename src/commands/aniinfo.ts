import {
    APIApplicationCommand,
    APIApplicationCommandInteraction,
    APIApplicationCommandInteractionDataStringOption,
    APIChatInputApplicationCommandInteraction,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    ButtonStyle,
    ComponentType,
    InteractionResponseType,
    MessageFlags
} from "discord-api-types/v10";
import {CommandInteractionHandler, CommandInteractionType} from "../lib/types";
import getAnimeInfo from "../anissia/apis/animeinfo"

export default class AniInfo implements CommandInteractionType {
    data: Omit<APIApplicationCommand, "application_id" | "id" | "version"> = {
        type: ApplicationCommandType.ChatInput,
        name: "aniinfo",
        description: "애니 정보를 확인합니다.",
        default_member_permissions: null,
        dm_permission: false,
        options: [
            {
                name: "aniinfo_id",
                description: "ID를 통한 검색 (이름으로 작성 시 자동완성)",
                type: ApplicationCommandOptionType.String,
                required: true,
                autocomplete: true
            }
        ]
    }
    handle: CommandInteractionHandler = async (interaction: APIApplicationCommandInteraction) => {
        interaction = interaction as APIChatInputApplicationCommandInteraction
        const arg = (interaction.data.options?.[0] as APIApplicationCommandInteractionDataStringOption)?.value
        if (arg == null) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "잘못된 접근입니다."
                }
            }
        }

        const anime = await getAnimeInfo(encodeURIComponent(arg))
        if (anime == null || anime.subject == null || anime.subject.length == 0) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: `${arg} 와 관련된 검색 결과를 찾을 수 없습니다.`,
                    flags: MessageFlags.Ephemeral
                }
            }
        }

        const beautifyDate = (datestr: string) => {
            datestr += "+09:00"
            const d = new Date(Date.parse(datestr))
            return d.toLocaleString("ko-KR")
        }

        const koWeeks = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "기타", "신작"]
        const strarr = [];
        strarr.push(`방영 기간: ${anime.startDate} ~ ` + (anime.endDate || "방영중"))
        if (!isNaN(parseInt(anime.week)))
            strarr.push(`방영상태: 매주 ${koWeeks[parseInt(anime.week)]} ${anime.time}`)
        strarr.push(`장르: ${anime.genres.replaceAll(",", ", ")}`)
        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: anime.subject,
                        description: strarr.join("\n"),
                        fields: anime.captions.map(caption => {
                            return {
                                name: `${caption.name} (${caption.episode.padStart(2, '0')}화)`,
                                value: `[${beautifyDate(caption.updDt)}](${caption.website})`
                            }
                        })
                    }
                ],
                components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            {
                                type: ComponentType.Button,
                                label: "🔗 애니시아 웹사이트",
                                style: ButtonStyle.Link,
                                url: `https://anissia.net/anime?animeNo=${anime.animeNo}`
                            },
                            {
                                type: ComponentType.Button,
                                label: "🔗 공식 웹사이트",
                                style: ButtonStyle.Link,
                                url: anime.website
                            }
                        ]
                    }
                ]
            }
        }
    }
}