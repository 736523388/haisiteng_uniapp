<template>
	<view class="page-body">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<view style="height: 450rpx;">
				<u--image :src="top_hero" width="100%" height="450rpx" mode="center" />
			</view>

			<view style="width: 690rpx;height: 220rpx;margin: 20rpx auto;"
				@click="$globalJump2View('/pages/shop/goods_integral/goods_integral')">
				<u--image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E5%95%86%E5%9F%8E2.jpg"
					height="220rpx" width="100%" mode="aspectFit" />
			</view>
			<!-- 产品 -->
			<view v-for="(item, index) in list" :key="item.id">
				<view class="page-bar">
					<view class="text-xl" style="font-weight: bold;">{{item.name}}</view>
					<view class="text-sm" style="font-weight: bold;color: #71717a;margin-top: 12rpx;">{{item.english}}
					</view>
				</view>
				<view class="container" style="display: flex;flex-wrap: wrap;justify-content: space-between;">
					<navigator :url="'/pages/shop/goods_detail/goods_detail?id=' + item.id" v-for="item in item.list"
						wx:key="code" style="margin: 20rpx 0;background-color: #fff;width: 330rpx;overflow: hidden;">
						<u--image :src="item.cover" width="330rpx" height="330rpx" mode="aspectFill" />
						<view style="padding: 4rpx 10rpx 10rpx 10rpx;">
							<view class="text-sm" style="height: 60rpx;line-height: 30rpx;overflow: hidden;">
								<u--text :lines="2" :text="item.name" size="24rpx"></u--text>
							</view>
							<view style="margin-top: 10rpx;"><text class="text-xs"
									style="margin-right: 6rpx;">¥</text><text
									class="text-df">{{item.price_selling}}</text></view>
						</view>
					</navigator>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request'
	export default {
		data() {
			return {
				loaded: false,
				top_hero: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/goods_shop_top_hero.png',
				list: [],
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				axios.get('/api/v1/cate_goods').then(res => {
					this.list = res.data
					this.loaded = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		background-color: #f8f8f8;
		/* position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0; */
		box-sizing: border-box;
	}
</style>