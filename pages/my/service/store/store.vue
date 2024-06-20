<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入名称或电话" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<view class="bg-white padding-sm solid-bottom">
				<view class="margin-bottom">如需添加门店请联系管理员</view>
				<!-- <van-button bindtap="jump2view" data-path="/pages/my/service/add_store/add_store">添加门店</van-button> -->

			</view>
			<view v-for="(item,index) in list" :key="item.id" class="bg-white solid-bottom padding-sm">

				<view class="flex align-center">
					<view class="text-xl text-bold">{{item.name}}</view>
					<!-- <view style="margin-left: auto;">
			          <van-button size="mini" bindtap="jump2view" data-path="/pages/my/service/edit_store/edit_store?id={{item.id}}">编辑</van-button>
			        </view> -->
				</view>
				<view>联系电话：{{item.telephone}}</view>
				<view>门店地址：{{item.province}}{{item.city}}{{item.area}}{{item.address}}</view>
				<block v-if="item.admin.id && !change">
					<view>店长：</view>
					<view class="flex align-center padding-tb-sm bg-white">
						<u-avatar :src="item.admin.headimg ? item.admin.headimg : avatarUrl" mode="square"
							size="100rpx"></u-avatar>
						<view class="margin-left-sm" style="line-height: 50rpx;">
							<view>{{item.admin.nickname || '未设置昵称'}}</view>
							<view>
								<u-icon name="phone-fill" :label="item.admin.phone ? item.admin.phone : '未绑定手机'"
									labelPos="right" />
							</view>
						</view>
						<!-- <view style="margin-left: auto;">{{item.admin.region_province}} {{item.admin.region_city}} {{item.admin.region_area}}</view> -->
					</view>
				</block>
			</view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty mode="list"></u-empty>
			</block>
			<u-loadmore :status="status" v-else />
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
				change: false,
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				value: '',
				page: 1,
				list: [],
				status: 'loadmore'
			};
		},
		onLoad(options) {
			this.change = options.change || false
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get('api/v1/admin/store', {
					params: {
						page: this.page,
						keyword: this.value
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.list.length < 20 ? 'nomore' : 'loadmore'
					}
				})
			},
			onClick() {
				this.page = 1
				this.list = []
				this.status = 'loadmore'
				this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}
</style>