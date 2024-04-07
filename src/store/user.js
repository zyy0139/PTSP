import {defineStore} from 'pinia'

export const userStores=defineStore('user',{
    state:()=>({
        name:'default_name',
        avatarUrl:'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png',
        token:'',
        emailKey:''
    }),
    getters:{
        userToken:(state)=>{
            if(state.token===''){
                state.token=localStorage.getItem('USER_TOKEN') ? localStorage.getItem('USER_TOKEN'): ''
            }
            return state.token
        }
    },
    actions:{
        updateUserToken(newToken=''){
            this.token=newToken
            localStorage.setItem('USER_TOKEN',newToken)
        },
        resetUserToken(){
            this.updateUserToken()
        }
    }
})