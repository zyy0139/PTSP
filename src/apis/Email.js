import request from '@/utils/axios.js'

export function getEmailCode(data){
    return request({
        url:'/zyy/email/getEmailCode',
        method:'POST',
        data
    })
}