import request from '@/utils/axios.js'

export function companyRegister(date){
    return request({
        url:'/zyy/company/register',
        method:'POST',
        data
    })
}

export function companyAccountLogin(data){
    return request({
        url:'/zyy/company/accountLogin',
        method:'POST',
        data
    })
}

export function companyEmailLogin(data){
    return request({
        url:'/zyy/company/emailLogin',
        method:'POST',
        data
    })
}

export function getCompanyMessage(){
    return request({
        url:'/zyy/company/getCompanyMessage',
        method:'GET'
    })
}

export function updateByCompanyId(data){
    return request({
        url:'/zyy/company/updateByCompanyId',
        method:'POST',
        data
    })
}