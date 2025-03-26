export function isOnlyDigits (str: string) {
    // Check if the string contains only digits
    const regex = /^\d+$/
    return regex.test(str)
}