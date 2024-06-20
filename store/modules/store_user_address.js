export default {
	namespaced: true,
	state: () => ({
		address_current: {}
	}),
	mutations: {
		choose_store_user_address(state, {
			address
		}) {
			state.address_current = {...address}
		},
		clean_store_user_address(state){
			state.address_current = {...{}}
		}
	}
}