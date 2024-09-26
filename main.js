import App from './App'

// #ifndef VUE3
import Vue from 'vue'

import './uni.promisify.adaptor'
import store from './store'
Vue.config.productionTip = false
// 定义全局方法
Vue.prototype.$globalJump2View = (path, needLogin = false) => {
  console.log('router:',path)
  if(!needLogin || store.getters['user/is_login']) {
  	uni.navigateTo({
  		url: path,
  	})
  } else {
  	uni.navigateTo({
  		url: '/pages/login/login',
  	})
  }
};
App.mpType = 'app'

// 引入全局uView
import uView from '@/uni_modules/uview-ui'
Vue.use(uView)
import dragButton from './components/drag-button/drag-button.vue'
	Vue.component('drag-button',dragButton)
	
const app = new Vue({
  store,
  ...App
})
// 引入请求封装，将app参数传递到配置中
// require('@/config/request.js')(app)

app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif