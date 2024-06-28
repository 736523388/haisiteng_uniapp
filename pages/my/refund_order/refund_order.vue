<template>
	<view>
		<u-sticky bgColor="#fff">
			<u-tabs ref="tabs" keyName="label" :duration="0" :activeStyle="{
            color: '#303133',
            transform: 'scale(0.9)',
			fontWeight: 'bold',
			fontSize: '16px'
        }" :inactiveStyle="{
            color: '#606266',
            transform: 'scale(1)',
			fontSize: '14px'
        }" :list="menu" lineWidth="50" lineHeight="2" :scrollable="false" lineColor="#000030" :current="active"
				@change="tabsChange">
			</u-tabs>
		</u-sticky>
		<view style="z-index: 960;position: relative;">
			<!-- <view style="position: absolute;top: 0px;left:0;right:0;"><u-line color="#000030"></u-line></view> -->
			<view class="bg-white flex align-center">
				<view style="flex: 1;">
					<uni-search-bar v-model="value" radius="100" @focus="onSearchFocus" :placeholder="searchPlaceholder"
						@confirm="search" :focus="search_focus" @cancel="cancel" cancelButton="none" @clear="searchClear" />
				</view>
				<view style="padding-right: 10px;" class="text-sm">
					<text v-show="showCancel" @click="showCancel=false">取消</text>
					<view v-show="!showCancel" class="flex flex-direction align-center" @click="show=true">
						<image style="height: 24rpx;width: 24rpx;"
							:src="chooseDateActive !== '' ? '/static/icons/funnel_red.png':'/static/icons/funnel_black.png'">
						</image>
						<text v-if="chooseDateActive !== ''" style="color: #d81e06;">筛选</text>
						<text v-else>筛选</text>
					</view>
				</view>
			</view>
		</view>
		
		<view v-if="active === 0" class="bg-white margin-top-sm padding-tb-xs padding-lr-sm radius-sm container-xl"
			v-for="(item, index) in list" :key="item.id">
			<view v-for="(v,k) in item.items" :key="v.id">
				<view class="flex">
					<view>
						<image mode="aspectFill" style="height: 150rpx;width: 150rpx;" :src="v.goods_cover">
						</image>
					</view>
					<view class="flex flex-direction" style="height: 150rpx;">
						<view class="padding-tb-xs padding-lr-sm text-sm u-line-2" style="max-height: 76rpx;">
							{{v.goods_name}} 「{{v.goods_spec_alias}}」
						</view>
						<view class="padding-tb-xs padding-lr-sm">
							<view>
								<text class="text-xs">数量：{{v.stock_sales}}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="flex justify-between align-center padding-bottom padding-top-sm">
					<view class="text-sm text-grey">
						<view v-if="v.refund_status > 0"
							@click="$globalJump2View('/pages/my/refund_order_detail/refund_order_detail?id='+v.refund_id, true)">
							<text>该商品已申请售后</text>
							<uni-icons type="right" size="12" color="#808080"></uni-icons>
						</view>
						<view v-if="!v.refund_available && v.refund_status == 0" @click="showRefundOut(v.timeout_datetime)">
							<text>该商品已超过售后期</text>
							<uni-icons type="help-filled" size="12" color="#808080"></uni-icons>
						</view>
					</view>
					<view v-if="v.refund_available && item.status == 4">
						<u-button
							@click.native="$globalJump2View('/pages/my/refund_order_apply/refund_order_apply?id='+v.id, true)"
							type="error" size="small" shape="circle" plain text="申请退款"></u-button>
					</view>
					<view v-if="v.refund_available && item.status != 4">
						<u-button
							@click.native="$globalJump2View('/pages/my/refund_order_product_apply/refund_order_product_apply?id='+v.id, true)"
							type="error" size="small" shape="circle" plain text="申请售后"></u-button>
					</view>
					<view v-if="!v.refund_available && v.refund_status === 0">
						<u-button
							@click.native="showRefundOut(v.timeout_datetime)"
							type="primary" disabled size="small" shape="circle" plain text="申请售后"></u-button>
					</view>
					<view v-if="v.refund_status > 0">
						<u-button
							@click.native="$globalJump2View('/pages/my/refund_order_detail/refund_order_detail?id='+v.refund_id, true)"
							type="error" size="small" shape="circle" plain text="售后详情"></u-button>
					</view>
				</view>
			</view>
		</view>
		<view v-if="active !== 0" class="bg-white margin-top-sm radius-sm container-xl" v-for="(item, index) in list"
			:key="item.id">
			<view
				class="flex justify-between align-center u-border-bottom padding-top-sm padding-bottom-xs padding-lr-sm">
				<view class="text-sm">服务单号：{{item.code}}</view>
				<view><uni-icons type="shop" size="16"></uni-icons>{{item.type === 1 ? '退款':'退货退款'}}</view>
			</view>

			<view class="flex margin-top-sm padding-lr-sm">
				<view>
					<image mode="aspectFill" style="height: 150rpx;width: 150rpx;" :src="item.goods_cover">
					</image>
				</view>
				<view class="flex flex-direction">
					<view class="padding-tb-xs padding-lr-sm u-line-2 text-sm" style="max-height: 78rpx;">
						{{item.goods_name}} {{item.goods_spec_alias}}
					</view>
					<view class="padding-tb-sm padding-lr-sm flex justify-between align-center">
						<view class="text-sm">申请数量：<text style="color:#82848a;">{{item.refund_number}}</text></view>
						<view class="text-sm text-red" v-if="item.step_status == 10">已退款：￥{{item.real_refund_amount}}</view>
					</view>
				</view>
			</view>
			<view class="padding-lr-sm padding-bottom-xl">
				<view style="background-color: #f8f8f8;"
					class="flex padding-tb padding-lr-sm align-center radius-xs text-sm"
					@click="$globalJump2View('/pages/my/refund_order_detail/refund_order_detail?id='+item.id, true)">
					<view class="margin-right-xl">{{item.step_status_label}}</view>
					<view style="color:#82848a;">{{item.logs_content}}</view>
					<view style="margin-left: auto;"><uni-icons type="forward" size="14" color="#82848a"></uni-icons>
					</view>
				</view>
			</view>

		</view>
		<view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty mode="data" icon="/static/empty_data.png" :text="emptyDataTxt"></u-empty>
			</block>
			<u-loadmore fontSize="12" :status="status" loadingIcon="circle" :nomore-text="nomoreText" v-else />
		</view>
		<u-popup :show="show" @close="close" closeOnClickOverlay mode="right">
			<view class="padding chooseDate">
				<view class="text-sm margin-bottom-sm flex">
					<view>下单时间</view>
				</view>
				<view class="flex flex-wrap text-sm text-center justify-around">
					<view @click="chooseDate(index)" v-for="(item,index) in chooseDateList" :key="item.label"
						class="margin-right-xs margin-bottom-sm date_choose padding-tb-sm"
						:class="{active: (chooseDateActive === '' && index===0) ||chooseDateActive === index}">
						{{item.label}}
					</view>
				</view>
				<view class="flex justify-around van-hairline--top padding-top-sm margin-top-sm">
					<view style="width: 45%;">
						<u-button type="primary" shape="circle" @click="chooseDateConfirm" text="确认"></u-button>
					</view>
					<view style="width: 45%;">
						<u-button type="primary" shape="circle" plain @click="chooseDateReset" text="重置"></u-button>
					</view>
				</view>
			</view>
		</u-popup>
		<uni-popup ref="popupRefundOut" type="center" :animation="false">
			<view class="bg-white padding text-center" style="width: 630rpx;margin: 0 auto;border-radius: 20rpx;">
				<view class="text-sm">抱歉，您的商品已于{{order_refund_out_time}}超过售后申请时效</view>
				<view class="margin-top-sm" style="display: inline-block;">
					<u-button type="error" text="我知道了" @click="hideRefundOut" size="mini" plain
						shape="circle"></u-button>
				</view>
			</view>
		</uni-popup>
		<u-overlay :show="showCancel" :mask-click-able="false" zIndex="9"></u-overlay>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				order_refund_out_time: '',
				status: 'loadmore',
				page: 1,
				list: [],
				show: false,
				value: '',
				search_focus: false,
				isSearchDate: true,
				showCancel: false,
				active: 0,
				menu: [{
						label: '售后申请'
					},
					{
						label: '处理中'
					},
					{
						label: '申请记录'
					}
				],
				chooseDateActive: '',
				chooseDateList: [{
						label: '全部'
					},
					{
						label: '一个月内'
					},
					{
						label: '一个月至三个月'
					},
					{
						label: '三个月至六个月'
					},
					{
						label: '六个月至一年'
					},
					{
						label: '一年以上'
					}
				]
			};
		},
		computed: {
			emptyDataTxt() {
				return [
					'没有订单数据',
					'没有处理中的服务单',
					'没有申请记录',
				][this.active]
			},
			searchPlaceholder() {
				return [
					'商品名称/订单编号',
					'商品名称/售后服务单号',
					'商品名称/售后服务单号',
				][this.active]
			},
			nomoreText() {
				return [
					'没有更多订单了~',
					'没有更多服务单了~',
					'没有更多服务单了~',
				][this.active]
			}
		},
		onLoad(options) {
			if (options.value) {
				this.value = options.value
			}
			checkLogin(() => {
				this.loadData()
			})
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			onSearchFocus() {
				this.search_focus = true
				this.showCancel = true
			},
			loadData() {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'
				let url = [
					'/api/v1/user/order/refund_order_list',
					'/api/v1/user/refund_order?status=1',
					'/api/v1/user/refund_order'
				][this.active]
				axios.get(url, {
					params: {
						page: this.page,
						keywords: this.value,
						date: Number(this.chooseDateActive) === 0 ? '' : this.chooseDateActive
					},
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = this.page >= res.data.page
							.pages ? 'nomore' : 'loadmore'
					}
				})
			},
			showRefundOut(e) {
				this.order_refund_out_time = e
				this.$refs.popupRefundOut.open()
			},
			hideRefundOut() {
				this.$refs.popupRefundOut.close()
			},
			tabsChange(event) {
				console.log(event)
				if(this.active == event.index){
					return
				}
				this.active = event.index
				this.chooseDateActive = ''
				this.showCancel = false
				this.value = ''
				this.resetList()
			},
			cancel(e) {
				console.log('取消', e)
				uni.hideKeyboard()
			},
			searchClear(e) {
				console.log('清除', e)
				this.showCancel = false
				this.page = 1
				this.status = 'loadmore'
				this.list = []
				this.loadData()
			},
			search(e) {
				console.log('搜索', e)
				this.showCancel = false
				this.resetList()
			},
			close() {
				this.show = false
			},
			chooseDate(index) {
				this.chooseDateActive = index > 0 ? index : ''
			},
			resetList() {
				this.list = []
				this.page = 1
				this.status = 'loadmore'
				this.loadData()
			},
			chooseDateConfirm() {
				this.show = false
				setTimeout(() => {
					this.resetList()
				}, 300)
			},
			chooseDateReset() {
				this.chooseDateActive = ''
			},
		}
	}
</script>

<style lang="scss">
	.chooseDate {
		width: 630rpx;
		height: 100%;
	}

	.date_choose {
		background-color: #e5e5e5;
		border-radius: 50rpx;
		width: 45%;
	}

	.date_choose.active {
		background-color: #000030;
		color: #fff;
	}
</style>