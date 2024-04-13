import { defineStore } from 'pinia'

export const useRouterStore = defineStore('router', {
    state: () => ({
        routerName: '',
        isLoadAsyncRouter: false
    })
})