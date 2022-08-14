import { REGISTERED_COMMANDS } from '../../registered'
import { RouteBases } from 'discord-api-types/v10'
export async function register_commands(applicationId: String, token: String, enableLogging = true) {
    for (const command of REGISTERED_COMMANDS) {
        console.log(JSON.stringify(command.data))
        const request = await fetch(`${RouteBases.api}/applications/${applicationId}/commands`, {
            method: 'POST',
            headers: {
                'Authorization': `Bot ${token}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(command.data)
        })
        if (request.status != 201 && request.status != 200) {
            console.error(`${command.data.name} updated or didnt registered: ${await request.text()}`)
            throw `${command.data.name} updated or didnt registered: ${await request.text()}`
        }
        if (enableLogging) console.log(`Successfully Registered ${command.data.name}`)
    }
}