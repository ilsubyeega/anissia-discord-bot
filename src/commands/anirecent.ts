import {
    APIApplicationCommand,
    APIApplicationCommandInteraction,
    ApplicationCommandType,
    InteractionResponseType,
    APIChatInputApplicationCommandInteraction,
    MessageFlags
} from "discord-api-types/v10";
import { CommandInteractionHandler, CommandInteractionType } from "../lib/types";
import getAnimeRecent from './../anissia/apis/recent'
export default class AniRecent implements CommandInteractionType {
    data: Omit<APIApplicationCommand, "application_id" | "id" | "version"> = {
        type: ApplicationCommandType.ChatInput,
        name: "anirecent",
        description: "최근 자막이 업데이트된 애니 목록을 확인합니다.",
        default_member_permissions: null,
        dm_permission: false,
        options: []
    }
    handle: CommandInteractionHandler = async (interaction: APIApplicationCommandInteraction) => {

        const recent = await getAnimeRecent()

        if (recent.length == 0) {
            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    content: "최근 업데이트된 애니가 없습니다.",
                    flags: MessageFlags.Ephemeral
                }
            }
        }

        const result = recent.map(anime => {
            const rawDate = anime.updDt + "+09:00"
            const date = Date.parse(rawDate)
            const timestamp = Math.floor(date / 1000)

            return `🎥 **${anime.episode.padStart(2, '0')}**화 [${anime.subject}](https://anissia.net/anime?animeNo=${anime.animeNo}) <t:${timestamp}:R> 🔗 *[${anime.name}](${anime.website})* `
        }).join("\n")

        /*const selectOptions = recent.map(anime => {
            return {
                label: `${anime.subject} - ${anime.episode}화 [${anime.name}]`,
                value: `get_anime_info:${anime.animeNo}`,
                description: '애니 정보를 확인합니다.'
            } as APISelectMenuOption
        })

        const select = {
            type: 3,
            custom_id: 'anirecent_click',
            options: selectOptions
        }*/

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                embeds: [
                    {
                        title: "최근 업데이트된 애니",
                        description: result
                    }
                ]
                /*components: [
                    {
                        type: ComponentType.ActionRow,
                        components: [
                            select
                        ]
                    }
                ]*/
            }
        }
    }
}