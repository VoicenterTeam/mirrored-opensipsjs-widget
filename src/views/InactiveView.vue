<template>
    <div className="flex flex-row">
        <div>
            Icon
        </div>
        <div class="bg-danger">
            <button @click="activateTab">Activate</button>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { useActiveTab } from '@/plugins/activeTabPlugin'

const { activateTab } = useActiveTab()


</script>

<style scoped>

</style>
