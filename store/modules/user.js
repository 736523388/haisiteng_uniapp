export default {
	namespaced: true,
	state: () => ({
		token: "",
		token_exp: null,
		userinfo: null, //用户信息
		userinfo_backup: null,//用户信息备份，用于回滚
		manual_logout: false, //是否手动退出登录
	}),
	getters: {
		is_login(state) {
			if (state.token == "" || state.token_exp == null) {
				return false
			}
			const now_time = Date.now()
			return state.token_exp * 1000 > now_time
		}
	},
	mutations: {
		update_user(state, data) {
			state.userinfo = data
			state.token = data.token.token
			state.token_exp = data.token.expire
			//这里生成备份
			state.userinfo_backup = data
		},
		update_manual_logout(state) {
			state.manual_logout = true
		},
		update_user_sex(state, {
			base_sex
		}) {
			state.userinfo = Object.assign({}, state.userinfo, {
				base_sex
			})
		},
		update_user_nickname(state, {
			nickname
		}) {
			state.userinfo = Object.assign({}, state.userinfo, {
				nickname
			})
		},
		update_user_base_birthday(state, {
			base_birthday
		}) {
			state.userinfo = Object.assign({}, state.userinfo, {
				base_birthday
			})
		},
		update_user_headimg(state, {
			headimg
		}) {
			state.userinfo = Object.assign({}, state.userinfo, {
				headimg
			})
		},
		update_user_region(state, {
			region_province,
			region_city,
			region_area
		}) {
			state.userinfo = Object.assign({}, state.userinfo, {
				region_province,
				region_city,
				region_area
			})
		},
		logout(state) {
			state.token = ""
			state.token_exp = null
			state.userinfo = null
			state.userinfo_backup = null
		},
		rollback_userinfo(state){
			state.userinfo = Object.assign({}, state.userinfo, {
				region_province: state.userinfo_backup.region_province,
				region_city: state.userinfo_backup.region_city,
				region_area: state.userinfo_backup.region_area,
				nickname: state.userinfo_backup.nickname,
				base_sex: state.userinfo_backup.base_sex,
				base_birthday: state.userinfo_backup.base_birthday,
			})
		}
	},
	actions: {
		update_manual_logout_action(context) {
			context.commit('update_manual_logout')
			uni.showToast({
				title: '退出成功',
				duration: 600
			})
		},
		logout({commit,dispatch}) {
			commit('logout')
			dispatch('goods_cart/update_goods_cart_number_badge', {number: 0},{root: true})
			uni.showToast({
				title: '退出成功',
				duration: 600
			})
		},
		abnormal_logout(context) {
			context.commit('logout')
			dispatch('goods_cart/update_goods_cart_number_badge', {number: 0},{root: true})
		}
	}
}