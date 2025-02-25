/* eslint-env node */
module.exports = {
    root: true,
    parser: 'vue-eslint-parser',
    extends: '@voicenter-team/vue',
    globals: {
        JQuery: 'readonly',
    },
    env: {},
    ignorePatterns: [
        'src/vendors/*',
        'scripts/*'
    ]
}
