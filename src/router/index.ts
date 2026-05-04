import { createRouter, createWebHistory } from 'vue-router'

const routes = [
    {
        path: '/',
        component: () => import('@/modules/ModuleList.vue')
    },
    {
        path: '/module/:slug',
        component: () => import('@/modules/ModuleDetail.vue')
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router