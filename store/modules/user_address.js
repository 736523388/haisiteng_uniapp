export default {
	namespaced: true,
	state: () => ({
		address_list: [],
		address_active_id: 0
	}),
	getters: {
		address_current(state) {
			if (state.address_active_id === 0) {
				let index = state.address_list.findIndex((value, index) => {
					return value.is_default === 1
				})
				return state.address_list[index] || {}

			} else {
				let index = state.address_list.findIndex((value, index) => {
					return value.id === state.address_active_id
				})
				return state.address_list[index] || {}
			}
		},
		address_current_id(state) {
			if (state.address_active_id === 0) {
				let index = state.address_list.findIndex((value, index) => {
					return value.is_default === 1
				})
				if (index > -1) {
					return state.address_list[index].id
				}
				return 0
			}
			return state.address_active_id
		}
	},
	mutations: {
		update_user_address_list(state, {
			address_list
		}) {
			state.address_list = address_list
			if (state.address_active_id > 0) {
				let index = state.address_list.findIndex((value, index) => {
					return value.id === state.address_active_id
				})
				if (index === -1) {
					state.address_active_id = 0
				}
			}

		},
		update_user_address_active(state, {
			id
		}) {
			state.address_active_id = id
		},
	}
}