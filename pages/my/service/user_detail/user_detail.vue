<template>
	<view>
		<view class="bg-white">
			<view class="flex align-center justify-between padding-sm solid-bottom">
				<u-avatar :src="userinfo.headimg ? userinfo.headimg : avatarUrl" mode="square" size="100rpx"></u-avatar>
				<view style="margin-left: 20rpx;line-height: 50rpx;">
					<view>{{userinfo.nickname || '未设置昵称'}}</view>
					<view>
						<u-icon name="phone-fill" :label="userinfo.phone ? userinfo.phone : '未绑定手机'" labelPos="right"/>
					</view>
				</view>
				<view style="margin-left: auto;">{{userinfo.region_province}} {{userinfo.region_city}}
						{{userinfo.region_area}}
				</view>
			</view>
		</view>
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
				@click="$globalJump2View('/pages/my/service/give_coupon/give_coupon')" text="赠送保养券"></u-button>
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
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				userinfo: null,
				id: '',
				page: 1,
				list: [],
				status: 'loadmore',
			};
		},
		onLoad(options) {
			this.userinfo = uni.getStorageSync('choose_user') || null
			console.log(options)
			this.id = options.id
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get("/api/v1/admin/beds_order", {
					params: {
						uuid: this.id,
						page: this.page,
						limit: 10,
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
		}
	}
</script>

<style lang="scss" scoped>
.operate-box {
		position: fixed;
		bottom: 0;
		padding: 30rpx;
		width: 100%;
		text-align: center;
		background-color: #fff;
		z-index: 5;
	}
</style>
