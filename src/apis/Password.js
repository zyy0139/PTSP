import request from '@/utils/axios'

export function resetPassword(data) {
    return request({
        url: '/zyy/password/resetPassword',
        method: 'post',
        data
    })
}