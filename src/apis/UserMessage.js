import request from "@/utils/axios.js"

export function getUserMessageList(){
    return request({
        url: '/zyy/userMessage/getUserMessageList',
        method: 'get'
    })
}

export function deleteByMessageId(params){
    return request({
        url: '/zyy/userMessage/deleteByMessageId',
        method: 'delete',
        params
    })
}

export function deleteReadMessage(){
    return request({
        url: '/zyy/userMessage/deleteReadMessage',
        method: 'delete'
    })
}

export function updateIsRead(params){
    return request({
        url: '/zyy/userMessage/updateIsRead',
        method: 'POST',
        params
    })
}