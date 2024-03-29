import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import ElementPlus from 'element-plus'
import {createPinia} from 'pinia'

const app=createApp(App)

for (const [key,component] of Object.entries(ElementPlusIconsVue)){
    app.component(key,component)
}

app.use(ElementPlus,{
    locale: zhCn
})

app.use(router)
app.use(createPinia())
app.mount('#app')