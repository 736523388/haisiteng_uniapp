export default {
	namespaced: true,
	state: () => ({
		goods_cart_number: 0,
	}),
	getters: {
		goods_cart_number_string(state) {
			return state.goods_cart_number.toString()
		}
	},
	mutations: {
		update_goods_cart_number(state, {
			number
		}) {
			console.log('更新购物车商品数量：' + number)
			state.goods_cart_number = number
		}
	},
	actions: {
		update_goods_cart_number_badge(context, payload) {
			context.commit('update_goods_cart_number', {number: payload.number})
		}
	}
}