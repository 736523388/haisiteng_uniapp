<template>
	<view class="bg-white">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded" class="padding-bottom-xl">
			<view class="container padding-bottom" v-for="(item,index) in list" :key="index" style="position: relative;">
				<view v-if="index > 0" class="video-line"></view>
				<view class="text-bold padding-top padding-bottom coupon-title" style="letter-spacing: 0.1em;color: #191944;">{{item.title}}</view>
				<view style="border-radius: 8rpx;overflow: hidden;">
					<view style="font-size: 0;">
						<image v-if="item.cover" :src="item.cover" style="width: 690rpx;margin: 0;padding: 0;display: block;" mode="widthFix"></image>
					</view>
					
					<view class="flex justify-end padding padding-tb-sm" style="background-color: #191944;width: 100%;color: #fff;">
						<view class="flex-sub flex flex-direction justify-evenly align-start text-xs">
							<view class="bg-white" style="color: #191944;padding: 8rpx 16rpx;">使用规则</view>
							<text class="padding-top-sm" style="line-height: 1.6;">{{item.remark}}</text>
						</view>
						<view class="flex flex-direction justify-center padding-left-lg padding-right-xs align-center" style="border-left: 1px #989898 dashed;letter-spacing: 0.2em;">
							<!-- <view style="padding: 4rpx 10rpx 20rpx 10rpx;">{{ item.desc }}</view> -->
							<view v-if="item.receive_type == 2" style="padding: 4rpx 10rpx 20rpx 10rpx;">￥{{ item.price }}</view>
							<view class="bg-white text-bold" style="color: #191944;padding: 8rpx 16rpx;" @click="receive(item)">{{item.receive_type == '1' ? '立即领取': '立即购买'}}</view>
						</view>
					</view>
				</view>
				
				
				<!-- <view class="coupon" :style="'background-image: url('+coupon_background_image+');'">
					<view class="coupon-left">
						<view>{{item.title}}</view>
						<view class="text-xxs" style="margin-top: 10rpx;">有效期：{{item.expire_datetime}}</view>
						<view style="margin-top: 16rpx;height: 36rpx;margin-left: 6rpx;">
							<image src="/static/images/logo.svg" mode="heightFix" style="height: 100%;"></image>
						</view>
						<view class="text-xxs" style="margin-top: 10rpx;">·{{item.remark}}</view>
					</view>
					<view class="coupon-right">
						<view class="text-xl">{{ item.desc }}</view>
						<view class="margin-top margin-right">
							<u-button @click="receive(item.id)" type="primary" size="small" text="立即领取"></u-button>
						</view>
					</view>
				</view>
				<u-line margin="20rpx 0"></u-line> -->
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				loaded: false,
				list: [],
				coupon_background_image: "https://oss.myhastens.com/69ab59816e29a0164befa8ee8bcdad.jpg"
			};
		},
		onLoad() {
			axios.get('/api/v2/coupon?position=1').then(res => {
				if (res.code === 1) {
					this.list = res.data.list
					this.$nextTick(() => {
						this.loaded = true
					})
				}
			})
		},
		methods: {
			receive(item) {
				checkLogin(() => {
					let {id,receive_type} = item
					if(receive_type == 1) {
						uni.showLoading({
							mask: true,
							title: '请稍后..'
						})
						axios.get(`/api/v1/user/coupon/receive/${id}`).then(res => {
							uni.hideLoading()
							uni.showToast({
								title: res.info,
								icon: res.code === 1 ? 'success' : 'none',
								duration: 1200
							})
						}).catch(error => {
							console.log(error)
							uni.hideLoading()
							this.$u.toast('网络错误，请稍后再试！')
						})
					} else {
						uni.showLoading({
							mask: true,
							title: '请稍后..'
						})
						axios.post('/api/v1/user/coupon_order', {
							coupon_id: id
						}).then(res => {
							uni.hideLoading()
							console.log(res)
							if(res.code !== 1) {
								this.$u.toast(res.info, 1200)
							} else {
								//发起支付
								uni.requestPayment({
									...res.data.param,
									success: (red) => {
										console.log('支付结果', red)
									},
									complete: (red) => {
										console.log(red)
										if (red.errMsg == "requestPayment:ok") {
											this.$u.toast('支付成功', 1200)
											setTimeout(() => {
												uni.navigateTo({
													url: '/pages/my/coupon/coupon'
												})
											}, 1500)
										} else if(red.errMsg != "requestPayment:fail cancel") {
											this.$u.toast('支付未完成', 1200)
										}
									}
								})
							}
						}).catch(error => {
							uni.hideLoading()
							uni.showToast({
								title: '网络错误，请稍后再试！',
								icon: 'none',
								duration: 1200
							})
						})
					}
					
				})
				
			},
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}
	.coupon-title::before {
		content: " ";
		padding-right: 20rpx;
		border-left: 2px solid #000;
	}
	.logo {
		border: 1px solid #374151;
	}

	.coupon {
		position: relative;
		margin-top: 4rpx;
		color: #fff;
		overflow: hidden;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.coupon-left,
	.coupon-right {
		display: inline-block;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
	}

	.coupon-left {
		width: 413rpx;
		padding-left: 20rpx;
	}

	.coupon-right {
		width: 277rpx;
		text-align: center;
	}

	/* .coupon::before {
  content: ' ';
  width: 0;
  height: 100%;
  position: absolute;
  border-left: 8rpx dotted white;
  top: 4rpx;
  left: -4rpx;
}

.coupon::after {
  content: ' ';
  width: 0;
  height: 100%;
  position: absolute;
  border-right: 8rpx dotted white;
  top: 4rpx;
  right: -4rpx;
} */

	.dot-top,
	.dot-bottom {
		position: absolute;
		width: 32rpx;
		height: 32rpx;
		background-color: #fff;
		z-index: 999;
		border-radius: 50%;
		left: 395rpx;
	}

	.dot-top {
		top: -16rpx;
	}

	.dot-bottom {
		bottom: -16rpx;
	}
	
	.video-line::after {
		content: " ";
		position: absolute;
		top: 0;
		// right: 0;
		// bottom: 0;
		left: 0;
		height: 1px;
		right: 0;
		background-color: #ccc;
		transform: scaleY(0.5);
		transform-origin: top;
		// border-top: 1px solid #ccc;
	}
</style>