export default {
	namespaced: true,
	state: () => ({
		app_name: "海丝腾",
		app_logo: "https://hst-default.oss-cn-chengdu.aliyuncs.com/static/app_logo.png",
		app_version: "v1",
		bed_service_price: "0.00",
		beds_type_list: [],
		page_decoration: [],
		site_copy: "©版权所有 2019-2024 forska",
		index_banner: [],
	}),
	mutations: {
		update_banner(state, {
			banner
		}) {
			state.index_banner = banner
		},
		update_common(state, data) {
			state.app_logo = data.app_logo;
			state.app_name = data.app_name;
			state.app_version = data.app_version;
			state.bed_service_price = data.bed_service_price;
			state.page_decoration = data.page_decoration;
			state.site_copy = data.site_copy
			state.beds_type_list = data.beds_type_list
		}
	}
}