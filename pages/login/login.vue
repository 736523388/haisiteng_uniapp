<template>
	<view>
		<!-- #ifdef MP-WEIXIN -->
		<block v-if="show_d === false">
			<view class="login-logo-box">
				<u-image shape="circle" mode="aspectFit" :src="app_logo" height="200px" width="200px"></u-image>
			</view>
			<view class="login-btn-box">

				<view class="margin-top">
					<block v-if="!agree">
						<button @click="showAgreeToast" type="default" class="login-btn"
							style="color:#ffffff;background-color:#000030;border-color:#000030">快捷登录</button>
					</block>
					<block v-else>
						<button type="default" class="login-btn" open-type="getPhoneNumber"
							@getphonenumber="getPhoneNumber"
							style="color:#ffffff;background-color:#000030;border-color:#000030">快捷登录</button>
					</block>
				</view>
				<view class="margin-top">
					<button icon="phone-fill" class="login-btn" @click="showDynamic" type="default">手机验证码登录</button>
				</view>
			</view>
			<view style="font-size: 24rpx;text-align: center;margin: 20rpx auto;width: 580rpx;">
				<switch style="transform: scale(0.6,0.6);height: 36rpx;width: 36rpx;" type="checkbox" :checked="agree"
					@change="switch2Change" /><text style="margin-left: 6rpx;">打勾表示您已阅读并同意以下协议</text>
				<navigator style="display: inline-block;color: #1989fa;"
					url="/pages/agreement/agreement?name=user_agreement" hover-class="navigator-hover">
					《用户服务协议》</navigator>、<navigator style="display: inline-block;color: #1989fa;"
					url="/pages/agreement/agreement?name=privacy_statement" hover-class="navigator-hover">
					《隐私政策》</navigator>
			</view>
		</block>
		<block v-else>
			<view style="width: 650rpx;margin: 0 auto;">
				<view class="padding-left-sm margin-top-xxl text-xxl text-bold margin-tb-xl">手机快捷登录</view>
				<u-input v-model="phone" custom-style="margin-top: 30rpx;" placeholder="请输入手机号"
					placeholder-style="color:#808080;" border="surround">
					<template slot="suffix">
						<u-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
						<u-button @click="sendSmsCode" :text="tips" type="primary" size="small"></u-button>
					</template>
				</u-input>
				<u-input v-model="sms_code" custom-style="margin-top: 30rpx;" placeholder="请输入验证码"
					placeholder-style="color:#808080;" border="surround"></u-input>
				<view style="width: 650rpx;margin: 0 auto;margin-top: 30rpx;">
					<u-button type="primary" @click="dynamicLogin" custom-class="login-btn" size="large">登录</u-button>
				</view>
			</view>
		</block>
		<!-- #endif -->
		<!-- #ifndef MP-WEIXIN -->
		<view class="container">
			<view class="padding-left margin-top-xxl text-xxl text-bold margin-tb-xl">手机快捷登录</view>
			<u-input style="margin-top: 30rpx;" placeholder="请输入手机号" border="surround" v-model="phone">
				<template slot="suffix">
					<u-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
					<button @click="sendSmsCode" type="default" size="mini"
						style="color:#ffffff;background-color:#000030;border-color:#000030">{{tips}}</button>
				</template>
			</u-input>
			<u-input style="margin-top: 30rpx;" placeholder="请输入验证码" border="surround" v-model="sms_code"></u-input>

			<view class="margin-top" style="width: 650rpx;margin: 0 auto;">
				<button v-if="!agree" @click="showAgreeToast" type="default" class="login-btn"
					style="color:#ffffff;background-color:#000030;border-color:#000030">登录</button>
				<button v-else @click="dynamicLogin" type="default" class="login-btn"
					style="color:#ffffff;background-color:#000030;border-color:#000030">登录</button>
			</view>
			<view class="text-center" style="font-size: 24rpx;margin: 20rpx auto;width: 630rpx;">
				<switch style="transform: scale(0.6,0.6);height: 36rpx;width: 36rpx;" type="checkbox" :checked="agree"
					@change="switch2Change" /><text style="margin-left: 6rpx;">打勾表示您已阅读并同意以下协议</text>
				<navigator style="display: inline-block;color: #1989fa;"
					url="/pages/agreement/agreement?name=user_agreement" hover-class="navigator-hover">
					《用户服务协议》</navigator>、<navigator style="display: inline-block;color: #1989fa;"
					url="/pages/agreement/agreement?name=privacy_statement" hover-class="navigator-hover">
					《隐私政策》</navigator>
			</view>
		</view>
		<!-- #endif -->
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				agree: false,
				show_d: false, //显示手机验证码
				phone: '',
				sms_code: '',
				sms_txt: '发送验证码',
				sms_disabled: false,
				MoMsgWait: 60,
				sending: false,
				tips: '',
				temp_token: ''
			};
		},
		computed: {
			...mapState({
				app_logo: state => state.global.app_logo,
			}),
		},
		methods: {
			showAgreeToast() {
				uni.$u.toast('请勾选协议');
			},
			change(e) {
				console.log('change', e);
			},
			codeChange(text) {
				this.tips = text;
			},
			showDynamic() {
				if (!this.agree) {
					this.showAgreeToast()
					return
				}
				this.show_d = true
			},
			switch2Change(event) {
				this.agree = event.detail.value
			},
			sendSmsCode() {
				if (this.$refs.uCode.canGetCode) {
					if (!this.phone) {
						uni.$u.toast('请输入手机号');
						return
					}
					let regExp = /^1[3456789]\d{9}$/;
					if (!regExp.test(this.phone)) {
						uni.$u.toast('手机号不正确');
						return
					}
					uni.showLoading({
						title: '正在获取验证码'
					})
					// 发送验证码短信
					axios.post("/api/v1/sms_code", {
						phone: this.phone
					}).then(res => {
						uni.hideLoading();
						if (res.code === 1) {
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}
					}).catch(err => {
						uni.hideLoading();
						uni.$u.toast('出错了，请稍后再试');
					})
				}
				return
				if (this.sms_disabled || this.sending) {
					return
				}
				console.log(this.phone)
				if (!this.phone) {
					uni.showToast({
						title: '请输入手机号',
						icon: 'none'
					})
					return
				}
				let regExp = /^1[3456789]\d{9}$/;
				if (!regExp.test(this.phone)) {
					uni.showToast({
						title: '手机号不正确',
						icon: 'none'
					})
					return
				}
				this.sending = true
				uni.showLoading({
					title: '加载中~',
					mask: true,
				})
				// 发送验证码短信
				axios.post("/api/v1/sms_code", {
					phone: this.phone
				}).then(res => {
					if (res.code === 1) {
						this.sendSbinms()
					}
				}).catch(err => {
					uni.showToast({
						title: '出错了，请稍后再试',
						icon: 'none'
					})
				}).finally(() => {
					this.sending = false
					uni.hideLoading()
				})
			},
			// 60秒后验证码
			sendSbinms() {
				uni.$u.toast('验证码已发送');
				this.sms_txt = this.MoMsgWait + "  s"
				this.MoMsgWait = this.MoMsgWait - 1
				this.sms_disabled = true
				let inter = setInterval(function() {
					this.sms_txt = this.MoMsgWait + "  s"
					this.MoMsgWait = this.MoMsgWait - 1
					this.sms_disabled = true
					if (this.MoMsgWait < 0) {
						clearInterval(inter)
						this.sms_txt = "重新获取"
						this.MoMsgWait = 60
						this.sms_disabled = false
					}
					//注意后面的bind绑定，最关键。不然又是未定义，无法使用外围的变量;
				}.bind(this), 1000);
			},
			dynamicLogin() {
				if (this.tips == "获取验证码") {
					uni.$u.toast('请先获取验证码');
					return
				}
				if (!this.phone) {
					uni.$u.toast('请输入手机号');
					return
				}
				let regExp = /^1[3456789]\d{9}$/;
				if (!regExp.test(this.phone)) {
					uni.$u.toast('手机号不正确');
					return
				}
				if (!this.sms_code) {
					uni.$u.toast('请输入验证码');
					return
				}
				uni.showLoading({
					title: '登陆中'
				})
				axios.post("/api/v2/login", {
					phone: this.phone,
					code: this.sms_code,
					pid: uni.getStorageSync('pid'),
					openid: uni.getStorageSync('openid'),
					unionid: uni.getStorageSync('unionid'),
				}).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						this.$store.commit("user/update_user", res.data)
						axios.get('/api/v1/user/goods/cart_num').then(ref => {
							if (ref.code === 1) {
								this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
									number: ref.data
								})
							}
						}).catch(err => {
							console.log(err)
						})
						uni.showToast({
							title: '登陆成功',
							icon: 'success',
							duration: 1400
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						uni.$u.toast(res.info);
					}
				}).catch(err => {
					uni.hideLoading()
					uni.$u.toast('网络错误，请稍后再试！');
				})
			},
			getPhoneNumber(e) {
				console.log(e)
				if (!e.detail.code) {
					uni.$u.toast('授权失败');
					return
				}
				uni.showLoading({
					title: '登陆中'
				})
				axios.post('/api/v2/wx_login', {
					code: e.detail.code,
					pid: uni.getStorageSync('pid'),
					openid: uni.getStorageSync('openid'),
					unionid: uni.getStorageSync('unionid'),
				}).then(res => {
					uni.hideLoading()
					if (res.code == 1) {
						this.$store.commit("user/update_user", res.data)
						axios.get('/api/v1/user/goods/cart_num').then(ref => {
							if (ref.code === 1) {
								this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
									number: ref.data
								})
							}
						}).catch(err => {
							console.log(err)
						})
						uni.showToast({
							title: '登陆成功',
							icon: 'success',
							duration: 1400
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					} else {
						setTimeout(() => {
							uni.$u.toast(res.info);
						}, 300)
					}
				}).catch(err => {
					uni.hideLoading()
					setTimeout(() => {
						uni.$u.toast('网络错误，请稍后再试！');
					}, 300)
				})
			}
		},
		onLoad() {
			console.log('login.vue onLoad')
			// #ifdef MP-WEIXIN
			uni.login({
				success: res => {
					if(res.code){
						axios.post('/api/v2/wx_pre_login', {code: res.code}).then(ref => {
							if(ref.code === 1){
								uni.setStorageSync("openid", ref.data.openid)
								uni.setStorageSync("unionid", ref.data.unionid || "")
							}
						}).catch(error => {})
					}
				}
			})
			// #endif
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background: #fff;
		position: absolute;
		left: 0;
		right: 0;
		bottom: 0;
		top: 0;
	}

	.login-logo-box {
		width: 200px;
		height: 200px;
		margin: 0 auto;
		margin-top: 240rpx;
	}

	.login-btn-box {
		width: 580rpx;
		margin: 0 auto;
	}

	.login-btn {
		border-radius: 12rpx !important;
		margin-top: 20rpx;
	}

	.color-00 {
		color: $u-main-color !important;
	}
</style>