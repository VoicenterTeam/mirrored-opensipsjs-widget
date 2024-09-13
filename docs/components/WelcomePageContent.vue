<template>
    <div class="py-3 relative h-full flex items-center justify-center">
        <div class="w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <div class="py-5 lg:pt-10 pb-5 text-center">
                <h1 class="text-5xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-7xl">
                    <span>Opensips JS <span class="text-primary">Widget</span>
                    </span>
                </h1>
                <div class="py-5 tracking-tight mt-6 text-lg/8 lg:px-32 text-gray-900 dark:text-white space-y-3">
                    <p>The html widget element library built on top of <span class="text-primary">OpenSIPSJS</span>.</p>
                </div>
            </div>
            <div class="px-5 pb-8">
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-6 max-w-4xl mx-auto">
                    <IndexPageNavigation
                        v-for="nav in navigationLinks"
                        :key="nav.label"
                        :link-data="nav"
                    />
                </div>
            </div>
            <div class="text-center">
                <h3 class="font-semibold text-xl">Sponsored by</h3>
            </div>
            <div class="grid sm:grid-cols-2 gap-6 px-5 lg:px-12 pt-5 max-w-3xl mx-auto">
                <div class="rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img src="/voicenter-animated-logo.gif" alt="voicenter" class="w-full h-auto object-contain">
                </div>
                <div class="rounded-lg bg-gray-50 overflow-hidden flex items-center justify-center">
                    <img src="/opensips-logo.png" alt="opensips" class="w-full h-auto object-contain">
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">

const navigationLinks = [
    {
        label: 'Documentation',
        icon: 'i-heroicons:book-open',
        link: '/docs'
    },
    {
        label: 'API',
        icon: 'i-heroicons:server-stack',
        link: '/api'
    },
    {
        label: 'Example',
        icon: 'i-heroicons:window',
        link: '/example'
    },
    {
        label: 'OpensipsJS',
        icon: 'i-heroicons:cube',
        link: 'https://opensipsjs.org/',
        newTab: true
    }
]
</script>
