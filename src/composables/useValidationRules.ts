/* eslint-disable @typescript-eslint/no-explicit-any */
import { isNumeric } from '@/helpers/validationHelper'

const notZero = (message: string) => (rule: any, value: any, calback: any) => {
    if (value === undefined || value === 0) {
        calback(new Error(message))
    } else {
        calback()
    }
}

const isNumber = (message: string) => (rule: any, value: number | string, callback: any) => {
    if (typeof value === 'number') {
        return true
    }
    const isStringValid = value.split('').every(el => !isNaN(Number(el)))
    if (!isStringValid) {
        callback(new Error(message))
    } else {
        callback()
    }
}



const isNoneNumeric = (message: string) => (rule: any, value: number | string, callback: any) => {
    if (typeof value === 'number' || isNumeric(value)) {
        callback(new Error(message))
    } else {
        callback()
    }
}

export default function () {
    return {
        required: {
            required: true,
            message: 'Field is required'
        },
        email: { type: 'email' },
        min: (minValue: number) => {
            return {
                validator: (rule: unknown, value: number, callback: (error?: Error) => void) => {
                    if (value < minValue) {
                        callback(new Error(`Must be bigger than ${minValue}`))
                    } else {
                        callback()
                    }
                }
            }
        },
        notZero: {
            validator: notZero('Field is required'),
        },
        number: {
            validator: isNumber('The field may only contain numeric characters')
        },
        noneNumeric: {
            validator: isNoneNumeric('The field may only contain none-numeric characters')
        }
    }
}
