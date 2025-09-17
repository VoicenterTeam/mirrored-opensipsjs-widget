export function isNumeric (value: unknown) {
    return !isNaN(value as number) && typeof value !== 'boolean' &&
        value !== '' && !isNaN(parseFloat(value as string)) && isFinite(value as number)
}
