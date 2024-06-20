<template>
	<view class="container">
		<view class="padding-left margin-top-xxl text-xxl text-bold margin-tb-xl">修改手机号</view>
		<u-input style="margin-top: 30rpx;" placeholder="请输入新手机号" border="surround" v-model="phone">
			<template slot="suffix">
				<u-code ref="uCode" @change="codeChange" seconds="60" changeText="X秒重新获取"></u-code>
				<u-button @click="sendSmsCode" :text="tips" type="primary" size="small"></u-button>
			</template>
		</u-input>
		<u-input style="margin-top: 30rpx;" placeholder="请输入验证码" border="surround" v-model="sms_code"></u-input>
		<view style="width: 650rpx;margin: 0 auto;margin-top: 30rpx;">
			<u-button type="primary" @click="editMobile" custom-class="login-btn" size="large">确认修改</u-button>
		</view>
	</view>
</template>

<script>
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
				is_weapp: false,
			};
		},
		methods: {
			codeChange(text) {
				this.tips = text;
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
						if (res.code === 1) {
							uni.hideLoading();
							// 这里此提示会被this.start()方法中的提示覆盖
							uni.$u.toast('验证码已发送');
							// 通知验证码组件内部开始倒计时
							this.$refs.uCode.start();
						}
					}).catch(err => {
						uni.$u.toast('出错了，请稍后再试');
					}).finally(() => {
						uni.hideLoading();
					})
				}
			},
			editMobile() {
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
					title: '请稍后~'
				})
				axios.post("/api/v1/edit_mobile", {
					phone: this.phone,
					code: this.sms_code,
				}).then(res => {
					if (res.code == 1) {
						uni.showToast({
							title: '操作成功',
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
					uni.$u.toast('网络错误，请稍后再试！');
				}).finally(() => {
					wx.hideLoading()
				})
			}
		}
	}
</script>

<style lang="scss">

</style>