import {createRouter, createWebHistory} from 'vue-router'
export const constantRoutes=[
    {
        path: '/',
        redirect: '/register'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index.vue'),
        meta: { tokenUse: false }
    },
    {
        path: '/register',
        name: 'register',
        component: () =>import('@/views/register/index.vue'),
        meta: {tokenUse: false, title: '欢迎注册大学生兼职管理平台账号'}
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/components/404.vue'),
        meta: { isSidebar: false, tokenUse: false }
    }
]

const creatRouterOption={
    history:createWebHistory(),
    routes:constantRoutes,
    scrollBehavior:() =>({
        top:0,
        behavior:'smooth'
    })
}


const router=createRouter(creatRouterOption)
export default router