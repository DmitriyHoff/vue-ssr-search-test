<script setup lang="ts">
import type { BoundingBox, Point } from '@/typings/type';
import { ref, watch, onMounted } from 'vue'
import "../../node_modules/leaflet/dist/leaflet.css"
import { useSearchStore } from '@/stores/search';
import { storeToRefs } from 'pinia';
import type { Map } from 'leaflet';

/** Шаблон URL для загрузки изображений карты */
const TILE_LAYER = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png'

/* Leaflet работет только в брауре поэтому пока достаточно знать
 * только тип импортируемого модуля */
type LefletModule = typeof import("leaflet");

const props = defineProps<{
    bbox: BoundingBox,
    marker: Point,
    layer?: string
}>()

const searchStore = useSearchStore();
const { selectedResult } = storeToRefs(searchStore)

const isMounted = ref<boolean>(false);
let leafletModule: LefletModule
let mapObject: Map;

/** При изменении выбранного результата поиска следует обновить карту */
watch(selectedResult, (newValue) => {
    if (!isMounted.value) return

    const { boundingbox, lat, lon } = newValue || {}

    if (!boundingbox) return
    if (!lat || !lon) return

    const corner1 = leafletModule.latLng(boundingbox[0], boundingbox[2])
    const corner2 = leafletModule.latLng(boundingbox[1], boundingbox[3])
    const bounds = leafletModule.latLngBounds(corner1, corner2);

    leafletModule.tileLayer(TILE_LAYER).addTo(mapObject);
    mapObject.flyToBounds(bounds, {
        animate: true,
        duration: 1.2
    })
})

/* Событие onMounted отработает только в браузере,
 * а это значит, что доступен объект window, который необходим
 * для работы библиотеки leaflet
 */
onMounted(async () => {
    isMounted.value = true

    // импортируем leaflet и сохраняем модуль
    const { default: leaflet } = await import('leaflet')
    leafletModule = leaflet

    // инициализирем объект карты
    mapObject = leaflet.map('map', { attributionControl: false })

    // Устанавливаем точку центра и масштаб для первой отрисовки
    mapObject.setView([props.marker[0], props.marker[1]], 13);
    leaflet.tileLayer(TILE_LAYER).addTo(mapObject);
})
</script>

<template>
    <div id="map"></div>
</template>

<style scoped>
#map {
    height: 100%;
    width: 100%;
    overflow: hidden;
}
</style>
