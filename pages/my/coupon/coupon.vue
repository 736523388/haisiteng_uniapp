<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<u-sticky bgColor="#f8f8f8">
				<view class="padding-tb container">
					<uni-segmented-control :current="current" :values="couponTabsLabel" @clickItem="onClickItem"
						styleType="button" activeColor="#000030"></uni-segmented-control>
				</view>
			</u-sticky>
			<view class="container" v-show="current==0">
				<view v-for="(item,index) in available" :key="item.id">
					<view class="coupon" :style="'background-image: url(' + coupon_background_image + ');'">
						<view class="coupon-left">
							<view>{{item.title}}</view>
							<view class="text-xxs margin-top-xs">有效期：{{item.expire_datetime}}</view>
							<view style="margin-top: 16rpx;height: 36rpx;margin-left: 6rpx;">
								<image src="/static/images/logo.svg" mode="heightFix" style="height: 100%;width: 120rpx;">
								</image>
							</view>
							<view class="text-xxs margin-top-xs">·{{item.remark}}</view>
							<view class="margin-top-xs" v-if="item.type === 2">核销码 {{item.code}}</view>
						</view>
						<view class="coupon-right">
							<view class="text-xl">{{ item.desc }}</view>
							<view class="margin-top-sm margin-right-sm">
								<u-button type="primary"
									@click.native.stop="$globalJump2View('/pages/shop/goods_index/goods_index')"
									:disabled="item.status !== 1" size="small"
									:text="item.status === 1 ? '未使用': (item.status === 0 ? '已过期':'已使用')"></u-button>
							</view>
						</view>
					</view>
					<u-divider />
				</view>
				<u-empty v-if="loaded === true && available.length === 0" marginTop="44" text="暂无可用优惠券"
					icon="/static/empty_data.png"></u-empty>
			</view>
			<view class="container" v-show="current==1">
				<view v-for="(item,index) in unavailable" :key="item.id">
					<view class="coupon" :style="'background-image: url(' + coupon_background_image + ');'">
						<view class="coupon-left">
							<view>{{item.title}}</view>
							<view class="text-xxs margin-top-xs">有效期：{{item.expire_datetime}}</view>
							<view style="margin-top: 16rpx;height: 36rpx;margin-left: 6rpx;">
								<image src="/static/images/logo.svg" mode="heightFix" style="height: 100%;width: 120rpx;">
								</image>
							</view>
							<view class="text-xxs margin-top-xs">·{{item.remark}}</view>
							<view class="margin-top-xs" v-if="item.type === 2">核销码 {{item.code}}</view>
						</view>
						<view class="coupon-right">
							<view class="text-xl">{{ item.desc }}</view>
							<view class="margin-top-sm margin-right-sm">
								<u-button type="primary"
									@click.native.stop="$globalJump2View('/pages/shop/goods_index/goods_index')"
									:disabled="item.status !== 1" size="small"
									:text="item.status === 1 ? '未使用': (item.status === 0 ? '已过期':'已使用')"></u-button>
							</view>
						</view>
					</view>
					<u-divider />
				</view>
				<u-empty v-if="loaded === true && unavailable.length === 0" marginTop="44" text="暂无不可用优惠券"
					icon="/static/empty_data.png"></u-empty>
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
				current: 0,
				coupon_background_image: "https://hst.dev.cqclxsc.com/upload/a1/69ab59816e29a0164befa8ee8bcdad.jpg",
				list: [],
				available: [],
				unavailable: [],
				loaded: false
			};
		},
		computed: {
			couponTabsLabel() {
				return ['可用(' + this.available.length + ')', '不可用(' + this.unavailable.length + ')']
			},
		},
		onLoad() {
			axios.get('/api/v1/user/coupon').then(res => {
				if (res.code === 1) {
					const available = []
					const unavailable = []
					res.data.list.forEach((item, index) => {
						if (item.status === 1) {
							available.push(item)
						} else {
							unavailable.push(item)
						}
					})
					this.available = available
					this.unavailable = unavailable
					console.log(available, unavailable)
					this.list = res.data.list
					this.loaded = true
				}
			})
		},
		methods: {
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.coupon-list {
		background-color: #fff;
		min-height: 100vh;
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
</style>