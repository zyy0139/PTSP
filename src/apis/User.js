import request from '@/utils/axios'
export function register(data){
    return request({
        url:'/zyy/user/register',
        method:'POST',
        data
    })
}

export function getEmailCode(data){
    return request({
        url:'/zyy/user/getEmailCode',
        method:'POST',
        data
    })
}