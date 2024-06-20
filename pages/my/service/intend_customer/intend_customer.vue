<template>
	<view style="line-height: 44rpx;">
		<view class="user-box" v-for="(item,index) in list" :key="item.id">
			<view class="container user-box-info">
				<block v-if="item.user && item.user.headimg">
					<image class="headimg" mode="widthFix" :src="item.user.headimg"></image>
				</block>
				<view style="display: flex;flex-wrap: wrap;">
					<view style="width: 50%;">姓名：{{item.username}}</view>
					<view style="width: 50%;">电话：{{item.phone}}</view>
					<view style="width: 50%;">城市： {{item.city}}</view>
				</view>
			</view>
			<view class="container">
				<view>意向床具：{{item.intention}}</view>
				<view>是否激活：{{item.status > 1 ? '已转化': item.status > 0 ? '已激活' :'未激活'}}</view>
			</view>
		</view>
		<block v-if="status == 'nomore' && list.length < 1">
			<u-empty mode="list"></u-empty>
		</block>
		<u-loadmore :status="status" v-else />
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				page: 1,
				list: [],
				status: 'loadmore'
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get("/api/v1/admin/intend_customer").then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore'
					}
				}).catch(error => {
					wx.showToast({
						title: '网络错误，请稍后重试！',
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}
	.user-box {
	  margin-bottom: 20rpx;
	  background-color: #fff;
	  padding-top: 20rpx;
	}
	
	.user-box .user-box-info {
	  display: flex;
	  align-items: center;
	}
	
	.user-box .user-box-info>.headimg {
	  width: 88rpx;
	  border-radius: 50%;
	  margin-right: 20rpx;
	}
	
	.user-box .user-operate {
	  padding: 16rpx 0;
	  width: 100%;
	  border-top: 1px solid #000;
	  text-align: center;
	}
</style>