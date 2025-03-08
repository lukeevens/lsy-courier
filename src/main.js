import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import axios from 'axios'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'

// 引入所有mock文件
import './mock/home'
import './mock/user'
import './mock/courier'
import './mock/order'
import './mock/deliverypoint'
import './mock/feedback'
import './mock/pickupcode'

// 创建事件总线
Vue.prototype.$bus = new Vue()

Vue.use(ElementUI)

Vue.prototype.$axios = axios
Vue.prototype.$httpUrl = 'http://localhost:8090'
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
