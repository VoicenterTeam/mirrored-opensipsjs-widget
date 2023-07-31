<template>
    <Popper>
        <template #content>
            <div style="background-color: white; border-radius: 4px; border: 1px solid grey">
                <slot name="content" />
            </div>
        </template>
        <slot />
    </Popper>
</template>

<script lang="ts" setup>


</script>

<style scoped>

</style>
