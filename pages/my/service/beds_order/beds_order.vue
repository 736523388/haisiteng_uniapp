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
			<view class="container margin-top-sm padding-sm bg-white" v-for="(item,index) in list" :key="item.id">
				<view>
					<view class="text-bold">销售信息</view>
					<view>
						<view>销售单号：{{item.order_no}}</view>
						<view>销售日期：{{item.sale_date}}</view>
						<block v-if="item.store">
							<view>门店名称：{{item.store.name}}</view>
							<view>门店电话：{{item.store.telephone}}</view>
						</block>
					</view>
				</view>
				<view class="margin-top-sm">
					<view class="text-bold">床具基础信息</view>
					<view>
						<view>国家：中国</view>
						<view>国家：中国</view>
						<view>编号：{{item.beds.sn_s_sn}}</view>
						<view>名称：{{item.beds.name}}</view>
						<view>颜色：{{item.beds.color}}</view>
						<view>硬度：{{item.beds.hardness}}</view>
						<view>款式：{{item.beds.model}}</view>
						<view>组件：{{item.beds.type}}</view>
					</view>
				</view>
				<view class="margin-top-sm">
					<view class="text-bold">客户信息</view>
					<view>
						<view>姓名：{{item.user_name}}</view>
						<view>电话：{{item.user_phone}}</view>
						<view>地址：{{item.user_province}}{{item.user_city}}{{item.user_area}}{{item.user_address}}</view>
						<view>领取情况：{{item.status == 0 ? '未领取':'已领取'}}</view>
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
			<view style="height: 160rpx;"></view>
		</view>
		<view class="operate-box">
			<u-button shape="circle" type="primary"
				@click="$globalJump2View('/pages/my/service/add_beds_order/add_beds_order')" text="添加床具订单"></u-button>
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
						<u-button type="primary" @click="chooseDateConfirm">确认</u-button>
					</view>
					<view style="width: 45%;">
						<u-button type="default" @click="chooseDateReset">重置</u-button>
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
		},
		onShow(){
			this.list = []
			this.page = 1
			this.status = 'loadmore'
			this.loadData()
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
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
				axios.get("/api/v1/admin/beds_order", {
					params: {
						sn: this.value,
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