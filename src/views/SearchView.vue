<script setup lang="ts">
import LeafletMap from '@/components/LeafletMap.vue';
import SearchBox from '../components/SearchBox.vue'
import { useSearchStore } from '@/stores/search';
import type { Point } from '@/typings/type';
import { storeToRefs } from 'pinia';
import { watch } from 'vue';


const searchStore = useSearchStore()

const { selectedResult } = storeToRefs(searchStore)

watch(() => selectedResult.value, (newValue) => {
    if (newValue)
        searchStore.setAsSelected(newValue)
}, { deep: true })

</script>
<template>
    <div class="search">
        <h1>This is search page</h1>

        <div class="search__container">
            <SearchBox />

            <div class="map-container">
                <LeafletMap v-if="selectedResult" :bbox="selectedResult.boundingbox"
                    :marker="[parseFloat(selectedResult.lat), parseFloat(selectedResult.lon)] as Point" />

                <div v-else class="empty">Ничего не выбрано</div>
            </div>


        </div>

    </div>
</template>

<style lang="scss" scoped>
.search {
    &__container {
        display: flex;
        flex-wrap: nowrap;
        gap: 1rem;
    }
}

.map-container {
    flex-shrink: 0;
    width: 300px;
    height: 300px;
}

.empty {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: var(--color-background-mute);
    border-radius: 0.5rem;
    border: 1px solid var(--color-border);
}
</style>
