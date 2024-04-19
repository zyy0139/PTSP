import request from "@/utils/axios.js"

export function addDelivery(params){
    return request({
        url:'/zyy/delivery/addDelivery',
        method:'POST',
        params
    })
}

export function passDelivery(params){
    return request({
        url:'/zyy/delivery/passDelivery',
        method:'DELETE',
        params
    })
}

export function admitDelivery(params){
    return request({
        url:'/zyy/delivery/admitDelivery',
        method:'DELETE',
        params
    })
}

export function getCountByDate(params){
    return request({
        url:'/zyy/delivery/getCountByDate',
        method:'GET',
        params
    })
}

export function getCountByType(){
    return request({
        url:'/zyy/delivery/getCountByType',
        method:'GET'
    })
}