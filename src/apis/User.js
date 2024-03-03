import request from '@/utils/axios'
export function register(data){
    return request({
        url:'/zyy/user/register',
        method:'POST',
        data
    })
}

export function emailLogin(data){
    return request({
        url:'/zyy/user/emailLogin',
        method:'POST',
        data
    })
}

export function accountLogin(data){
    return request({
        url:'/zyy/user/accountLogin',
        method:'POST',
        data
    })
}

export function updateByUserId(data){
    return request({
        url:'/zyy/user/updateByUserId',
        method:'POST',
        data
    })
}

export function getUserMessage(data){
    return request({
        url:'/zyy/user/getUserMessage',
        method:'GET',
        data
    })
}

export function getAdmit(data){
    return request({
        url:'/zyy/user/getAdmit',
        method:'GET',
        data
    })
}