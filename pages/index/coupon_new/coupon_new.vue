<template>
	<view class="bg-white" style="min-height: 100vh;">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<view class="container" v-for="(item,index) in list" :key="index">
				<u-image v-if="item.cover" :src="item.cover" width="688rpx" height="688rpx" mode="aspectFill" />
				<view class="coupon" :style="'background-image: url('+coupon_background_image+');'">
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
							<u-button @click="receive(item.id)" :disabled="item.receive_status === 1" type="primary"
								size="small" :text="item.receive_status === 1 ? '已领取': '立即领取'"></u-button>
						</view>
					</view>
				</view>
				<u-line margin="20rpx 0"></u-line>
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
				loaded: false,
				list: [],
				coupon_background_image: "https://hst.dev.cqclxsc.com/upload/a1/69ab59816e29a0164befa8ee8bcdad.jpg"
			};
		},
		onLoad() {
			axios.get('/api/v1/coupon?new_user=1').then(res => {
				if (res.code === 1) {
					this.list = res.data.list
					this.loaded = true
				}
			})
		},
		methods: {
			receive(id) {
				axios.get(`/api/v1/user/coupon/receive/${id}`).then(res => {
					uni.showToast({
						title: res.info,
						icon: res.code === 1 ? 'success' : 'none',
						duration: 1200
					})
					if (res.code === 1) {
						let index = this.list.findIndex(item => item.id === id)
						if (index !== -1) {
							setTimeout(() => {
								this.$set(this.list[index], 'receive_status', 1)
							}, 1200)
						}
					}
				}).catch(error => {
					console.log(error)
					this.$u.toast('网络错误，请稍后再试！')
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
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
</style>