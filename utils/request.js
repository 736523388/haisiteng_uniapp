import store from '@/store/index.js'; //需要引入store
import Request from 'luch-request'
const BASE_URL = 'https://hst.dev.cqclxsc.com'
// const BASE_URL = 'http://127.0.0.1:8000'
// 是否正在刷新状态
let isRefreshing = false
// 重试队列，每一项将是一个待执行的函数形式
let requests = []

const isLogin = (cb) => {
	if(!store.getters['user/is_login']){
		uni.navigateTo({
			url: '/pages/login/login'
		})
	} else {
		cb && cb()
	}
}

function getToken(code) {
	var data = {
		code,
		pid: uni.getStorageSync('pid')
	};
	return instance.post('/api/v1/login', data)
	// return uni.request({
	// 	url: 'http://127.0.0.1:8000/api/v1/login',
	// 	method: 'POST',
	// 	data: {
	// 		code,
	// 		pid: uni.getStorageSync('pid')
	// 	}
	// })
}

function login() {
	return uni.login({
		provider: 'weixin',
		scopes: "auth_base"
	}).then(res => {
		console.log('uni.login success', res)
		return getToken(res.code)
	}).catch((err) => {
		console.log(err)
		return Promise.reject(err);
	})
}

function setStorage(key, val, time) {
	uni.setStorageSync(key, val)
	var seconds = parseInt(time);
	if (seconds > 0) {
		var timestamp = Date.parse(new Date());
		timestamp = timestamp / 1000 + seconds;
		uni.setStorageSync(key + 'dtime', timestamp + "")
	} else {
		uni.removeStorageSync(key + 'dtime')
	}
}

function getStorage(key, def) {
	var deadtime = parseInt(uni.getStorageSync(key + 'dtime'))
	if (deadtime) {
		if (parseInt(deadtime) < Date.parse(new Date()) / 1000) {
			if (def) {
				return def;
			} else {
				return;
			}
		}
	}

	var res = uni.getStorageSync(key);
	if (res) {
		return res;
	} else {
		return def;
	}
}


// 创建实例 设置baseURL
const instance = new Request({
	baseURL: BASE_URL,
	header: {
		'Content-Type': "application/x-www-form-urlencoded"
	},
	dataType: 'json',
});
// 添加一个请求拦截器
instance.interceptors.request.use((config) => {
	config.header = {
		...config.header,
		token: store.state.user.token
	}
	return config
}, error => {
	// Do something with request error
	return Promise.reject(error)
});

// 添加一个响应拦截器
instance.interceptors.response.use((response) => {
	console.log('拦截到响应数据：', response.data)
	let {
		code
	} = response.data
	if(code === 401){
		store.dispatch('user/abnormal_logout')
		// return new Promise(() => {})
	}
	// switch (code) {
	// 	case 401:
	// 	break;
	// 		console.log('登录失效，开始重新进行登录')
	// 		let config = response.config
	// 		if (!isRefreshing) {
	// 			isRefreshing = true
	// 			return login().then(res => {
	// 				console.log('login success', res)
	// 				store.commit('user/update_user', res.data)
	// 				// 已经刷新了token，将所有队列中的请求进行重试
	// 				requests.forEach(cb => cb())
	// 				requests = []
	// 				return instance.request(config)
	// 			}).finally(() => {
	// 				isRefreshing = false
	// 			})
	// 		} else {
	// 			return new Promise((resolve) => {
	// 				requests.push(() => {
	// 					resolve(instance.request(config))
	// 				})
	// 			})
	// 		}
	// 		break;
	// }
	return response.data;
}, (response) => {
	// Do something with response error
	console.log(response)
	return Promise.reject(response)
});
export {
	instance as axios,
	BASE_URL as base_url,
	isLogin as checkLogin
}