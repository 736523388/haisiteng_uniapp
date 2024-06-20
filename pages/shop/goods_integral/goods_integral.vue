<template>
	<view>
		<u-loading-page :loading="status !== 'nomore'" loading-text="My Hastens"
			loading-mode="semicircle"></u-loading-page>
		<block v-if="status === 'nomore'">
			<view class="page-bar">
				<view class="text-xl" style="font-weight: bold;">积分商城</view>
				<view class="text-sm" style="font-weight: bold;color: #71717a;margin-top: 12rpx;">POINTS MALL</view>
			</view>
			<view class="container flex justify-between align-end bg-white padding-sm margin-top-sm margin-bottom-xs"
				style="border-radius: 10rpx;">
				<view style="display: flex;">
					<u-image shape="circle" :src="is_login ? userinfo.headimg || defaultAvatarUrl : app_logo"
						width="80rpx" height="80rpx" mode="aspectFill" />
					<view style="margin-left: 20rpx;">
						<view class="text-desc">我的积分</view>
						<view class="text-xl">{{integral_available}}</view>
					</view>
				</view>
				<view class="text-sm text-desc">
					<text @click="$globalJump2View('/pages/agreement/agreement?name=points_rule')">积分规则</text>
					<text style="margin: 0 6rpx;">|</text>
					<text @click="$globalJump2View('/pages/my/integral/integral', true)">积分记录</text>
				</view>
			</view>
			<view>
				<view class="container flex flex-wrap justify-between">
					<navigator :url="'/pages/shop/goods_detail/goods_detail?id='+item.id" v-for="(item,index) in list"
						:key="item.code" class="bg-white" style="margin: 20rpx 0;width: 330rpx;overflow: hidden;">
						<u-image :src="item.cover" width="330rpx" height="330rpx" mode="aspectFill" />
						<view style="padding: 4rpx 10rpx 10rpx 10rpx;">
							<view class="text-sm" style="height: 60rpx;line-height: 30rpx;overflow: hidden;">
								<u--text :lines="2" :text="item.name" size="24rpx"></u--text>
							</view>
							<view style="margin-top: 10rpx;"><text class="text-xs"
									style="margin-right: 6rpx;">¥</text><text
									class="text-df">{{item.price_selling}}</text>
								<block v-if="item.integral_num > 0">
									<text class="text-xs">起</text><text class="text-xs" style="margin: 0 6rpx;">+</text>
									<text>{{item.integral_num}}积分</text>
								</block>
							</view>
						</view>
					</navigator>
				</view>
			</view>
		</block>

	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request'
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				integral_available: 0,
				loading: false, // more noMore loading
				loaded: false,
				status: 'loadmore',
				list: [],
			};
		},
		computed: {
			...mapState({
				app_logo: state => state.global.app_logo,
				userinfo: state => state.user.userinfo
			}),
			...mapGetters({
				is_login: 'user/is_login',
			})
		},
		onLoad() {
			checkLogin(() => {
				this.loadData()
				axios.get('/api/v1/user/info').then(res => {
					if (res.code === 1) {
						this.integral_available = res.data.integral_available
					}

				})
			})
		},
		methods: {
			// 产品列表接收数据
			loadData: function(e) {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'
				axios.get('/api/v1/goods?is_integral=1').then(res => {
					this.list = res.data.list
					this.status = 'nomore'
				})
			},
		}
	}
</script>

<style lang="scss">

</style>