<template>
	<view>
		<view class="header-box"
			style="background-image: url('https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my_bg.jpg');background-size: cover;background-repeat: repeat;">
			<!-- 		<u-image custom-class="background-image" width="750rpx" height="194rpx"
			src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my_bg.jpg"></u-image> -->
			<view class="title">物流信息</view>
			<view class="express">
				<view class="order-card">
					<view class="order-card-icon">
						<u-icon name="car-fill" />
					</view>
					<view>
						<view style="padding-bottom: 10rpx;">物流快递：{{track_name}}</view>
						<view>快递单号：{{number}}<uni-tag @click="copy" type="warning" inverted circle text="复制"></uni-tag>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="container track-message" v-if="loaded === true && message.length > 0">
			<u-steps current="0" direction="column" activeColor="#374151">
				<u-steps-item :title="item.AcceptStation" :desc="item.AcceptTime" v-for="(item,index) in message"
					:key="index">
				</u-steps-item>
			</u-steps>
			<view style="height: 44px;"></view>
		</view>

		<view v-if="loaded === true && message.length === 0">
			<u-empty text="暂无数据" icon="/static/empty_data.png">
			</u-empty>
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
				code: "",
				number: '',
				track_name: '',
				loaded: false,
				message: []
			};
		},
		onLoad(options) {
			this.code = options.code || ''
			this.number = options.number || ''
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
							duration: 2000,
						})
					}
				})
			},
			loadData() {
				uni.showLoading({
					title: '加载中~'
				})
				axios.get('/api/v1/user/order/track', {
					params: {
						code: this.code,
						number: this.number
					}
				}).then(res => {
					if (res.code === 1) {
						this.message = res.data.Traces.reverse()
						this.track_name = res.data.track_name
					} else {
						this.track_name = '获取失败'
					}

				}).catch(error => {
					this.track_name = '获取失败'
				}).finally(() => {
					wx.hideLoading()
					this.loaded = true
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