<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="bg-white margin-bottom-sm padding-tb-xs padding-lr-sm" v-for="item in list" :key="item.id">
				<view>{{item.create_at}}</view>
				<view class="flex">
					<view>
						<image mode="aspectFill" style="height: 150rpx;width: 150rpx;" :src="item.gift.cover">
						</image>
					</view>
					<view class="flex flex-direction" style="height: 150rpx;">
						<view class="u-line-2 padding-tb-xs padding-lr-sm text-sm" style="max-height: 78rpx;">
							{{item.gift.title}}
						</view>
						<view class="padding-tb-xs padding-lr-sm">
							<view>
								<text class="text-sm">数量：{{item.number}}</text>
							</view>
						</view>
					</view>
				</view>
				<view style="padding: 0 10rpx 20rpx 0;" class="flex justify-end align-center" @click.stop>
					<view class="margin-left-sm" v-if="item.status===0" style="border-radius: 999rpx;">
						<button type="warn" size="mini" @click="remove(item.id)" style="border-radius: 999rpx;">删除</button>
					</view>
					<view class="margin-left-sm" v-if="item.status===1" style="border-radius: 999rpx;">
						<button type="default" size="mini" @click="cancel(item.id)" style="border-radius: 999rpx;">取消</button>
					</view>
					<view class="margin-left-sm" v-if="item.status===2">
						<button type="default" size="mini" @click="$globalJump2View('/pages/my/integral_exchange_logs_logistics/integral_exchange_logs_logistics?id='+item.id, true)" style="border-radius: 999rpx;">查看物流</button>
					</view>
				</view>

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
				loaded: false,
				status: 'loadmore',
				list: [],
				page: 1
			};
		},
		onLoad() {
			checkLogin(() => {
				this.loadData()
			})
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			cancel(id){
				axios.post('/api/v1/user/integral/cancel_gift_exchange_logs', {id}).then(res => {
					uni.showToast({
						title: res.info,
						icon: res.code === 1 ? 'success' : 'none',
						duration: 1200
					})
					if (res.code === 1) {
						let index = this.list.findIndex(item => item.id === id)
						if (index !== -1) {
							setTimeout(() => {
								this.$set(this.list[index], 'status', 0)
							}, 1200)
						}
					}
				}).catch(error => {
					uni.showToast({
						title: "出错了,请稍后重试",
						icon: 'none',
						duration: 1200
					})
				})
			},
			remove(id){
				uni.showModal({
					title: '提示',
					content: '删除后数据无法找回，是否确认？',
					success:red => {
						if(red.confirm) {
							axios.post('/api/v1/user/integral/remove_gift_exchange_logs', {id}).then(res => {
								uni.showToast({
									title: res.info,
									icon: res.code === 1 ? 'success' : 'none',
									duration: 1200
								})
								if (res.code === 1) {
									let index = this.list.findIndex(item => item.id === id)
									if (index !== -1) {
										setTimeout(() => {
											this.list.splice(index, 1)
											this.$forceUpdate()
										}, 1200)
									}
								}
							}).catch(error => {
								uni.showToast({
									title: "出错了,请稍后重试",
									icon: 'none',
									duration: 1200
								})
							})
						}
					}
				})
				
			},
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get('/api/v1/user/integral/gift_exchange_logs', {
					params: {
						page: this.page
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.page.current >= res.data.page.pages ? 'nomore' : 'loadmore'
						if (this.loaded === false) {
							this.$nextTick(() => {
								this.loaded = true
							})
						}

					}
				}).catch(error => {})
			},
		}
	}
</script>

<style lang="scss">

</style>