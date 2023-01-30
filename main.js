import App from './App'
import store from 'store/index.js'
Vue.prototype.$store = store

// 权限跳转
Vue.prototype.navigateTo = (options) =>{
	
	if(!store.state.user.loginStatus){
		uni.showToast({
			title:'请先登录',
			icon:'none'
		})
		return uni.navigateTo({
			url:"/pages/login/login"
		})
	}
	
	uni.redirectTo(options)
	
}



// #ifndef VUE3
import Vue from 'vue'
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App,
	store
})
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