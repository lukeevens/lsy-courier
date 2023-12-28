import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios';

import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
Vue.prototype.$axios=axios
Vue.prototype.$httpUrl='http://localhost:8090'

Vue.config.productionTip = false

Vue.use(ElementUI);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
