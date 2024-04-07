import request from '@/utils/axios'
export function userRegister(data){
    return request({
        url:'/zyy/user/register',
        method:'POST',
        data
    })
}

export function userEmailLogin(data){
    return request({
        url:'/zyy/user/emailLogin',
        method:'POST',
        data
    })
}

export function userAccountLogin(data){
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

export function getUserMessage(){
    return request({
        url:'/zyy/user/getUserMessage',
        method:'GET'
    })
}

export function getAdmit(){
    return request({
        url:'/zyy/user/getAdmit',
        method:'GET'
    })
}

export function getName(){
    return request({
        url:'/zyy/user/getName',
        method:'GET'
    })
}

export function resetPassword(data){
    return request({
        url:'/zyy/user/updatePassword',
        method:'POST',
        data
    })
}