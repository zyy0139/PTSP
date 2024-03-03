import request from "@/utils/axios.js"

export function getType(){
    return request({
        url:'/zyy/workType/getType',
        method:'GET'
    })
}