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
import RankingType from "../anissia/enums/ranking";
import getRanking from "../anissia/apis/rank"

export default class AniRank implements CommandInteractionType {
    rankKO = ["주간", "월간", "분기"]
    ranks = [RankingType.WEEK, RankingType.MONTH, RankingType.QUARTER]
    data: Omit<APIApplicationCommand, "application_id" | "id" | "version"> = {
        type: ApplicationCommandType.ChatInput,
        name: "anirank",
        description: "애니시아에서 특정 종류의 랭킹을 확인합니다..",
        default_member_permissions: null,
        dm_permission: false,
        options: this.rankKO.map(ranks => {
            return {
                name: ranks,
                description: `${ranks} 랭킹을 확인합니다.`,
                type: ApplicationCommandOptionType.Subcommand,
            }
        })
    }
    handle: CommandInteractionHandler = async (interaction: APIApplicationCommandInteraction) => {
        interaction = interaction as APIChatInputApplicationCommandInteraction
        const arg = (interaction.data.options?.[0] as APIApplicationCommandInteractionDataStringOption)?.name
        if (arg != null) {

            const rank = this.ranks[this.rankKO.indexOf(arg)]

            const req = await getRanking(rank)

            const res = req.slice(0, 20).map(anime => {
                return `#${anime.rank.toString().padStart(2, '0')} [${anime.subject}](https://anissia.net/anime?animeNo=${anime.animeNo}) (${anime.diff})`
            }).join("\n")

            return {
                type: InteractionResponseType.ChannelMessageWithSource,
                data: {
                    embeds: [
                        {
                            title: `애니 랭킹: ${arg} (${rank})`,
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