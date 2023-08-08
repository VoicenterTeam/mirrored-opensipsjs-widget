type TValue = string | number | undefined;
type TDefault = string | undefined;

export function toCssValue(value: TValue): string | undefined;
export function toCssValue<Default extends TDefault>(value: TValue, defaultValue: Default): Default | string;
export function toCssValue<Default extends TDefault> (value: TValue, defaultValue: Default = undefined as any): Default | string {
    if (typeof value === 'undefined') {
        return defaultValue
    }

    if (typeof value === 'number') {
        return `${value}px` as any
    }

    // Check if it's already a valid CSS value (e.g., '2rem', '50%', '5vh')
    const validCssUnits = [ 'rem', 'em', 'vh', 'vw', 'px', '%' ]
    const isAlreadyCssValue = validCssUnits.some(unit => value.endsWith(unit))
    if (isAlreadyCssValue) {
        return value as any
    }

    // If it's a simple number in string form, convert it to px
    if (!isNaN(Number(value))) {
        return `${value}px` as any
    }

    return defaultValue
}
