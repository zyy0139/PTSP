import request from '@/utils/axios.js'

export function sendRecruit(data){
    return request({
        url:'/zyy/recruit/senRecruit',
        method:'POST',
        data
    })
}

export function deleteRecruit(params){
    return request({
        url:'/zyy/recruit/deleteRecruit',
        method:'DELETE',
        params
    })
}

export function updateRecruit(data){
    return request({
        url:'/zyy/recruit/updateRecruit',
        method:'POST',
        data
    })
}

export function getMessage(params){
    return request({
        url:'/zyy/recruit/getMessage',
        method:'GET',
        params
    })
}

export function getMessageList(params){
    return request({
        url:'/zyy/recruit/getMessageList',
        method:'GET',
        params
    })
}

export function getMessageBySearch(params){
    return request({
        url: '/zyy/recruit/getMessageBySearch',
        method: 'GET',
        params
    })
}