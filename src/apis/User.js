export function register(data){
    return request({
        url:'/zyy/user/register',
        method:'POST',
        data
    })
}

export function getEmailCode(data){
    return request({
        url:'/zyy/user/getEmailCode',
        methodP:'POST',
        data
    })
}