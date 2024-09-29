<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="header-box">
				<view class="order-status">
					<view class="order-status-title">
						<text style="margin-left: 8rpx;">{{order_status_txt_arr[order_desc.status] || ''}}</text>
					</view>
					<view class="order-status-desc">{{order_status_desac_arr[order_desc.status] || ''}}</view>
				</view>
			</view>
			<view class="bg-white">
				<view class="goods-box">
					<view class="goods-item" v-for="(item, index) in order_desc.items" :key="index">
						<u-image width="161rpx" height="161rpx" :src="item.goods_cover"></u-image>
						<view class="goods-title-price">
							<view class="goods-title">
								<view class="van-multi-ellipsis--l2">{{item.goods_name}}</view>
							</view>
							<view class="goods-price">
								<view class="price_selling">¥<text>{{item.price_selling}}</text></view>
								<view>× {{item.stock_sales}}</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white">
				<u-cell-group :border="false">
					<u-cell :border="false" title="商品总金额" :value="'¥'+order_desc.goods_amount_total_original"></u-cell>
					<u-cell :border="false" title="活动优惠" :value="'- ¥'+order_desc.goods_activity_discount_amount"></u-cell>
					<u-cell :border="false" title="积分抵扣" :value="'- ¥'+order_desc.amount_integral"></u-cell>
					<u-cell :border="false" title="运费" :value="order_desc.amount_express > 0 ?'¥'+order_desc.amount_express:'包邮'"></u-cell>
					<u-cell :border="false" title="需付款：" :value="'¥'+order_desc.amount_real"></u-cell>
				</u-cell-group>
			</view>
			<view class="container-xl bg-white padding-sm margin-top radius-xs">
				<view class="flex align-center justify-between padding-tb-xs">
					<view>订单编号</view>
					<view class="flex align-center">
						<view>{{order_desc.order_no}}</view><view class="copy" @click="copyOrderNo">复制</view>
					</view>
				</view>
				<view class="flex align-center justify-between padding-tb-xs">
					<view>下单时间</view>
					<view>{{order_desc.create_at}}</view>
				</view>
				<view class="flex align-start justify-between padding-tb-xs">
					<view style="min-width: 200rpx;">收货信息</view>
					<view style="text-align: right;">{{order_desc.truck.address_name}}，{{order_desc.truck.address_phone}}，{{order_desc.truck.address_province}}{{order_desc.truck.address_city}}{{order_desc.truck.address_area}}{{order_desc.truck.address_content}}</view>
				</view>
				<view class="flex align-center justify-between padding-tb-xs">
					<view>留言</view>
					<view>{{order_desc.order_remark || '无'}}</view>
				</view>
			</view>
			<view style="height: 134rpx;"></view>
			<view class="action-fiexd">
				<view class="margin-right-sm" v-if="order_desc.status === 0" style="display: inline-block;">
					<u-button type="error" size="small" :data-order_no="order_desc.order_no" @click.native.stop="remove"
						text="删除" plain shape="circle"></u-button>
				</view>
				<view class="margin-right-sm"
					v-if="order_desc.status === 1 || order_desc.status === 2 || order_desc.status === 3"
					style="display: inline-block;">
					<u-button type="info" size="small" :data-order_no="order_desc.order_no" @click.native.stop="cancel"
						text="取消订单" shape="circle"></u-button>
				</view>
				<view class="margin-right-sm" v-if="order_desc.status === 2" style="display: inline-block;">
					<u-button type="primary" size="small" :data-order_no="order_desc.order_no" @click.native.stop="pay"
						text="付款" shape="circle"></u-button>
				</view>
				<view class="margin-right-sm" v-if="order_desc.status === 5" style="display: inline-block;">
					<u-button type="primary" size="small" :data-order_no="order_desc.order_no"
						@click.native.stop="receive" text="确认收货"></u-button>
				</view>
				<view class="margin-right-sm" v-if="order_desc.status > 4" style="display: inline-block;">
					<button type="default" size="mini" @click.stop="$globalJump2View('/pages/my/logistics/logistics?order_no='+order_desc.order_no)">查看物流</button>
				</view>
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
				orderid: '',
				order_desc: {},
				order_status_txt_arr: ['已取消', '待支付', '待支付', '支付中', '待发货', '待收货', '已完成'],
				order_status_icon_arr: ['warning-o', 'tosend', 'tosend', 'pending-payment', 'paid', 'logistics',
					'comment-o', 'notes-o'
				],
				order_status_desac_arr: ['订单已取消，感谢您的支持', '等待付款，请在半小时内支付', '等待付款，请在半小时内支付', '等待付款，请在半小时内支付',
					'订单已支付，稍后为您安排发货', '订单配送中，请留意签收~', '订单已收货，请进行评价哦~', '订单已完成，感谢您的支持'
				]
			};
		},
		onLoad(options) {
			this.orderid = options.id || ''
			this.loadData()
		},
		methods: {
			loadData() {
				axios.get('/api/v1/user/order?order_no=' + this.orderid).then(res => {
					if (res.code === 1) {
						this.order_desc = res.data.list[0]
						this.$nextTick(() => {
							this.loaded = true
						})
						console.log(this.order_desc)
					}

				}).catch(error => {})
			},
			cancel(e) {
				uni.showModal({
					title: '提示',
					content: '确认取消订单吗？',
					success: res => {
						if (res.confirm) {
							let order_no = e.currentTarget.dataset.order_no
							axios.get('/api/v1/user/order/cancel', {
								params: {
									order_no
								}
							}).then(ref => {
								uni.showToast({
									title: ref.info,
									icon: 'none',
									duration: 1500,
								})
								if (ref.code === 1) {
									setTimeout(() => {
										this.loadData()
									}, 1500)
								}
							}).catch(err => {
								uni.showToast({
									title: "网络异常，请稍后再试！",
									icon: 'none',
									duration: 1500,
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			remove(e) {
				uni.showModal({
					title: '提示',
					content: '订单删除后无法找回，是否确认？',
					success: res => {
						if (res.confirm) {
							let order_no = e.currentTarget.dataset.order_no
							axios.get('/api/v1/user/order/remove', {
								params: {
									order_no
								}
							}).then(ref => {
								uni.showToast({
									title: ref.info,
									icon: 'none',
									duration: 1500,
								})
								if (ref.code === 1) {
									setTimeout(() => {
										uni.navigateBack()
									}, 1500)
								}
							}).catch(err => {
								uni.showToast({
									title: "网络异常，请稍后再试！",
									icon: 'none',
									duration: 1500,
								})
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			pay(e) {
				axios.post('/api/v1/user/order/payment', {
					order_no: e.currentTarget.dataset.order_no,
				}).then(res => {
					if (res.code === 1) {
						uni.requestPayment({
							provider: 'wxpay',
							...res.data.param,
							success: red => {
								if (red.errMsg == "requestPayment:ok") {
									setTimeout(() => {
										this.loadData()
									}, 200)
								}
							},
						})
					} else {
						setTimeout(() => {
							uni.showToast({
								title: res.info,
								icon: 'none'
							})
						}, 200)
					}
				}).catch(err => {
					setTimeout(() => {
						uni.showToast({
							title: '网络异常，请稍后再试！',
							icon: 'none'
						})
					}, 200)
				})
			},
			receive(event) {
				let {
					order_no
				} = event.currentTarget.dataset
				uni.showLoading({
					title: '请稍后~'
				})
				axios.get('/api/v1/user/order/receive', {
					params: {
						order_no
					}
				}).then(res => {
					uni.showToast({
						title: res.info,
						icon: 'none',
						duration: 1500,
					})
					if (res.code === 1) {
						setTimeout(() => {
							this.loadData()
						}, 1500)
					}
				}).finally(() => {
					uni.hideLoading()
				})
			},
			// 评价
			appraise: function(e) {
				const {
					order_no
				} = e.currentTarget.dataset
				uni.navigateTo({
					url: '/pages/my/appraise/appraise?order_no=' + order_no,
				})
			},
			copy: function(e) {
				var that = this;
				uni.setClipboardData({
					data: that.order_desc.truck.send_number,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000,
						})
					}
				})
			},
			copyOrderNo() {
				var that = this;
				uni.setClipboardData({
					data: that.order_desc.order_no,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 2000,
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.header-box {
		position: relative;
		height: 235rpx;
	}

	.background-image {
		z-index: -1;
		position: absolute !important;
		top: 0;
	}

	.order-status {
		// color: #fff;
		padding-top: 30rpx;
		margin: 0 auto;
		text-align: center;
	}

	.order-status .order-status-title {
		font-size: 32rpx;
	}

	.express {
		position: absolute;
		top: 170rpx;
		left: 20rpx;
		width: 710rpx;
	}

	.truck {
		padding-top: 80rpx;
		width: 710rpx;
		margin: 0 auto;
	}

	.order-card {
		background-color: #fff;
		border-radius: 20rpx;
		box-sizing: border-box;
		padding: 20rpx;
		display: flex;
		align-items: flex-start;
		font-size: 28rpx;
		border: 1px solid #f8f8f8;
		// box-shadow: 1px 2px 2px hsl(0deg 0% 0% / 0.1);
	}

	.order-card-icon {
		padding-top: 4rpx;
		margin-right: 10rpx;
	}

	.copy-btn {
		margin-left: 20rpx;
	}

	.goods-box {
		width: 710rpx;
		margin: 0 auto;
		padding-bottom: 20rpx;
		margin-top: 30rpx;
	}

	.goods-item {
		display: flex;
		margin-bottom: 20rpx;
		height: 161rpx;
		box-sizing: border-box;
	}

	.goods-title-price {
		width: 529rpx;
		box-sizing: border-box;
		padding-left: 20rpx;
		height: 161rpx;
	}

	.goods-title {
		height: 125rpx;
	}

	.goods-price {
		height: 36rpx;
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.price_selling {
		font-size: 24rpx;
	}

	.price_selling>text {
		font-size: 32rpx;
		padding-left: 8rpx;
		font-weight: bold;
	}

	.contact-btn {
		color: #4B5563 !important;
	}

	.end_box {
		padding-bottom: calc(env(safe-area-inset-bottom) + 114rpx);
	}

	.action-fiexd {
		background-color: #fff;
		position: fixed;
		height: 114rpx;
		width: 100%;
		bottom: 0;
		padding-bottom: env(safe-area-inset-bottom);
		box-sizing: border-box;
		text-align: right;
		padding: 27rpx 10rpx 0 0;
	}
	.copy{
		position: relative;
		padding-left: 24rpx;
		&::before{
			content: " ";
			position: absolute;
			left: 10rpx;
			height: 70%;
			width: 1px;
			top: 15%;
			background-color: #000;
			transform: scaleX(0.5);
			transform-origin: 50% 100%;
		}
	}
	
</style>