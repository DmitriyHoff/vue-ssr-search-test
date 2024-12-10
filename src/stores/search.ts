import { ref } from 'vue'
import { defineStore } from 'pinia'
import type { OpenStreetMapObject } from '@/typings/interface'

export const useSearchStore = defineStore('search', () => {
    const searchResults = ref<OpenStreetMapObject[]>([])
    const selectedResult = ref<OpenStreetMapObject>()
    const queryString = ref<string>()

    function setAsSelected(result: OpenStreetMapObject) {
        selectedResult.value = result
    }
    return { searchResults, selectedResult, queryString, setAsSelected }
})
