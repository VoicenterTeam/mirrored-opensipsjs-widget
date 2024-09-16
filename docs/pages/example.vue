<template>
    <div class="example-page w-full h-full">
        <ClientOnly>
            <ExampleContent />
        </ClientOnly>
    </div>
</template>

<script setup lang="ts">
useSeoMeta({
    titleTemplate: '%s | OpenSIPSJS',
    title: 'Demo',
    ogTitle: 'Demo',
    description: 'This library is a wrapper over the opensips-js implementation.',
    ogDescription: 'This library is a wrapper over the opensips-js implementation.'
})
</script>
