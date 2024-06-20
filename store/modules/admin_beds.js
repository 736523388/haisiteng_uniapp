export default {
	namespaced: true,
	state: () => ({
		current_beds: {}
	}),
	mutations: {
		choose_beds(state, {
			beds
		}) {
			state.current_beds = beds
		},
		clean_beds(state){
			state.current_beds = {}
		}
	}
}