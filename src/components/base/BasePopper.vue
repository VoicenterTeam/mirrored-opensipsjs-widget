<template>
    <Popper v-bind="$attrs" arrow>
        <slot />
        <template #content="props">
            <slot name="content" v-bind="props" />
        </template>
    </Popper>
</template>
