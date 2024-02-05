import{createRouter,createMemoryHistory} from 'vue-router'
export const constantRoutes=[
    {
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        name: 'login',
        component: () => import('@/views/login/index'),
        meta: { tokenUse: false }
    },
    {
        path: '/register',
        name: 'register',
        component: () =>import('@/views/register/index'),
        meta: {tokenUse: false, title: '欢迎注册大学生兼职管理平台账号'}
    }
]