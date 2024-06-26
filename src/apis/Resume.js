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

export function getResumeListBySearch(params){
    return request({
        url:'/zyy/resume/getResumeListBySearch',
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

export function getResumeInfo(params){
    return request({
        url:'/zyy/resume/getResumeInfo',
        method:'GET',
        params
    })
}

export function getByTodayRecommend(){
    return request({
        url:'/zyy/resume/getByTodayRecommend',
        method:'GET'
    })
}