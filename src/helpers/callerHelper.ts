export function getCallerInfo (number: string, name: string = '', displayName: boolean = true, useMask: boolean = false) {
    const onlyNumber = number[0] === '+' ? number.slice(1) : number

    if (name && displayName) {
        return name
    } else if (useMask && onlyNumber.length === 12) {
        const countryCode = onlyNumber.slice(0, 3)
        const lastDigit = onlyNumber[onlyNumber.length - 1]
        return `${countryCode}XXXXXXXX${lastDigit}`
    } else if (useMask && onlyNumber.length === 10) {
        const lastDigit = onlyNumber[onlyNumber.length - 1]
        return `XXXXXXXXX${lastDigit}`
    } else {
        return number
    }
}

export function getCallerNumber (number: string, useMask: boolean = false) {
    const onlyNumber = number[0] === '+' ? number.slice(1) : number

    if (useMask && onlyNumber.length === 12) {
        const countryCode = onlyNumber.slice(0, 3)
        const lastDigit = onlyNumber[onlyNumber.length - 1]
        return `${countryCode}XXXXXXXX${lastDigit}`
    } else if (useMask && onlyNumber.length === 10) {
        const lastDigit = onlyNumber[onlyNumber.length - 1]
        return `XXXXXXXXX${lastDigit}`
    } else {
        return number
    }
}