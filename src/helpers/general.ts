export function validTarget (str: string) {
    // Check if the string contains only digits and *
    const regex = /^[\d*]+$/
    return regex.test(str)
}
