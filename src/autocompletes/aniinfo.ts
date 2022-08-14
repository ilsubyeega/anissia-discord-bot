import {
    APIApplicationCommandAutocompleteResponse,
    APIApplicationCommandInteractionDataStringOption,
    InteractionResponseType
} from "discord-api-types/v10";
import {
    AutoCompleteInteractionHandler,
    AutoCompleteInteractionType,
    DualAutocompleteInteraction,
    FunctionalCheck
} from "../lib/types";
import autoComplete from "../anissia/apis/autocomplete";
import getRank from "../anissia/apis/rank"
import RankingType from "../anissia/enums/ranking";

export default class AniInfo implements AutoCompleteInteractionType {
    check: FunctionalCheck<DualAutocompleteInteraction> = {
        check: async (data: DualAutocompleteInteraction) => {
            return data.data.name === "aniinfo"
        }
    }
    handle: AutoCompleteInteractionHandler = async (interaction: DualAutocompleteInteraction) => {

        const value = ((interaction.data.options[0]) as APIApplicationCommandInteractionDataStringOption).value
        if (value == null || value.length == 0 || value.replaceAll(" ", "").length == 0) {
            const req = await getRank(RankingType.WEEK)
            console.log(JSON.stringify(req))
            const result = {
                type: InteractionResponseType.ApplicationCommandAutocompleteResult,
                data: {
                    choices: req.slice(0, 10).map(anime => {
                        return {
                            name: anime.subject,
                            value: anime.animeNo.toString()
                        }
                    })
                }
            } as APIApplicationCommandAutocompleteResponse
            return result
        }

        const req = await autoComplete(value)
        const result = {
            type: InteractionResponseType.ApplicationCommandAutocompleteResult,
            data: {
                choices: req.slice(0, 10).map(anime => {
                    return {
                        name: anime.name,
                        value: anime.id
                    }
                })
            }
        } as APIApplicationCommandAutocompleteResponse
        return result
    };

}