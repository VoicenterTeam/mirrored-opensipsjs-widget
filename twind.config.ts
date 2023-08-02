import { defineConfig } from '@twind/core'
import presetTailwind from '@twind/preset-tailwind'
import presetAutoprefix from '@twind/preset-autoprefix'
import { defaultTheme } from '@/enum/defaultTheme.enum'

const colors = Object.keys(defaultTheme.colors)
    .reduce(
        (acc, key) => {
            acc[key] = `var(--${key})`

            return acc
        },
        {} as Record<string, string>
    )

export default defineConfig({
    presets: [ presetAutoprefix(), presetTailwind() ],
    /* config */
    theme: {
        extend: {
            colors
        },
        fontSize: {
            xs: '12px',
            xxs: '10px'
        }
    }
})
