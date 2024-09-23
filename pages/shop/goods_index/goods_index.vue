<template>
	<view class="page-body">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<image :src="shop_index_background" mode="widthFix" style="width: 100%;"/>

			<view style="width: 690rpx;height: 220rpx;margin: 20rpx auto;"
				@click="$globalJump2View('/pages/shop/goods_integral/goods_integral', true)">
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
								<text class="u-line-2">{{item.name}}</text>
							</view>
							<view class="margin-top-sm padding-bottom-xs flex align-center">
								<uni-tag v-if="item.activity_title != null" :text="item.activity_title" size="mini" type="error"></uni-tag>
								<text class="text-xs margin-lr-xs">¥</text>
								<text class="text-df">{{item.price_selling}}</text>
							</view>
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
	import {
		mapState
	} from 'vuex'
	export default {
		data() {
			return {
				loaded: false,
				list: [],
			};
		},
		computed: {
			...mapState({
				shop_index_background: state => state.global.shop_index_background
			})
		},
		onLoad() {
			this.loadData()
		},
		onShareAppMessage: function(options) {
			return {
				title: "My Hastens",
				path: 'pages/shop/goods_index/goods_index'
			}
		},
		methods: {
			loadData() {
				axios.get('/api/v1/cate_goods').then(res => {
					this.list = res.data
					this.$nextTick(() => {
						this.loaded = true
					})
					
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