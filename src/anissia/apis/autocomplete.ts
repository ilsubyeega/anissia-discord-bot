export default async function autoComplete(text: string) : Promise<Record<string, string>[]> {
    const req = await fetch('https://anissia.net/api/anime/autocorrect?q=' + encodeURIComponent(text));
    const json = await req.json() as string[]
    return json.map(str => {
        const id = str.substring(0, str.indexOf(' '))
        const name = str.substring(str.indexOf(' ') + 1)
        return {id, name}
    })
}