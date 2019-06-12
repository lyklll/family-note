import Vue from 'vue'
import App from './App'
wx.cloud.init({env: 'lkylll-blog'})
Vue.config.productionTip = false
//vuex
import store from './common/store'
Vue.prototype.$store = store
App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()
