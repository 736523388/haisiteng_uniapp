<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="text-white padding-tb-lg" style="background-color: #0B1839;text-align: center;">
				<view @click.stop="$globalJump2View('/pages/agreement/agreement?name=points_rule')">账户积分<uni-icons type="info" size="14" color="#fff"></uni-icons></view>
				<view style="font-size: 72rpx;">{{total}}<text style="font-size: 28rpx;">积分</text></view>
				<navigator url="/pages/my/integral/integral"
					style="border: #fff 1rpx solid;display: inline-block;border-radius: 40rpx;padding: 4rpx 30rpx;">积分明细
				</navigator>
				<navigator url="/pages/my/integral_exchange_logs/integral_exchange_logs"
					style="border: #fff 1rpx solid;display: inline-block;border-radius: 40rpx;padding: 4rpx 30rpx;margin-left: 10rpx;">兑换记录
				</navigator>
			</view>
<!-- 			<view class="container-xl bg-white margin-top-sm padding-sm radius-sm">
				<view>做任务 领积分</view>
			</view> -->
			<view v-if="list.length > 0" class="container-xl bg-white margin-top-sm padding-sm radius-sm">
				<view>超值兑换</view>
				<view class="">
					<view class="flex flex-wrap align-center justify-between">
						<view v-for="item in list" class="card-item margin-top-sm" @click="onReceive(item)">
							<view class="card-content"><text>￥</text><text>{{item.money}}</text><text>优惠券</text></view>
							<view class="card-desc">{{item.integral}}积分</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="receive" type="bottom" border-radius="10px 10px 0 0" background-color="#fff">
			<view style="padding: 20rpx;position: relative;">
				<view @click="closeReceive" style="position: absolute;top: 20rpx;right: 20rpx;"><uni-icons type="clear"
						size="24"></uni-icons></view>
				<view class="text-bold text-lg" style="text-align: center;">兑换优惠券</view>
				<view class="margin-top">使用<text class="text-red" style="margin: 0 2px;">{{checkItem.integral}}</text>积分兑换</view>
				<view class="margin-top-sm popup-card-item">
					<view class="popup-card-item-content">
						<view>￥<text style="font-size: 24px;">{{checkItem.money}}</text></view>
						<view>优惠券</view>
					</view>
					<view class="popup-card-item-desc">
						<view>{{checkItem.min_amount === '0.00' ? '无门槛使用' : '满'+parseFloat(checkItem.min_amount)+'元可用'}}</view>
						<view class="margin-top-sm text-sm">有效期：领取后{{checkItem.use_time_day}}天内有效</view>
					</view>
				</view>
				<view class="margin-top-sm">
					<view>使用说明</view>
					<view class="text-sm margin-top-xs">{{checkItem.remark}}</view>
				</view>
				<view class="margin-top">
					<button @click="receive" type="default" size="default" style="color:#ffffff;background-color:#fa3534;border-color: #fa3534;border-radius: 999rpx;">立即兑换</button>
				</view>
			</view>
		</uni-popup>
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
				total: 0,
				loaded: false,
				list: [],
				checkItem: {}
			};
		},
		onLoad() {
			const getTotal = axios.get('/api/v1/user/integral/total')
			const getCoupon = axios.get('/api/v1/user/integral/coupon')
			Promise.all([getTotal, getCoupon]).then(results => {
				if (results[0].code === 1 && results[1].code === 1) {
					this.total = results[0].data
					this.list = results[1].data
					this.$nextTick(() => {
						this.loaded = true
					})
				} else {
					uni.showToast({
						title: "出错了，请返回重试",
						icon: 'none',
						duration: 1200
					})
				}
			}).catch(error => {
				uni.showToast({
					title: "出错了，请返回重试",
					icon: 'none',
					duration: 1200
				})
			})
		},
		methods: {
			onReceive(item) {
				this.checkItem = item
				this.$nextTick(() => {
					this.$refs.receive.open()
				})
			},
			closeReceive(){
				this.$refs.receive.close()
			},
			receive(){
				axios.post('/api/v1/user/integral/receive_coupon', {
					id: this.checkItem.id
				}).then(res => {
					this.$refs.receive.close()
					uni.showToast({
						title: res.info,
						icon:'none',
						duration: 1200
					})
				}).catch(error => {
					this.$refs.receive.close()
					uni.showToast({
						title:'领取失败',
						icon:'none',
						duration: 1200
					})
				})
			}
		}
	}
</script>

<style lang="scss">
	
	.card-item {
		width: 320rpx;
		height: 210rpx;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 20rpx;
		filter: drop-shadow(2rpx 2rpx 1rpx rgba(0, 0, 0, 0.3));
		position: relative;
		color: #fff;

		&::after {
			content: "";
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			background: linear-gradient(35deg, orange, #ff2e63);
			-webkit-mask: radial-gradient(circle at 12rpx 61%, transparent 12rpx, red 0) -12rpx;
		}

		.card-content {
			display: flex;
			align-items: baseline;
			justify-content: center;
			position: relative;
			height: 61%;

			&::after {
				content: "";
				width: 270rpx;
				height: 1rpx;
				position: absolute;
				background-image: linear-gradient(90deg, #a33b55 50%, transparent 50%);
				background-size: 10px 10px;
				left: calc(50% - 135rpx);
				bottom: -4rpx;
			}

			text:nth-child(2) {
				font-size: 30px;
				letter-spacing: 2px;
				margin: 0 20rpx 0 10rpx;
			}
		}

		.card-desc {
			height: 39%;
			display: flex;
			align-items: flex-end;
			justify-content: center;
		}
	}
	
	.popup-card-item {
		width: 100%;
		height: 160rpx;
		border-radius: 20rpx;
		overflow: hidden;
		padding: 20rpx;
		filter: drop-shadow(2rpx 2rpx 1rpx rgba(0, 0, 0, 0.3));
		position: relative;
		color: #fff;
		display: flex;
		justify-content: center;
		align-items: center;
		&::after {
			content: "";
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
			z-index: -1;
			background: linear-gradient(325deg, orange, #ff2e63);
			// -webkit-mask: radial-gradient(circle at 20rpx 61%, transparent 20rpx, red 0) -20rpx;
			// -webkit-mask: radial-gradient(circle at 50%, red 5px, #000 0) -5px 50%/100% 20px, radial-gradient(circle at 20px 20px, #000 20px, red 0) -20px 20px / 50%;
			// -webkit-mask: radial-gradient(circle at 20rpx 20rpx, transparent 20px, red 0) tomato 0px;
		}
		.popup-card-item-desc{
			width: 65%;
			padding: 20rpx;
		}
		.popup-card-item-content {
			width: 35%;
			text-align: center;
			// position: relative;
			&::after {
				content: "";
				width: 1rpx;
				height: 150rpx;
				position: absolute;
				background-image: linear-gradient(180deg, #a33b55 50%, transparent 50%);
				background-size: 10px 10px;
				// left: calc(50% - 140rpx);
				right: 65%;
				bottom: 5rpx;
			}
		}
	}
	
</style>