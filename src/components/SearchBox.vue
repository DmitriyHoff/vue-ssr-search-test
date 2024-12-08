<script setup lang="ts">

import axios, { type AxiosInstance } from 'axios';
import SearchResult from './SearchResult.vue';
import { useTemplateRef } from 'vue';
import { useSearchStore } from '@/stores/search';
import { storeToRefs } from 'pinia';

/** URL, на который будут отправляться запросы */
const SEARCH_API_URL: string = import.meta.env.VITE_SEARCH_API_URL;

/** Задержка для отправки запроса после нажатия кнопки */
const KEYUP_TIMEOUT = 200;

const searchStore = useSearchStore()
const { searchResults } = storeToRefs(searchStore)

const instanceAxios: AxiosInstance = axios.create({
    baseURL: SEARCH_API_URL,
    timeout: 10_000,
    headers: {
        // 'Access-Control-Allow-Origin': '*',
    }
});

/** Идентификатор таймера, который должен выполнить поисковый запрос */
let timeout: NodeJS.Timeout

/** Ссылка на тектовое поля */
const inputQuery = useTemplateRef('inputQuery')

/** Формат данных, кторые должен вернуть сервер */
enum OutputFormat {
    XML = 'xml',
    JSON = 'json',
    JSONv2 = 'jsonv2',
    GeoJSON = 'geojson',
    GeoCodeJSON = 'geocodejson',
}

/**
 * Выполняет поисковый запрос и возвращает полученные результаты
 * @param query Строка поискового запроса
 * @param format Формат возвращаемых данных
 */
async function search(query: string, format: OutputFormat = OutputFormat.JSON) {
    const { data } = await instanceAxios.get('search', { params: { q: query, format, 'accept-language': 'ru' } });
    return data;
}

/** Обработчик сбытия `onKeyUp` */
async function onKeyUpHadler() {
    // если предыдущий таймаут ещё не выполнился ...
    clearTimeout(timeout)

    // сохраняем `id` таймера и устанавливаем новый таймаут,
    // который выполнит поисковый запрос
    timeout = setTimeout(async () => {
        const query = inputQuery.value?.value;
        if (query) {
            searchResults.value = await search(inputQuery.value?.value)
        }
    }, KEYUP_TIMEOUT)
}


</script>

<template>
    <div class="search">
        <div class="search__input">
            <label for="query" class="search-box__label">Найти:</label>
            <input ref="inputQuery" id="query" class="search-input__input" type="text" @keyup="onKeyUpHadler">
        </div>

        <ul class="search-results">
            <li v-for="result in searchResults" class="search-results__item" :key="result.osm_id">
                <SearchResult :result-object="result" @click="() => searchStore.setAsSelected(result)" />
            </li>
        </ul>
    </div>
</template>

<style lang="scss" scoped>
.search {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    width: 100%;

    &__input {
        display: flex;
        flex-direction: column;
        background-color: aquamarine;
    }
}

.search-results {
    list-style: none;
    padding: 0;
    margin: 0;

    &__item {
        border-radius: 0.5rem;
        border: 1px solid var(--color-border);
        overflow: hidden;
    }

    &__item:not(:last-child) {
        margin-bottom: 0.5rem;
    }

    &__item:hover {
        @media (hover: hover) {
            a:hover {
                cursor: pointer;
                background-color: hsla(160, 100%, 37%, 0.2);
            }
        }
    }
}
</style>
