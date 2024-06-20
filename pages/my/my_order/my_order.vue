<template>
	<view>
		<u-sticky bgColor="#fff">
			<u-tabs ref="tabs" keyName="label" :list="orderMenu" :scrollable="false" lineColor="#000030"
				:current="active" @change="tabsChange">
			</u-tabs>
		</u-sticky>

		<view>
			<view v-for="(item,index) in orderMenu" :key="item.label">
				<view @click="$globalJump2View('/pages/my/my_order_detail/my_order_detail?id='+value.order_no, true)"
					class="bg-white margin-bottom-sm padding-tb-xs padding-lr-sm" v-if="index === active"
					v-for="(value, key) in item.list" :key="value.id">
					<view class="flex justify-between align-center margin-bottom">
						<view>
							<view>订单编号：{{value.order_no}}</view>
							<!-- <view class="text-xs text-gray">{{value.create_at}}</view> -->
						</view>
						<view class="flex flex-direction text-right">
							<view class="text-sm">{{value.statusTxt}}</view>
							<!-- <view class="text-xs" v-if="value.status === 2 && value.await_pay_time > 0">
								剩余时间{{value.await_pay_time}}分钟</view> -->
						</view>
					</view>
					<!-- <u-line margin="20rpx 0"></u-line> -->
					<view v-for="(v,k) in value.items" class="flex" :key="v.id">
						<view>
							<image mode="aspectFill" style="height: 150rpx;width: 150rpx;" :src="v.goods_cover">
							</image>
						</view>

						<view class="flex flex-direction" style="height: 150rpx;">
							<view class="u-line-2 padding-tb-xs padding-lr-sm text-sm" style="max-height: 78rpx;">
								{{v.goods_name}}{{v.goods_spec_alias}}
							</view>
							<view class="padding-tb-xs padding-lr-sm">
								<view>
									<text class="text-sm">数量：{{v.stock_sales}}</text>
								</view>
							</view>
						</view>

					</view>
					<view class="text-right" style="padding: 0 10rpx 20rpx 0;">
						<text class="text-sm"> ￥<text
								class="text-lg">{{value.total_order_amount}}</text>.{{value.total_order_amount_ceil}}</text>
						<text class="text-sm margin-left-xs">共{{value.number_goods}}件</text>

					</view>
					<view style="padding: 0 10rpx 20rpx 0;" class="flex justify-end align-center">
						<view v-if="value.status === 0" class="margin-left-sm">
							<u-button type="primary" @click.native.stop="remove" text="删除订单"
								:data-order_no="value.order_no" size="small" plain shape="circle"></u-button>
						</view>
						<view v-if="value.status === 1 || value.status === 2 || value.status === 3"
							class="margin-left-sm">
							<u-button type="info" text="取消订单" :data-order_no="value.order_no"
								@click.native.stop="cancel" size="small" plain shape="circle"></u-button>
						</view>
						<view v-if="value.status === 2" class="margin-left-sm">
							<u-button type="primary" text="付款" :data-order_no="value.order_no" @click.native.stop="pay"
								size="small" shape="circle"></u-button>
						</view>
						<view v-if="value.status === 4" class="margin-left-sm">
							<u-button type="error" text="申请退款" :data-order_no="value.order_no"
								@click.native.stop="$globalJump2View('/pages/my/refund_order/refund_order?value='+value.order_no, true)"
								size="small" plain shape="circle"></u-button>
						</view>
						<view v-if="value.status === 5" class="margin-left-sm">
							<u-button type="primary" text="确认收货" :data-order_no="value.order_no"
								@click.native.stop="receive" size="small" shape="circle"></u-button>
						</view>
						<view v-if="value.status > 4" class="margin-left-sm">
							<u-button type="primary" text="查看物流"
								@click.native.stop="$globalJump2View('/pages/my/logistics/logistics?code='+value.truck.company_code +'&number='+value.truck.send_number, true)"
								size="small" plain shape="circle"></u-button>
						</view>
						<view v-if="value.status === 6" class="margin-left-sm">
							<u-button type="error" text="申请售后" :data-order_no="value.order_no"
								@click.native.stop="$globalJump2View('/pages/my/refund_order/refund_order?value='+value.order_no, true)"
								size="small" plain shape="circle"></u-button>
						</view>
					</view>
				</view>
			</view>
		</view>

		<view class="padding-bottom">
			<u-loadmore status="loading" loadingIcon="circle" v-if="orderMenu[active].loading === true" />
			<u-empty marginTop="44" v-if="orderMenu[active].loaded === true && orderMenu[active].list.length === 0"
				text="暂无订单数据~" icon="/static/empty_data.png"></u-empty>
			<u-loadmore status="nomore" v-if="orderMenu[active].loaded === true && orderMenu[active].list.length > 0"
				nomore-text="没有更多订单了~" />
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
				orderMenu: [{
						label: '全部',
						status: '',
						list: [],
						page: 1,
						loading: false,
						loaded: false
					},
					{
						label: '待付款',
						status: 2,
						list: [],
						page: 1,
						loading: false,
						loaded: false
					},
					{
						label: '待发货',
						status: 4,
						list: [],
						page: 1,
						loading: false,
						loaded: false
					},
					{
						label: '待收货',
						status: 5,
						list: [],
						page: 1,
						loading: false,
						loaded: false
					},
					{
						label: '已完成',
						status: 6,
						list: [],
						page: 1,
						loading: false,
						loaded: false
					}
				],
				active: 0
			};
		},
		onLoad(options) {
			console.log(options)
			if (options.status) {
				this.active = Number(options.status)
			}
		},
		onShow() {
			this.loadData()
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			tabsChange(event) {
				console.log(event)
				this.active = event.index
				this.loadData()
			},
			loadData: function() {
				// 获取全部订单
				let menu = this.orderMenu[this.active]
				console.log(menu)
				if (menu.loaded !== false || menu.loading !== false) {
					return false
				}
				this.orderMenu[this.active].loading = true
				axios.get('/api/v1/user/order', {
					params: {
						page: menu.page,
						status: menu.status,
					}
				}).then(res => {
					this.orderMenu[this.active].loading = false
					let list = res.data.list
					for (let i in list) {
						list[i].statusTxt = ''
						if (list[i].status === 2) {
							list[i].statusTxt = '待付款'
						} else if (list[i].status === 4) {
							list[i].statusTxt = '待发货'
						} else if (list[i].status === 5) {
							list[i].statusTxt = '待收货'
						} else if (list[i].status === 6) {
							list[i].statusTxt = '已完成'
						} else if (list[i].status === 0) {
							list[i].statusTxt = '已取消'
						}
						list[i].total_order_amount = parseInt(list[i].amount_real || 0)
						list[i].total_order_amount_ceil = list[i].amount_real.substring(list[i].amount_real
							.indexOf(".") + 1, list[i].amount_real.indexOf(".") + 3)
					}
					this.orderMenu[this.active].page++
					this.orderMenu[this.active].list = this.orderMenu[this.active].list.concat(list)
					this.orderMenu[this.active].loaded = this.orderMenu[this.active].page >= res.data.page
						.pages
					console.log(this.orderMenu)
				})
			},
			//从列表移除订单
			reset2list(statusList) {
				for (let i in statusList) {
					let menu = this.orderMenu[statusList[i]]
					menu.list = [];
					menu.page = 1
					menu.loaded = false
					this.orderMenu[statusList[i]] = menu
				}
				this.loadData()
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
								if (ref.code === 1) {
									this.$u.toast(ref.info, 1200)
									setTimeout(() => {
										this.reset2list([0])
									}, 1200)
								} else {
									this.$u.toast(ref.info, 1500)
								}
							}).catch(err => {
								this.$u.toast('出错了', 1200)
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			pay(e) {
				uni.showLoading({
					title: '加载中...',
				})
				axios.post('/api/v1/user/order/payment', {
					order_no: e.currentTarget.dataset.order_no,
				}).then(res => {
					if (res.code === 1) {
						uni.requestPayment({
							provider: 'wxpay',
							...res.data.param,
							success: (red) => {
								if (red.errMsg == "requestPayment:ok") {
									setTimeout(() => {
										this.reset2list([0, 1]);
									}, 200)
								}
							},
						})
					} else {
						this.$u.toast(res.info, 1200)
					}
				}).catch(err => {
					this.$u.toast('出错了', 1500)
				}).finally(() => {
					wx.hideLoading()
				})
			},
			// 取消订单
			cancel: function(e) {
				uni.showModal({
					content: '确认取消订单吗？',
					success: res => {
						if (res.confirm) {
							let order_no = e.currentTarget.dataset.order_no
							axios.get('/api/v1/user/order/cancel', {
								params: {
									order_no
								}
							}).then(ref => {
								if (ref.code === 1) {
									this.$u.toast(ref.info, 1200)
									setTimeout(() => {
										this.reset2list([0, 1])
									}, 1200)
								} else {

									this.$u.toast(ref.info, 1200)
								}
							}).catch(err => {
								this.$u.toast("出错了！", 1200)
							})
						} else if (res.cancel) {
							console.log('用户点击取消')
						}
					}
				})
			},
			receive(event) {
				uni.showModal({
					title: '提示',
					content: '是否立即确认收货？',
					success: res => {
						if (res.confirm) {
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
								if (res.code === 1) {
									this.$u.toast(res.info, 1200)
									setTimeout(() => {
										this.reset2list([0, 3])
									}, 1200)
								} else {
									uni.showToast({
										title: res.info,
										icon: 'none',
										duration: 1200,
									})
								}
							}).catch(err => {
								uni.showToast({
									title: '出错了',
									icon: 'none',
									duration: 1200,
								})
							}).finally(() => {
								uni.hideLoading()
							})
						}
					}
				})

			},
		},

	}
</script>

<style lang="scss" scoped>
	page {
		width: 750rpx;
	}
</style>