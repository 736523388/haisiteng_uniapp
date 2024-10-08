<template>
	<view class="page-body">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="ad-box" v-if="shop_index_background.length > 0" @click="adClick(shop_index_background[0])">
				<image :src="shop_index_background[0].cover" style="height: 510rpx;width: 750rpx;"></image>
			</view>
			<view class="flex">
				<view class="goods-cate-box" :class="{'no-ad': shop_index_background.length < 1}">
					<view @click="current=index" class="padding-tb-lg goods-cate-item text-lg" :class="{active: index===current}"
						v-for="(item, index) in list" :key="item.id">{{item.name}}</view>
				</view>
				<view class="goods-box" :class="{'no-ad': shop_index_background.length < 1}">
					<uni-list :border="false" style="padding-bottom: 50px;">
						<block v-for="(v, index) in list" :key="item.id">
							<uni-list-item v-show="index === current" v-for="(item, k) in v.list" :key="item.code" style="padding: 0;" direction="column">
								<template v-slot:body>
									<navigator :url="'/pages/shop/goods_detail/goods_detail?id=' + item.id"
										style="background-color: #fff;width: 100%;" class="flex align-center">
										<view style="width: 200rpx;height: 200rpx;">
											<image mode="scaleToFill" :src="item.cover" style="width: 200rpx;height: 200rpx;"></image>
										</view>
										
										<view class="padding-xs padding-left">
											<view class="text-sm" style="height: 60rpx;line-height: 30rpx;overflow: hidden;">
												<text class="u-line-2">{{item.name}}</text>
											</view>
											<view v-if="item.activity_title">
												<uni-tag :text="item.activity_title" size="mini"
													type="error"></uni-tag>
											</view>
											<view class="margin-top-sm padding-bottom-xs flex align-center">
												<!-- <text class="text-xs margin-lr-xs">¥</text> -->
												<text class="text-df">¥{{item.price_selling}}</text>
											</view>
											<!-- <view class="text-sm text-gray">剩余{{item.stock_total - item.stock_sales}}件</view> -->
										</view>
									</navigator>
								</template>
							</uni-list-item>
						</block>
						
					</uni-list>
				</view>
			</view>
		</view>
		
		<drag-button :isDock="true" :existTabBar="true" :Hedge="30" />
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request'
	import {
		mapState,mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				loaded: false,
				current: 0,
				list: [],
			};
		},
		computed: {
			...mapState({
				shop_index_background: state => state.global.shop_index_background
			}),
			...mapGetters({
				is_login: 'user/is_login',
			})
		},
		onLoad() {
			console.log(this.shop_index_background)
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
			},
			adClick(item){
				console.log(item)
				if(item.link_type == 1) {
					if(item.need_login && !this.is_login){
						uni.navigateTo({
							url: '/pages/login/login'
						})
						return false
					}
					let path = item.path
					if(item.query){
						path = path + '?' + item.query
					}
					if(item.jump_type == 1){
						uni.navigateTo({
							url: path
						})
					} else {
						uni.switchTab({
							url: path
						})
					}
				} else if(item.link_type == 2) {
					wx.navigateTo({
						url: '/pages/web_view/web_view?url=' + encodeURI(item.path),
					})
				} 
			},
		}
	}
</script>

<style lang="scss" scoped>
	page{
		background-color: #fff;
	}
	.page-body {
		// background-color: #fff;
		// position: fixed;
		// left: 0;
		// top: 0;
		// right: 0;
		// bottom: 0;
		// box-sizing: border-box;
		.ad-box{
			position: fixed;
			left: 0;
			/* #ifdef H5 */
			top: 44px;
			/* #endif */
			/* #ifndef H5 */
			top: 0;
			/* #endif */
			z-index: 9999;
		}
		.goods-cate-box {
			position: fixed;
			left: 0;
			/* #ifdef H5 */
			top: calc(44px + 510rpx);
			/* #endif */
			/* #ifndef H5 */
			top: 510rpx;
			/* #endif */
			right: 530rpx;
			bottom: 0;
			background-color: #f3f3f3;
			text-align: center;
			color: #000030;
			&.no-ad{
				/* #ifdef H5 */
				top: 44px;
				/* #endif */
				/* #ifndef H5 */
				top: 0;
				/* #endif */
			}
			
			.goods-cate-item {
				position: relative;
				&:not(:first-child)::before {
					content: " ";
					position: absolute;
					width: 100%;
					left: 0;
					top: 0;
					border-top: 1px solid #e8e8e8;
				}
				&.active {
					background-color: #fff;
					&::after {
						content: " ";
						position: absolute;
						height: 80%;
						left: 0;
						top: 10%;
						border-left: 2px solid #000030;
					}
				}
			}	
		}
		
		.goods-box{
			position: absolute;
			left: 220rpx;
			top: 510rpx;
			right: 0;
			bottom: 0;
			background-color: #fff;
			&.no-ad{
				top: 0;
			}
		}
	}
</style>