<script setup lang="ts">
import type { OpenStreetMapObject } from '@/typings/interface';

defineProps<{
    resultObject: OpenStreetMapObject
    active?: boolean
}>()
</script>

<template>
    <div class="result" :class="{ 'result--active': active }">
        <span class="result__display-name">{{ resultObject.display_name }}</span>
        <span class="result__type capitalize-first">{{ resultObject.type }}</span>
    </div>
</template>

<style lang="scss" scoped>
.result {
    gap: 1rem;
    padding: 1rem;
    cursor: pointer;

    &__type {
        display: inline-block;
        padding: 0 0.25rem;
        font-size: 0.75rem;
        color: var(--color-green);
    }

    &--active {
        background-color: var(--color-green-active);
    }
}

@media (hover: hover) {
    .result:hover {
        background-color: var(--color-green-hover);
    }
}
</style>
