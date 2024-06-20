<template>

	<view class="page-body switch-tab">
		<view style="position: absolute;top: 0;left: 0;right: 0;">
			<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/home_bg.png" mode="aspectFill"
				style="width:100%;height: 500rpx;" />
		</view>
		<view style="height: 244rpx;"></view>
		<view class="container brand">
			<view class="brand-logo">
				<view class="margin-top" @click="$globalJump2View('/pages/my/userinfo/userinfo', true)">
					<u-image shape="circle" image-class="logo"
						:src="is_login ? userinfo.headimg || defaultAvatarUrl : app_logo" width="162rpx" height="162rpx"
						mode="aspectFill" :lazyLoad="true" style="width:162rpx;height: 162rpx;">
					</u-image>
				</view>
				<view class="brand-userinfo">
					<view class="contact-us text-sm align-center">
						<view style="display: inline-block;position: relative;padding-right: 32rpx;line-height: 32rpx;">
							<text>品牌客服</text>
							<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_home.png"
								style="display: block;height: 32rpx;width: 32rpx;margin: 0;padding: 0;position: absolute;top: 0;right: 0;bottom: 0;" />
							<button open-type="contact"
								style="position: absolute;top: 0;right: 0;left: 0;bottom: 0;opacity: 0;"></button>
						</view>
						<!-- <image src="/images/my/menu_home.png" style="height: 24rpx;width: 24rpx;margin: 0;padding: 0;vertical-align:middle;" />
	          <view style="display: inline-block;height: 24rpx;width: 24rpx;">
	            <image src="/images/my/menu_home.png" style="height: 100%;width: 100%;margin: 0;padding: 0;vertical-align:middle;" />
	          </view> -->
						<!-- <van-icon name="/images/my/menu_05.png" size="20px" /> -->
					</view>

					<block v-if="is_login">
						<view style="margin-left: 30rpx;"
							@click="$globalJump2View('/pages/my/userinfo/userinfo', true)">
							<view class="userinfo-username text-xl">{{userinfo.vip_name || '游客'}} |
								{{userinfo.nickname || '微信用户'}}
							</view>
							<view class="text-sm" style="margin-top: 10rpx;">ID：{{userinfo.idstr}}</view>
							<view style="margin-top: 10rpx;" class="text-desc text-xs">完善个人信息></view>
						</view>
					</block>
					<block v-else>
						<view style="margin-left: 30rpx;" @click="$globalJump2View('/pages/login/login')">
							<view class="userinfo-username text-xl">点击注册/登录</view>
							<view style="margin-top: 40rpx;"></view>
						</view>
					</block>
				</view>
			</view>
			<view class="brand-desc text-sm" style="letter-spacing: 0.075em;font-weight: bold;">{{brand_desc}}</view>
			<view class="brand-image">
				<image src="/static/images/logo_black.svg" mode="heightFix" style="height: 100%;"></image>
			</view>
		</view>

		<view class="container margin-top">
			<scroll-view scroll-x style="white-space:nowrap;">
				<view class="scroll_box" v-for="item in top_menu" :key="item.title"
					@click="$globalJump2View(item.path, true)">
					<image :src="item.url" mode="aspectFill" style="height: 100%;width: 100%;"></image>
					<view class="text-df text-white"
						style="position: absolute;top: 30rpx;left: 30rpx;background-color: #0B1839;border-radius: 16rpx;padding: 0 16rpx;line-height: 40rpx;">
						{{item.title}}
					</view>
				</view>
			</scroll-view>
		</view>

		<view class="container menu-card" v-for="(item, index) in page_decoration" wx:key="hero">
			<view style="background-color: #fff;">
				<image mode="aspectFill" :src="item.hero" :key="item.title" style="height: 290rpx;width:290rpx;" />
			</view>
			<view class="content">
				<view class="title text-df">{{item.title}}</view>
				<view class="desc text-df" style="margin-top: 10rpx;">{{item.desc}}</view>
				<view class="btn" style="margin-top: 31rpx;">
					<u-button type="primary" size="small" @click="decorationClick(index)">{{item.btn_text}}</u-button>
				</view>
			</view>
		</view>

		<view class="container banner">
			<view class="container-bar text-xl" style="font-weight: 500;">
				探索背后的故事
			</view>
			<swiper class="screen-swiper square-dot" :indicator-dots="true" :circular="true" :autoplay="true"
				interval="5000" duration="500" indicator-color="#6b7280" indicator-active-color="#374151">
				<swiper-item v-for="(item, index) in index_banner" :key="item.name" @click="swiperClick"
					:data-index="index">
					<view style="height: 100%;">
						<image :src="item.img" mode="aspectFill"></image>
						<view class="title text-xl text-center">{{item.name}}</view>
						<view class="text-sm text-center">{{item.desc}}</view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<custom-tabbar :currentIndex="0" @switchTab="switchTab"></custom-tabbar>
	</view>

</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				value1: 0,
				defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				brand_desc: '在海丝腾门店或线上渠道购买任意产品，即可升级为尊贵会员，获得丰富尊享礼遇。',
				top_menu: [{
						url: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%88%91%E7%9A%84%E5%BA%8A%E5%85%B71634107333713.png',
						title: '我的床具',
						path: '/pages/my/my_beds/my_beds'
					},
					{
						url: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E5%85%BB%E6%8A%A4%E4%B8%AD%E5%BF%831634107335313.png',
						title: '预约保养',
						path: '/pages/index/maintenance_service/maintenance_service'
					},
					{
						url: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%88%91%E7%9A%84%E5%8D%A1%E5%88%B81634107335923.png',
						title: '会员福利',
						path: '/pages/index/coupon/coupon'
					},
				]
			}
		},
		computed: {
			...mapState({
				app_logo: state => state.global.app_logo,
				index_banner: state => state.global.index_banner,
				page_decoration: state => state.global.page_decoration,
				userinfo: state => state.user.userinfo
			}),
			...mapGetters({
				is_login: 'user/is_login',
			})
		},
		// components: {
		// 	customTabbar
		// },
		onLoad(options) {
			console.log('index onLoad')
			if (options.uid) {
				uni.setStorageSync('pid', options.uid)
			}
		},
		onShareAppMessage: function(options) {
			let path = 'pages/index/index'
			if (this.is_login) {
				path = path + '?uid=' + this.userinfo.id
			}
			console.log(path)
			return {
				title: "My Hastens",
				path: path
			}
		},
		methods: {
			/**
			 * 跳转到页面
			 * @param {Object} path
			 */
			jump2view(path) {
				console.log(path)
				uni.navigateTo({
					url: path,
				})
			},
			switchTab(e) {
				console.log(e)
			},
			decorationClick(index) {
				let url
				switch (index) {
					case 0:
						url = '/pages/index/coupon_new/coupon_new'
						break
					case 1:
						url = '/pages/shop/index/index'
						break
					case 2:
						url = '/pages/shop/goods_index/goods_index'
						break
					case 3:
						url = '/pages/index/share/share'
						break
				}
				if (url) {
					uni.navigateTo({
						url
					})
				}
			},
			swiperClick(e) {
				let rule = this.index_banner[e.currentTarget.dataset.index].rule
				let [type, id] = rule.split('#')
				if (rule != "#" && id === undefined) {
					wx.navigateTo({
						url: '/pages/web_view/web_view?url=' + encodeURI(rule),
					})
				} else if (id !== undefined) {
					if (type == 'GOODS') {
						wx.navigateTo({
							url: '/pages/shop/goods_datail/goods_datail?id=' + id,
						})
					}
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.page-body {
		background-color: #f8f8f8;
		box-sizing: border-box;
		padding-bottom: calc(env(safe-area-inset-bottom) + 100rpx);
	}

	/* 	.switch-tab {
		padding-bottom: calc(env(safe-area-inset-bottom) + 50px) !important;
	} */

	.brand {
		padding: 65rpx 54rpx 10rpx 54rpx;
		background-color: #fff;
		border-radius: 16rpx;
		position: relative;
	}

	.brand-logo {
		display: flex;
		align-items: center;
		height: 162rpx;
	}

	.brand-userinfo {
		flex: 1;
		display: flex;
		flex-direction: column;
		justify-content: end;
		height: 100%;
	}

	.contact-us {
		text-align: right;
		flex: 1;
	}

	.userinfo-username {
		font-weight: bold;
	}

	.perfect {
		color: #9ca3af;
	}

	.brand-desc {
		margin-top: 30rpx;
	}

	.brand-image {
		text-align: right;
		height: 58rpx;
		margin-right: 16rpx;
	}

	.menu-card {
		display: flex;
		background-color: #fff;
		margin-top: 49rpx;
		height: 290rpx;
	}

	.menu-card>.content {
		padding-left: 50rpx;
		height: 100%;
		padding-top: 37rpx;
		padding-right: 10rpx;
	}

	.banner {
		margin-top: 50rpx;
		margin-bottom: 50rpx;
		background-color: #fff;
		padding: 0 20rpx;
		// padding-bottom: 100rpx;
	}

	.banner .title {
		margin: 30rpx 0 20rpx 0;
	}

	.screen-swiper {
		min-height: 535rpx;
	}

	.screen-swiper image,
	.screen-swiper video,
	.swiper-item image,
	.swiper-item video {
		height: 326rpx !important;
	}

	.scroll_box {
		position: relative;
		height: 300rpx;
		width: 300rpx;
		display: inline-block;
		margin-right: 16rpx;
	}

	.scroll_box:last-child {
		margin-right: 0;
	}
</style>