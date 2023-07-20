export function parseJSON (input: string | undefined): unknown {
    try {
        return JSON.parse(input || '')
    } catch {
        return null
    }
}
