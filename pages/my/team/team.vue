<template>
	<view>
		<view class="bg-white">
			<view v-for="(item, index) in list" :key="item.id"
				class="flex align-center justify-between padding-sm solid-bottom">
				<!-- <image style="height: 100rpx;width: 100rpx;" :src="item.headimg ? item.headimg : avatarUrl"></image> -->
				<u-avatar :src="item.headimg ? item.headimg : avatarUrl" mode="square" size="100rpx"></u-avatar>
				<view style="margin-left: 20rpx;line-height: 50rpx;">
					<view>{{item.nickname || '未设置昵称'}}</view>
					<view>
						<u-icon name="phone-fill" :label="item.phone ? item.phone : '未绑定手机'" labelPos="right"/>
					</view>
				</view>
				<view style="margin-left: auto;">{{item.create_at}}</view>
			</view>
		</view>
		
		<view>
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
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				list: [],
				page: 1,
				loading: false,
				loaded: false,
				status: 'loadmore',
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.loaded || this.loading !== false) {
					return false
				}
				this.loading = true
				this.status = 'loading'
				axios.get('api/v1/user/teams', {
					params: {
						page: this.page
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.loaded = res.data.list.length < 15
						this.status = res.data.list.length < 15 ? 'nomore':'loadmore'
					}
				}).finally(() => {
					this.loading = false
				})
			}
		},
		onReachBottom() {
			this.loadData()
		}
	}
</script>

<style lang="scss" scoped>
// page{
// 	background-color: #fff;
// }
</style>