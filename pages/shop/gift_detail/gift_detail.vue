<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<!-- 轮播图 -->
			<swiper class="screen-swiper square-dot" indicator-dots circular :autoplay="detail.video == ''"
				interval="5000" duration="500" indicator-color="#6b7280" indicator-active-color="#374151">
				<swiper-item v-for="(item, index) in detail.slider" :key="item">
					<view @click="showPreviewImage(index)">
						<image style="width: 100%;" :src="item" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="bg-white padding-sm">
				<view>
					<text class="margin-left-xs">{{detail.title}}</text>
				</view>
				<view class="margin-top-xs flex align-center">
					<text class="margin-left-xxs">{{detail.integral_num}}积分</text>
				</view>

				<!-- <view class="">{{checkspec.goods_spec_alias}}</view> -->
				<view class="text-sm text-desc">{{detail.desc}}</view>
			</view>
			<view class="margin-top-sm" style="padding-bottom: 160rpx;">
				<rich-text style="font-size: 0;" :nodes="detail.content"></rich-text>
			</view>
			<view class="bg-white flex align-center"
				style="position: fixed;bottom: 0;width: 100%;padding-bottom: env(safe-area-inset-bottom);z-index: 10080;">
				<view style="width: 100%;padding: 30rpx;">
					<button @click="$globalJump2View('/pages/shop/gift_confirm/gift_confirm?id='+id, true)" type="default" size="default" style="width: 100%;color:#ffffff;background-color:#fa3534;border-color: #fa3534;border-radius: 999rpx;">立即兑换</button>
				</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request'
	export default {
		data() {
			return {
				id: '',
				loaded: false,
				detail: {}
			};
		},
		onLoad(options) {
			this.id = options.id || ''
			this.loadData()

		},
		methods: {
			loadData() {
				axios.get('/api/v1/integral/gift/detail?id=' + this.id).then(res => {
					if (res.code === 1) {
						this.detail = res.data
						this.$nextTick(() => {
							this.loaded = true
						})
					}

				})
			},
			showPreviewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.detail.slider,
					indicator: 'number'
				})
			},
		}
	}
</script>

<style lang="scss">

</style>