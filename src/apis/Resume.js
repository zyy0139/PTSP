import request from '@/utils/axios.js'

export function addResume(data){
    return request({
        url:'/zyy/resume/addResume',
        method:'POST',
        data
    })
}

export function updateResume(data){
    return request({
        url:'/zyy/resume/updateResume',
        method:'POST',
        data
    })
}

export function getResumeList(params){
    return request({
        url:'/zyy/resume/getResumeList',
        method:'GET',
        params
    })
}

export function getResume(){
    return request({
        url:'/zyy/resume/getResume',
        method:'GET'
    })
}