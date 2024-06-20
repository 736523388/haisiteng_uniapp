import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)
import user from './modules/user.js'
import global from './modules/global.js'
import goods_cart from './modules/goods_cart.js'
import user_address from './modules/user_address.js'
import admin_beds from './modules/admin_beds.js'
import store_user_address from './modules/store_user_address.js'
import createPersistedState from 'vuex-persistedstate';
const store = new Vuex.Store({
	strict: true,
	modules: {
		global: global,
		user: user,
		goods_cart,
		user_address,
		admin_beds,
		store_user_address
	},
	plugins: [createPersistedState({
		storage: {
			getItem: (key) => uni.getStorageSync(key),
			setItem: (key, value) => uni.setStorageSync(key, value),
			removeItem: (key) => uni.removeStorageSync(key)
		}
	})]
})
export default store