<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入订单号查询" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<view v-for="(item,index) in list" :key="item.id" class="bg-white margin-bottom-sm"
				style="padding: 10rpx 20rpx;">
				<view class="flex justify-between align-center">
					<view>
						<view>订单编号：{{item.order_no}}</view>
						<view class="text-xs text-desc">{{item.create_at}}</view>
					</view>
					<view v-if="item.status == 1" class="text-bold">待付款</view>
					<view v-if="item.status == 0" class="text-bold">已取消</view>
				</view>

				<u-line margin="10rpx 0"></u-line>

				<view v-for="(val, idx) in item.items" :key="val.id" class="padding-left-sm padding-bottom-sm">
					<view>床具编号：{{val.bed.sn_s_sn}}</view>
					<view>床具名称：{{val.bed.name}}</view>
					<view>床具款式：{{val.bed.model}}</view>
					<view>联 系 人：{{val.user_name}} {{val.user_phone}}</view>
					<view>服务地址：{{val.user_province}}{{val.user_city}}{{val.user_area}}{{val.user_address}}</view>
					<view>服务时间：{{val.server_date}}{{val.server_pm}}</view>
					<view v-if="val.status > 1">服务状态：{{val.status == 2 ? '待确认': val.status == 3 ? '待服务':'已完成'}}</view>
					<view v-if="val.status == 3" style="padding: 10rpx 0;" class="flex">
						<view>
							<u-button type="primary" size="small" :data-parent_index="index" :data-index="idx"
								:data-order_no="val.order_no" @click.native="receive" text="服务确认"
								custom-style="border-radius:10rpx;"></u-button>
						</view>
						
					</view>
				</view>
				<u-line margin="10rpx 0"></u-line>
				<view style="text-align: right;padding: 0 10rpx 20rpx 0;">
					<text>共 ￥<text style="font-size: 26rpx;">{{item.order_amount_total}}</text></text>
					<text v-if="item.order_amount_discount != '0.00'" style="margin-left: 6rpx;"> 优惠 ￥<text
							style="font-size: 26rpx;">{{item.order_amount_discount}}</text></text>
					<text v-if="item.order_amount_real != '0.00'" style="margin-left: 6rpx;"> 需付款 ￥<text
							style="font-size: 26rpx;">{{item.order_amount_real}}</text></text>
				</view>
				<view style="padding: 0 10rpx 20rpx 0;" class="flex justify-end align-center">
					<view v-if="item.status === 0">
						
						<button type="warn" size="mini" :data-index="index" @click="remove"
							style="border-radius:10rpx;">删除</button>
					</view>
					<view v-if="item.status === 1" style="margin-left: 6rpx;">
						<u-button type="default" size="small" :data-index="index" @click.native="cancel"
							customStyle="border-radius:10rpx;" text="取消订单"></u-button>
					</view>
					<view v-if="item.status === 1" style="margin-left: 6rpx;">
						<u-button type="primary" size="small" :data-index="index" @click.native="pay"
							customStyle="border-radius:10rpx;" text="付款"></u-button>
					</view>
				</view>
			</view>
			<view>
				<block v-if="status == 'nomore' && list.length < 1">
					<u-empty text="暂无数据" icon="/static/empty_data.png">
					</u-empty>
				</block>
				<u-loadmore :status="status" v-else />
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
				value: '',
				list: [],
				page: 1,
				loading: false,
				loaded: false,
				status: 'loadmore'
			};
		},
		onLoad(options) {
			checkLogin(() => {
				this.loadData()
			})
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			remove(e) {
				console.log(e)
				uni.showModal({
					content: '确认删除订单吗？',
					showCancel: true,
					cancelText: "取消",
					cancelColor: '#000000',
					confirmText: '确定',
					confirmColor: '#3CC51F',
					success: res => {
						if (res.confirm) {
							let index = e.currentTarget.dataset.index
							axios.post('/api/v1/user/beds/server/remove', {
								order_no: this.list[index].order_no
							}).then(res => {
								if (res.code === 1) {
									uni.showToast({
										title: res.info,
										duration: 1200,
									})
									setTimeout(() => {
										let list = this.list
										list.splice(index, 1)
										this.list = list
									}, 1200)

								} else {
									wuni.showToast({
										title: res.info,
										icon: 'none',
										duration: 1200,
									})
								}
							}).catch(err => {
								uni.showToast({
									title: "出错了！",
									icon: 'none',
									duration: 1200,
								})
							})
						}
					}
				})
			},
			receive(e) {
				uni.showModal({
					content: '确认服务已完成吗？',
					success: res => {
						if (res.confirm) {
							let parent_index = e.currentTarget.dataset.parent_index
							let index = e.currentTarget.dataset.index
							axios.post('/api/v1/user/beds/server/receive', {
								order_no: this.list[parent_index].items[index].order_no
							}).then(res => {
								if (res.code === 1) {
									uni.showToast({
										title: res.info,
										duration: 1200,
									})
									this.list[parent_index].items[index].status = 4
								} else {
									uni.showToast({
										title: res.info,
										icon: 'none',
										duration: 1200,
									})
								}
							}).catch(err => {
								uni.showToast({
									title: "出错了！",
									icon: 'none',
									duration: 1200,
								})
							})
						}
					}
				})
			},
			cancel(e) {
				uni.showModal({
					content: '确认取消订单吗？',
					success: res => {
						if (res.confirm) {
							let index = e.currentTarget.dataset.index
							axios.post('/api/v1/user/beds/server/cancel', {
								order_no: this.list[index].order_no
							}).then(res => {
								if (res.code === 1) {
									uni.showToast({
										title: res.info,
										duration: 1200,
									})
									this.list[index].status = 0
								} else {
									uni.showToast({
										title: res.info,
										icon: 'none',
										duration: 1200,
									})
								}
							}).catch(err => {
								uni.showToast({
									title: "出错了！",
									icon: 'none',
									duration: 1200,
								})
							})
						}
					}
				})
			},
			pay(e) {
				let index = e.currentTarget.dataset.index
				axios.post('/api/v1/user/beds/server/payment', {
					order_no: this.list[index].order_no
				}).then(res => {
					if (res.code === 1) {
						uni.requestPayment({
							provider: 'wxpay',
							...res.data.param,
							success: (red) => {
								if (red.errMsg == "requestPayment:ok") {
									setTimeout(() => {
										this.list[index].status = 2
									}, 200)
								}
							},
						})
					} else {
						uni.showToast({
							title: res,
							info,
							icon: 'none',
							duration: 1200
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '出错了',
						icon: 'none',
						duration: 1200
					})
				})
			},
			loadData() {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'
				axios.get('api/v1/user/beds/server', {
					params: {
						page: this.page,
						keyword: this.value
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.status = res.data.page.pages <= res.data.page.current ? 'nomore' : 'loadmore'
						this.page++
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						})
					}
				})
			},
			onClick() {
				this.list = []
				this.page = 1
				this.status = 'loadmore'
				this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>