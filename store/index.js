import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

// 购物车
import cart from './modules/cart.js'
// 地址管理
import path from './modules/path.js'
// 用户管理
import user from './modules/user.js'
//存储订单号
import order from './modules/order.js'
export default new Vuex.Store({
	state:{
		collect:[]
	},
	mutations:{
		// 进收藏
		collects(state,step){
		      // 传值进入
		     state.collect.push(step)
		},
	},
	modules:{
		cart,
		path,
		user,
		order
	}
})