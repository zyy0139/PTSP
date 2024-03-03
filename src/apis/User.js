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

export function updateByUserId(){
    return request({
        url:'/zyy/user/updateByUserId',
        method:'POST'
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