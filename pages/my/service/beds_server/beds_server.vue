<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view @click="show=true"
							style="padding-left:24rpx;padding-right:24rpx;align-self:center;border-right: 1px solid #000030;">
							{{chooseDateActive !== '' ?'已':''}}筛选
						</view>
						<view class="flex" style="width: 100%;border-radius: 6rpx;flex: 1;">
							<view style="flex: 1;">
								<u-search placeholder="请输入床具的sn" :showAction="true" actionText="搜索" :animation="false"
									bgColor="#fff" v-model="value" @custom="onClick"></u-search>
							</view>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<view v-for="(item,index) in list" :key="item.id" class="bg-white solid-bottom margin-top-sm"
				style="padding: 10rpx 20rpx;">

				<view class="flex justify-between align-center">
					<view>
						<view>订单编号：{{item.order_no}}</view>
						<view class="text-xs text-desc">{{item.create_at}}</view>
					</view>
					<view class="text-bold">
						{{item.status == 2 ? '待确认':item.status == 3 ?'服务中':'已完成'}}
					</view>
				</view>
				<u-line margin="20rpx 0"></u-line>

				<view>床具编号：{{item.bed.sn_s_sn}}</view>
				<view>床具名称：{{item.bed.name}}</view>
				<view>床具款式：{{item.bed.model}}</view>
				<view>床具组件：{{item.bed.type}}</view>
				<view>床具尺寸：{{item.bed.size}}</view>
				<view>床具硬度：{{item.bed.herdness}}</view>
				<view>床具颜色：{{item.bed.color}}</view>
				<view>联系人：{{item.user_name}} {{item.user_phone}}</view>
				<view>服务地址：{{item.user_province}}{{item.user_city}}{{item.user_area}}{{item.user_address}}</view>
				<view>服务时间：{{item.server_date}}{{item.server_pm}}</view>
				<view style="text-align: right;padding: 0 10rpx 20rpx 0;">
					<text>共 ￥<text style="font-size: 26rpx;">{{item.order_amount_total}}</text></text>
					<text style="margin-left: 10rpx;" v-if="item.order_amount_discount != '0.00'"> 优惠 ￥<text
							style="font-size: 26rpx;">{{item.order_amount_discount}}</text></text>
					<text style="margin-left: 10rpx;" v-if="item.order_amount_real != '0.00'"> 已付款 ￥<text
							style="font-size: 26rpx;">{{item.order_amount_real}}</text></text>
				</view>
				<view style="padding: 0 10rpx 20rpx 0;" class="flex justify-end align-center">
					<view v-if="item.status === 2">
						<u-button custom-style="border-radius:10rpx;" type="primary" size="small"
							@click="confirm(index)" text="确认"></u-button>
					</view>
				</view>
			</view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty text="暂无数据" icon="/static/empty_data.png"></u-empty>
			</block>
			<u-loadmore :status="status" v-else />
			<view style="height: 160rpx;"></view>
		</view>
		<u-popup :show="show" @close="close" closeOnClickOverlay mode="left">
			<view class="padding chooseDate">
				<view class="text-sm margin-bottom-sm flex">
					<view>按时间</view>
					<block v-if="chooseDateActive !== ''">
						<view class="text-bold" style="margin-left: auto;">{{chooseDateList[chooseDateActive].label}}
						</view>
					</block>
				</view>
				<view class="flex flex-wrap text-sm text-center">
					<view @click="chooseDate(index)" v-for="(item,index) in chooseDateList" :key="item.label"
						class="margin-right-xs margin-bottom-sm date_choose"
						:class="{active: chooseDateActive === index}">{{item.label}}</view>
				</view>
				<view class="flex justify-around van-hairline--top padding-top-sm margin-top-sm">
					<view style="width: 45%;">
						<u-button type="primary" @click="chooseDateConfirm" text="确认"></u-button>
					</view>
					<view style="width: 45%;">
						<u-button type="default" @click="chooseDateReset" text="重置"></u-button>
					</view>


				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				show: false,
				value: '',
				page: 1,
				list: [],
				status: 'loadmore',
				chooseDateActive: '',
				chooseDateList: [{
						label: '1个月内'
					},
					{
						label: '3个月内'
					},
					{
						label: '6个月内'
					},
					{
						label: '今年'
					}
				]
			};
		},
		onLoad() {
			const now = new Date();
			const year = now.getFullYear();
			const chooseDateList = this.chooseDateList
			for (let i = 1; i < 7; i++) {
				chooseDateList.push({
					label: (year - i).toString() + '年'
				})
			}
			this.chooseDateList = chooseDateList
			this.loadData()
		},
		methods: {
			onClick() {
				this.list = []
				this.page = 1
				this.status = 'loadmore'
				this.loadData()
			},
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get("/api/v1/admin/beds/server", {
					params: {
						keyword: this.value,
						page: this.page,
						limit: 10,
						date: this.chooseDateActive !== '' ? this.chooseDateActive + 1 : ''
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore'
					}
				}).catch(error => {
					this.$u.toast("出错了，请稍后重试!", 1200)
				})
			},
			close() {
				this.show = false
			},
			chooseDate(index) {
				this.chooseDateActive = index
			},
			chooseDateConfirm() {
				this.show = false
				setTimeout(() => {
					this.onClick()
				}, 300)
			},
			chooseDateReset() {
				this.chooseDateActive = ''
			},
			confirm(index) {
				console.log(index)
				uni.showModal({
					content: '确认接单吗？',
					success: ref => {
						if (ref.confirm) {
							axios.post('/api/v1/admin/beds/server/confirm', {
								order_no: this.list[index].order_no
							}).then(res => {
								if (res.code === 1) {
									uni.showToast({
										title: res.info,
										duration: 1200,
									})
									setTimeout(() => {
										this.$set(this.list[index], 'status', 3)
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
									title: "出错了！",
									icon: 'none',
									duration: 1200,
								})
							})
						}
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.operate-box {
		position: fixed;
		bottom: 0;
		padding: 30rpx;
		/* padding-bottom: 30rpx;
  padding-top: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx; */
		width: 100%;
		text-align: center;
		background-color: #fff;
		z-index: 5;
	}

	.chooseDate {
		width: 640rpx;
		height: 100%;
	}

	.date_choose {
		background-color: #e5e5e5;
		border-radius: 50rpx;
		width: 30%;
		padding: 10rpx 0;
	}

	.date_choose.active {
		background-color: #000030;
		color: #fff;
	}

	.hst-search {
		padding: 0 !important;
	}
</style>