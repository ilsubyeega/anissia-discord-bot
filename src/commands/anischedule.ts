import {
    APIApplicationCommand,
    APIApplicationCommandInteraction,
    APIApplicationCommandInteractionDataStringOption,
    APIChatInputApplicationCommandInteraction,
    ApplicationCommandOptionType,
    ApplicationCommandType,
    InteractionResponseType
} from "discord-api-types/v10";
import {CommandInteractionHandler, CommandInteractionType} from "../lib/types";
import Week from "../anissia/enums/week";
import getSchedule from "./../anissia/apis/schedule"

export default class AniSchedule implements CommandInteractionType {
    weekKO = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일", "기타", "신작"]
    weeks = [Week.SUNDAY, Week.MONDAY, Week.TUESDAY, Week.WEDNESDAY, Week.THURSDAY, Week.FRIDAY, Week.SATURDAY, Week.OTHER, Week.NEW]
    data: Omit<APIApplicationCommand, "application_id" | "id" | "version"> = {
        type: ApplicationCommandType.ChatInput,
        name: "anischedule",
        description: "애니 스케줄 정보를 확인합니다.",
        default_member_permissions: null,
        dm_permission: false,
        options: this.weekKO.map(week => {
            return {
                name: week,
                description: week,
                type: ApplicationCommandOptionType.Subcommand,
            }
        })
    }
    handle: CommandInteractionHandler = async (interaction: APIApplicationCommandInteraction) => {
        interaction = interaction as APIChatInputApplicationCommandInteraction
        console.log(JSON.stringify(interaction))
        const arg = (interaction.data.options?.[0] as APIApplicationCommandInteractionDataStringOption)?.name
        if (arg != null) {
            const engWeek = this.weeks[this.weekKO.indexOf(arg)]

            const req = await getSchedule(engWeek)

            const res = req.slice(0, 20).map(anime => {
                const time = (anime.time.length == 0) ? "-" : anime.time
                return `⏱ \`${time}\` [${anime.subject}](https://anissia.net/anime?animeNo=${anime.animeNo})`
            }).join("\n")

            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: `애니 스케쥴: ${arg} (${engWeek})`,
                            description: res
                        }
                    ]
                }
            }
        }

        return {
            type: InteractionResponseType.ChannelMessageWithSource,
            data: {
                content: "잘못된 접근입니다."
            }
        }
    }
}