export function safeStringify (value: unknown, space = 2) {
    const seen = new WeakSet<object>()
    return JSON.stringify(value, (key, val) => {
        if (val && typeof val === 'object') {
            if (seen.has(val)) return '[Circular]'
            seen.add(val)
        }
        return val
    }, space)
}
