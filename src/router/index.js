import {createRouter, createWebHistory} from 'vue-router'
import { userStores } from '@/store/user'
import { useRouterStore } from "@/store/router"
import { ElMessage } from 'element-plus'

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
    }
]

export const asyncRouters=[
    {
        path:'/user',
        name:'user',
        component: () => import('@/layout/userNavigation.vue'),
        redirect: '/user/home',
        meta:{ isSidebar: false, tokenUse: true},
        children:[
            {
                path: 'home',
                name: 'userHome',
                component: () => import('@/views/home/userHome/index.vue'),
                meta: { title: '用户主页', isSidebar: false, tokenUse: true }
            },
            {
                path: 'changePassword',
                name: 'changePassword',
                component: () => import('@/views/resetPassword/resetPasswordHome/index.vue'),
                meta: { title: '修改密码', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'message',
                name: 'userMessage',
                component: () => import('@/views/message/user/index.vue'),
                meta: { title: '个人信息', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'resume',
                name: 'userResume',
                component: () => import('@/views/resume/index.vue'),
                meta: { title: '简历信息', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'companyList',
                name: 'companyList',
                component: () => import('@/views/companyList/index.vue'),
                meta: { title: '公司信息列表', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'recruitList',
                name: 'recruitList',
                component: () => import('@/views/recruitList/index.vue'),
                meta: { title: '招聘信息列表', isSidebar: false, tokenUse: true  }
            }
        ]
    },
    {
        path:'/company',
        name:'company',
        component: () => import('@/layout/companyNavigation.vue'),
        redirect: '/company/home',
        meta:{ isSidebar: false, tokenUse: true},
        children:[
            {
                path: 'home',
                name: 'companyHome',
                component: () => import('@/views/home/companyHome/index.vue'),
                meta: { title: '公司主页', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'changePassword',
                name: 'changePassword',
                component: () => import('@/views/resetPassword/resetPasswordHome/index.vue'),
                meta: { title: '修改密码', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'message',
                name: 'companyMessage',
                component: () => import('@/views/message/company/index.vue'),
                meta: { title: '公司信息', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'recruitManage',
                name: 'recruitManage',
                component: () => import('@/views/recruitManage/index.vue'),
                meta: { title: '招聘管理', isSidebar: false, tokenUse: true  }
            },
            {
                path: 'resumeManage',
                name: 'resumeManage',
                component: () => import('@/views/resumeManage/index.vue'),
                meta: { title: '简历管理', isSidebar: false, tokenUse: true  }
            }
        ]
    },
    {
        path: '/:pathMatch(.*)*',
        name: '404',
        component: () => import('@/components/404.vue'),
        meta: { isSidebar: false, tokenUse: false }
    }
]

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
    const routerStore = useRouterStore()
    routerStore.isLoadAsyncRouter = true
    router.removeRoute('404')
    asyncRouters.forEach(item => {
        router.addRoute(item)
    })
}

export function resetRouter() {
    asyncRouters.forEach(item => {
        if (item.name !== '404') {
            router.removeRoute(item.name)
        }
    })
}

router.beforeEach((to, from, next) => {
    const useStore = userStores()
    const userStore = useRouterStore()
    if(userStore.isLoadAsyncRouter) {
        //已经加载了动态路由
        userStore.routerName = to.redirectedFrom ? to.meta.redirectedFrom : to.name
        //判断是否需要登录
        if (to.meta.tokenUse && useStore.userToken === '') {
            ElMessage({
                type: 'error',
                message: '登录过期，请重新登录'
            })
            next({ name: 'login' })
        }else {
            //其他情况，如访问需要权限的页面且有令牌，或访问不需要权限的页面
            next()
        }
    }else {
        //  没有加载动态路由
        /*
            首先没有加载动态路由只有两种情况，一是没有登录，直接通过地址栏输入，访问其他页面，另一种是登录后刷新，且刷新位置一定是处于需要权限的页面，还有初次进入应用这种情况
            这种情况下又分几种情况
            正常跳转下，在不需要token的页面之间跳转，直接放行即可
         */
        if (useStore.userToken !== ''){
            //  如果token不为空，说明该用户一定登录过了，所以可以直接加载动态路由
            asyncAddRouter()
            next({ path: to.fullPath})
        }else {
            next()
        }
    }
})

export default router