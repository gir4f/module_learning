import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/modules/ModuleList.vue')
    },
    {
        path: '/module/:slug',
        component: () => import('@/modules/ModuleDetail.vue')
    },
    {
        path: '/produk',
        component: () => import('@/modules/ProductCrud.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router
