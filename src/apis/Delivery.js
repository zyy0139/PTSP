import request from "@/utils/axios.js"

export function addDelivery(data){
    return request({
        url:'/zyy/delivery/addDelivery',
        method:'POST',
        data
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