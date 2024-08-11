<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="header-box"
				style="background-image: url('https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my_bg.jpg');background-size: cover;background-repeat: repeat;">
				<view class="title">物流信息</view>
				<view class="express">
					<view class="order-card">
						<view class="order-card-icon">
							<u-icon name="car-fill" />
						</view>
						<view>
							<view class="padding-bottom-xs">物流快递：{{track_name}}</view>
							<view class="flex align-center">快递单号：{{number}}
								<view class="margin-left-xs"><uni-tag @click="copy" size="mini" type="warning" inverted
										circle text="复制"></uni-tag></view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="container track-message" v-if="loaded === true && message.length > 0">
				<uni-steps :options="message" :active="0" direction="column" active-color="#000030"></uni-steps>
			</view>
		</view>


	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				order_no: "",
				code: "",
				number: '',
				track_name: '',
				loaded: false,
				message: []
			};
		},
		onLoad(options) {
			// this.code = options.code || ''
			// this.number = options.number || ''
			this.order_no = options.order_no || ""
			this.loadData()
		},
		methods: {
			// 复制订单编号
			copy(e) {
				var that = this;
				uni.setClipboardData({
					data: that.number,
					success: res => {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1200,
						})
					}
				})
			},
			loadData() {
				axios.get('/api/v1/user/order/logistics', {
					params: {
						order_no: this.order_no
					}
				}).then(res => {
					if (res.code === 1) {
						// this.message = res.data.data
						this.track_name = res.data.track_name
						this.number = res.data.track_number
						this.message = res.data.data.map(item => {
							return {
								title: item.context,
								desc: item.time
							}
						})
						this.$nextTick(() => {
							this.loaded = true
						})
					} else {
						uni.showToast({
							title: "获取物流轨迹失败",
							icon: 'none',
							duration: 1200
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
					}

				}).catch(error => {
					uni.showToast({
						title: "获取物流轨迹失败",
						icon: 'none',
						duration: 1200
					})
					setTimeout(() => {
						uni.navigateBack()
					}, 1200)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.header-box {
		position: relative;
		height: 194rpx;
	}

	.background-image {
		z-index: -1;
		position: absolute !important;
		top: 0;
	}

	.title {
		color: #fff;
		font-size: 32rpx;
		font-weight: bold;
		margin-left: 20rpx;
		padding-top: 54rpx;
		text-align: center;
	}

	.track-message {
		padding-top: 120rpx;
	}

	.express {
		position: absolute;
		top: 128rpx;
		left: 20rpx;
		right: 20rpx;
	}

	.order-card {
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		align-items: flex-start;
		border: 1px solid #f8f8f8;
		font-size: 28rpx;
		// box-shadow: 1px 2px 2px hsl(0deg 0% 0% / 0.1);
	}

	.order-card-icon {
		padding-top: 4rpx;
		margin-right: 10rpx;
	}

	.copy-btn {
		margin-left: 20rpx;
	}
</style>