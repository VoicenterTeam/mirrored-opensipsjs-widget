/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    root: true,
    'extends': [
        'plugin:vue/vue3-essential',
        'eslint:recommended',
        '@vue/eslint-config-typescript'
    ],
    parserOptions: {
        ecmaVersion: 'latest'
    },
    rules: {
        '@typescript-eslint/consistent-type-imports': [
            'error',
            {
                prefer: 'type-imports',
                disallowTypeAnnotations: true
            }
        ],
        'vue/component-api-style': [ 'error',
            [ 'script-setup', 'composition', 'options' ]
        ],
        '@typescript-eslint/ban-ts-comment': [ 'error' ],
        '@typescript-eslint/no-unused-vars': 'error',
        'no-unused-vars': 'off',
        'no-console': [ 'error', { allow: [ 'warn', 'error' ] } ],
        'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
        'semi': [ 'error', 'never' ],
        'quotes': [ 'error', 'single' ],
        'object-curly-spacing': [ 'error', 'always' ],
        'array-bracket-spacing': [ 'error', 'always' ],
        'space-before-function-paren': [ 'error', 'always' ],
        'vue/component-tags-order': [ 'error', { order: [ 'template', 'script', 'style' ] } ],
        'vue/no-v-html': 0,
        '@typescript-eslint/no-var-requires': 0,
        'vue/html-indent': [ 'error', 4 ],
        'vue/script-indent': [ 'error', 4, { 'switchCase': 1 } ],
        'indent': [ 'error', 4, { 'SwitchCase': 1 } ],
        'vue/v-on-event-hyphenation': 'off',
        'vue/multi-word-component-names': 'off',
        'vue/html-self-closing': [ 'error', {
            'html': {
                'void': 'never',
                'normal': 'always',
                'component': 'always'
            },
            'svg': 'always',
            'math': 'always'
        } ],
        'vue/attributes-order': [ 'error', {
            'order': [
                'DEFINITION',
                'LIST_RENDERING',
                'CONDITIONALS',
                'RENDER_MODIFIERS',
                'GLOBAL',
                [ 'UNIQUE', 'SLOT' ],
                'TWO_WAY_BINDING',
                'OTHER_DIRECTIVES',
                'OTHER_ATTR',
                'EVENTS',
                'CONTENT'
            ],
            'alphabetical': false
        } ]
    },
}
