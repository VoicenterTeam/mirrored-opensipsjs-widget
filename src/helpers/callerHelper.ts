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
    const hasPlus = number[0] === '+'
    const onlyNumber = hasPlus ? number.slice(1) : number

    if (useMask) {
        let countryCode = ''
        let mainNumber = onlyNumber

        if (onlyNumber.length > 10) {
            countryCode = onlyNumber.slice(0, onlyNumber.length - 10)
            mainNumber = onlyNumber.slice(onlyNumber.length - 10)
        }

        const lastDigit = mainNumber[mainNumber.length - 1]
        const maskedMainNumber = 'X'.repeat(mainNumber.length - 1)

        return `${countryCode}${maskedMainNumber}${lastDigit}`
    } else {
        return number
    }
}

