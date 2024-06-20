<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="header-box">
				<u-image width="750rpx" height="235rpx"
					src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/my_bg.jpg"></u-image>
				<view class="order-status">
					<view class="order-status-title">
						<text style="margin-left: 8rpx;">{{order_status_txt_arr[order_desc.status] || ''}}</text>
					</view>
					<view class="order-status-desc">{{order_status_desac_arr[order_desc.status] || ''}}</view>
				</view>
				<view class="express" v-if="order_desc.status && order_desc.status > 2">
					<view class="order-card">
						<view class="order-card-icon">
							<u-icon name="car-fill" />
						</view>
						<view>
							<view style="padding-bottom: 10rpx;">物流快递：{{order_desc.truck.company_name}}</view>
							<view>快递单号：{{order_desc.truck.send_number}}
								<view style="display: inline-block;"><u-tag @click="copy" type="warning" plain
										shape="circle" color="#9CA3AF" text="复制"></u-tag></view>

							</view>
						</view>
					</view>
				</view>

			</view>
			<view style="background-color: #fff;">
				<view class="truck">
					<view class="order-card">
						<view class="order-card-icon">
							<u-icon name="map" />
						</view>
						<view>
							<view style="padding-bottom: 10rpx;">{{order_desc.truck.address_name}}<text
									style="margin-left: 8rpx;">{{order_desc.truck.address_phone}}</text></view>
							<view>
								地址：{{order_desc.truck.address_province}}{{order_desc.truck.address_city}}{{order_desc.truck.address_area}}{{order_desc.truck.address_content}}
							</view>
						</view>
					</view>
				</view>
				<view class="van-hairline--bottom goods-box">
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
				<view>
					<!-- <u-button open-type="contact" custom-class="contact-btn" color="#fff" icon="chat-o" size="large"
						type="default">联系客服</u-button> -->
				</view>
			</view>
			<view style="background-color: #fff;margin-top: 20rpx;">
				<u-cell-group>
					<u-cell>
						<view slot="title">
							<text>订单编号：{{order_desc.order_no}}</text>
							<view style="display: inline-block;"><u-tag @click="copyOrderNo" type="warning" plain
									shape="circle" color="#9CA3AF" text="复制"></u-tag></view>
						</view>
					</u-cell>
					<u-cell :title="'下单时间：' + order_desc.create_at" />
					<u-cell title="配送方式：普通快递"></u-cell>
					<u-cell :title="'留    言：' + (order_desc.order_remark || '无')"></u-cell>
				</u-cell-group>
			</view>
			<view class="end_box" style="background-color: #fff;margin-top: 20rpx;">
				<u-cell-group>
					<u-cell title="商品总额" :value="'¥ '+order_desc.amount_goods"></u-cell>
					<u-cell title="运费" :value="'+ ¥ '+order_desc.amount_express"></u-cell>
					<u-cell title="需付款：" :value="'¥ '+order_desc.amount_total"></u-cell>
				</u-cell-group>
			</view>
			<view class="action-fiexd van-hairline--top">
				<view v-if="order_desc.status === 0"
					style="border-radius:10rpx;margin-left:20rpx;display: inline-block;">
					<u-button type="error" size="small" :data-order_no="order_desc.order_no" @click.native.stop="remove"
						text="删除"></u-button>
				</view>
				<view v-if="order_desc.status === 1 || order_desc.status === 2 || order_desc.status === 3"
					style="border-radius:10rpx;margin-left:20rpx;display: inline-block;">
					<u-button size="small" :data-order_no="order_desc.order_no" @click.native.stop="cancel"
						text="取消订单"></u-button>
				</view>
				<view v-if="order_desc.status === 2"
					style="border-radius:10rpx;margin-left:20rpx;display: inline-block;">
					<u-button type="success" size="small" :data-order_no="order_desc.order_no" @click.native.stop="pay"
						text="付款"></u-button>
				</view>
				<view v-if="order_desc.status === 5"
					style="border-radius:10rpx;margin-left:20rpx;display: inline-block;">
					<u-button type="primary" size="small" :data-order_no="order_desc.order_no"
						@click.native.stop="receive" text="确认收货"></u-button>
				</view>
				<view v-if="order_desc.status > 4" style="border-radius:10rpx;margin-left:20rpx;display: inline-block;">
					<u-button size="small" :data-code="order_desc.truck.company_code"
						:data-number="order_desc.truck.send_number" @click.native.stop="skip_logistic"
						text="查看物流"></u-button>
				</view>
				<view v-if="order_desc.status === 6"
					style="border-radius:10rpx;margin-left:20rpx;width: 130rpx;display: inline-block;">
					<u-button size="small" :data-order_no="order_desc.order_no" @click.native.stop="appraise"
						text="去评价"></u-button>
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
				//(0已取消,1预订单,2待支付,3支付中,4已支付,5已发货,6已完成,7已评价)
				order_status_txt_arr: ['已取消', '待支付', '待支付', '待支付', '待发货', '待收货', '待评价', '已完成'],
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
						console.log(this.order_desc)
					}

				}).finally(() => {
					this.loaded = true
				})
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
			// 跳转到物流页面
			skip_logistic: function(e) {
				console.log(e)
				const {
					code,
					number
				} = e.currentTarget.dataset
				uni.navigateTo({
					url: `/pages/my/logistics/logistics?code=${code}&number=${number}`,
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
			      success: function (res) {
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
		color: #fff;
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
</style>