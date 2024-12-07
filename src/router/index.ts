import { createMemoryHistory, createRouter as _createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AboutView from '../views/AboutView.vue'
import SearchVue from '../views/SearchView.vue'
import type { Router } from 'vue-router'

const isServer = typeof window === 'undefined'
const history = isServer
    ? createMemoryHistory(import.meta.env.BASE_URL)
    : createWebHistory(import.meta.env.BASE_URL)

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/about',
        name: 'about',
        component: AboutView,
    },
    {
        path: '/search',
        name: 'search',
        component: SearchVue,
    },
]

const routerOptions = {
    history: history,
    routes,
}

export function createRouter(): Router {
    return _createRouter(routerOptions)
}
