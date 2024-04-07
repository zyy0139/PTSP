import axios from 'axios'
import { userStores } from '@/store/user'
import { ElMessage } from 'element-plus'
import router from '@/router'

const userStore=userStores()

const service=axios.create({
    baseURL:process.env.VUE_APP_API_BASE_URL,
    timeout:60000
})

//请求前拦截器
service.interceptors.request.use(config=>{
    config.headers.Authorization = `USER_TOKEN=${userStore.userToken}`
    if(config.url === '/zyy/user/emailLogin' || config.url === '/zyy/user/register' ||
        config.url === '/zyy/company/register' || config.url === '/zyy/company/emailLogin'){
        config.headers.emailKey = userStore.emailKey
    }
    return config
}, error => {
    return Promise.reject(error)
})

//响应后拦截器
service.interceptors.response.use( response => {
    if(response.headers.authorization){
        userStore.updateUserToken(response.headers.authorization.split('=')[1])
    }
    if(response.data.code === 403){
        ElMessage({
            type: 'error',
            message: '登录过期，请重新登录'
        })
        router.push('/login')
    }
    return response.data
}, error => {
    if (error.status === 500){
        ElMessage({
            type: 'error',
            message: '服务器内部错误'
        })
    }
    return Promise.reject(error)
})

export default service