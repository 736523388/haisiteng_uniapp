<template>
	<view class="page-body">
		<view class="my_head_bg_box">
			<image :src="head_bg" mode="aspectFill" />
		</view>
		<view class="my_head_box">
			<view class="my_head_box_item" @click="$globalJump2View('/pages/my/userinfo/userinfo', true)">
				<view class="headimg-box">
					<u-image shape="circle" mode="scaleToFill"
						:src="is_login ? userinfo.headimg || defaultAvatarUrl : app_logo" width="114rpx"
						height="114rpx" />
				</view>
				<view class="text-bold nickname">{{show_nickname}}</view>
			</view>
		</view>
		<view class="flex text-center justify-around padding-tb bg-white">
			<view class="menu my-integ-border" @click="$globalJump2View('/pages/my/coupon/coupon', true)">
				<view class="text-ee">优惠券</view>
				<view class="text-xs text-grey">{{is_login ? coupon_count:0}}张可用</view>
			</view>
			<view class="menu my-integ-border" @click="$globalJump2View('/pages/my/integral_home/integral_home', true)">
				<view class="text-ee">积分</view>
				<view class="text-xs text-grey">{{is_login ?integral_available:0}}</view>
			</view>
			<view class="menu" @click="$globalJump2View('/pages/my/team/team', true)">
				<view class="text-ee">推荐</view>
				<view class="text-xs text-grey">{{is_login ?teams_count:0}}人</view>
			</view>
		</view>
		<view class="bg-white padding margin-top">
			<view class="flex justify-between align-center">
				<view>商城订单</view>
				<view class="flex align-center text-sm text-grey"
					@click="$globalJump2View('/pages/my/my_order/my_order', true)">查看全部
					<view class="margin-left-xxs">
						<u-icon size="24rpx" name="arrow-right" color="#808080"></u-icon>
					</view>
				</view>
			</view>
			<view class="flex align-center justify-between margin-top-sm">
				<view v-for="item in order_menu" :key="item.label" class="text-center"
					@click="$globalJump2View(item.url, true)">
					<view style="position: relative;">
						<image style="height: 48rpx;width: 48rpx;" :src="item.img"></image>
						<u-badge type="error" max="9" :value="is_login ? item.value:''" absolute
							:offset="item.offset"></u-badge>
					</view>
					<view>{{item.label}}</view>
				</view>
			</view>
		</view>
		<view class="padding-top padding-bottom-lg bg-white margin-top">
			<block v-for="(item,index) in menu" :key="item.title">
				<view @click="$globalJump2View(item.path, true)" :data-index="index"
					v-if="item.show === true && (is_login || !item.needLogin )" class="flex align-center my_menu_item">
					<view style="position: relative;">
						<image :src="item.icon"></image>
						<u-badge :show="item.redHot" :isDot="true" type="error" :absolute="true"
							:offset="[5,10]"></u-badge>
					</view>

					<view>{{item.title}}</view>
					<view class="my_menu_item_right_icon">
						<u-icon size="28rpx" name="arrow-right"></u-icon>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				head_bg: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my_bg.jpg',
				defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				menu: [{
						title: '我的床具',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_01.png',
						path: '/pages/my/my_beds/my_beds',
						show: true,
						needLogin: false,
						redHot: false
					},
					{
						title: '商城订单',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_02.png',
						path: '/pages/my/my_order/my_order',
						show: true,
						needLogin: false,
						redHot: false
					},
					{
						title: '我的保养预约',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_03.png',
						path: '/pages/my/my_beds_server/my_beds_server',
						show: true,
						needLogin: false,
						redHot: false
					},
					{
						title: '床具溯源查询',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_04.png',
						path: '/pages/index/search/search',
						show: true,
						needLogin: false,
						redHot: false
					},
					{
						title: '账户设置',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_06.png',
						path: '/pages/my/set/set',
						show: true,
						needLogin: false,
						redHot: false
					},
					{
						title: '业务中心',
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my/menu_06.png',
						path: '/pages/my/service/index',
						show: false,
						needLogin: true,
						redHot: false
					}
				],
				integral_available: 0,
				teams_count: 0,
				coupon_count: 0,
				serviceRedHot: false,
				order_menu: [{
						label: '待付款',
						img: '/static/icon_rj5jpyh9xsb/pay.png',
						value: 0,
						offset: [0, 0],
						url: '/pages/my/my_order/my_order?status=1'
					},
					{
						label: '待发货',
						img: '/static/icon_rj5jpyh9xsb/send.png',
						value: 0,
						offset: [0, 0],
						url: '/pages/my/my_order/my_order?status=2'
					},
					{
						label: '待收货',
						img: '/static/icon_rj5jpyh9xsb/deliver.png',
						value: 0,
						offset: [0, 0],
						url: '/pages/my/my_order/my_order?status=3'
					},
					// {
					// 	label: '待评价',
					// 	img: '/static/icon_rj5jpyh9xsb/comment.png',
					// 	value: 0,
					// 	offset: [0, 0],
					// 	url: '/pages/my/my_order/my_order?status=4'
					// },
					{
						label: '退款/售后',
						img: '/static/icon_rj5jpyh9xsb/refund.png',
						value: 0,
						offset: [0, 6],
						url: '/pages/my/refund_order/refund_order?active=1'
					},
				]
			};
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
			}),
			show_nickname() {
				if (!this.is_login) {
					return '点击注册/登录'
				}
				let str = this.userinfo.vip_name || '游客'
				str += ' | '
				str += this.userinfo.nickname || '微信用户'
				return str
			}
		},
		onShow() {
			if (this.is_login) {
				axios.get('/api/v1/user/info').then(res => {
					console.log(res)
					if (res.code === 1) {
						let {
							integral_available,
							teams_count,
							coupon_count,
							auth
						} = res.data
						this.integral_available = integral_available
						this.teams_count = teams_count
						this.coupon_count = coupon_count
						if (auth > 0) {
							this.menu[5].show = true
						}
					}
				})
				axios.get('/api/v1/user/order/total').then(res => {
					console.log(res)
					this.order_menu[0].value = res.data.t2
					this.order_menu[1].value = res.data.t4
					this.order_menu[2].value = res.data.t5
					this.order_menu[3].value = res.data.refund
				})
				axios.get('/api/v1/admin/backlog').then(res => {
					this.$set(this.menu[5], 'redHot', res.data.bed_service > 0 || res.data.intend_customers > 0)
				})
			}
		},
		onShareAppMessage: function(options) {
			console.log(options)
		},
		methods: {

		}
	}
</script>

<style lang="scss" scoped>

	.my_head_bg_box {
		position: absolute;
		top: 0;

		image {
			width: 100vw;
			height: 347rpx;
		}
	}

	.text-ee {
		font-size: 26rpx;
	}

	.my_head_box {
		height: 347rpx;
		width: 750rpx;
		display: flex;
		justify-content: center;
		background-color: #fff;
		align-items: center;

		.my_head_box_item {
			z-index: 99;
			display: flex;
			flex-direction: column;
			align-items: center;

			.headimg-box {
				background-color: #fff;
				width: 114rpx;
				height: 114rpx;
				border-radius: 50%;
			}

			.nickname {
				font-size: 30rpx;
				color: #fff;
				margin-top: 8rpx;
			}
		}
	}

	.my-integ-border {
		border-right: 1px solid #021F47;
	}

	.my_menu_item {
		width: 645rpx;
		margin-left: 55rpx;
		background-color: #FAFAFA;
		height: 69rpx;
		margin-top: 38rpx;

		image {
			width: 104rpx;
			height: 69rpx;
			margin-left: 6rpx;
		}

		.my_menu_item_right_icon {
			margin-left: auto;
			margin-right: 56rpx;
		}
	}



	// 分割线

	.grid-box {
		width: 690rpx;
		margin: 10rpx 0;
		background-color: #fff;
		color: #666666;
		border-radius: 10rpx;
		padding: 10rpx 0;
	}

	.grid-box.first {
		margin-top: 20rpx;
	}

	.grid-box>view {
		font-size: 28rpx;
		padding: 20rpx 0 0 30rpx;
	}


	.menu {
		width: 250rpx;
	}

	.menu:last-child {
		border: none;
	}
</style>