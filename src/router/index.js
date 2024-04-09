import {createRouter, createWebHistory} from 'vue-router'
import {userStores} from '@/store/user'
export const constantRoutes=[
    {
        path: '/',
        redirect: '/login'
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
        path: '/resetPassword',
        name:'resetPassword',
        component: () => import('@/views/resetPassword/index.vue'),
        meta: { tokenUse: false, title: '修改密码' }
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/components/404.vue'),
        meta: { isSidebar: false, tokenUse: false }
    },
    {
        path:'/user',
        name:'user',
        component: () => import('@/layout/userNavigation.vue'),
        redirect: '/user/home',
        meta:{ isSidebar: false, tokenUse: false},
        children:[
            {
                path: 'home',
                name: 'userHome',
                component: () => import('@/views/home/userHome/index.vue'),
                meta: { title: '用户主页' }
            },
            {
                path: 'changePassword',
                name: 'changePassword',
                component: () => import('@/views/resetPassword/resetPasswordHome/index.vue'),
                meta: { title: '修改密码' }
            },
            {
                path: 'message',
                name: 'userMessage',
                component: () => import('@/views/message/user/index.vue'),
                meta: { title: '个人信息' }
            },
            {
                path: 'resume',
                name: 'userResume',
                component: () => import('@/views/resume/index.vue'),
                meta: { title: '简历信息' }
            },
            {
                path: 'recruitList',
                name: 'recruitList',
                component: () => import('@/views/recruitList/index.vue'),
                meta: { title: '招聘信息列表' }
            }
        ]
    }
]

// export const asyncRouters=[
//     {
//         path: '/userHome',
//         name: 'userHome',
//         recruitTable: () => import('@/views/home/userHome/index.vue'),
//         children: [
//             {
//                 path: '/changePassword',
//                 name: 'changePassword',
//                 recruitTable: () => import('@/views/resetPassword/resetPasswordHome/index.vue'),
//                 meta: { title: '修改密码' }
//             }
//         ]
//     }
// ]

const creatRouterOption={
    history: createWebHistory(),
    routes:constantRoutes,
    scrollBehavior:() =>({
        top:0,
        behavior:'smooth'
    })
}

const  router=createRouter(creatRouterOption)

export function asyncAddRouter(){
    const routerStore = userStores()
    routerStore.isLoadAsyncRouter = true
    router.removeRoute('404')
    // asyncRouters.forEach(item => {
    //     router.addRoute(item)
    // })
}

// export function resetRouter() {
//     asyncRouters.forEach(item => {
//         if (item.name !== '404') {
//             router.removeRoute(item.name)
//         }
//     })
// }


export default router