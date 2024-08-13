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
					<view class="margin-left-sm" v-if="item.status===2">
						<u-button type="primary" text="查看物流"
							@click.native.stop="$globalJump2View('/pages/my/integral_exchange_logs_logistics/integral_exchange_logs_logistics?id='+item.id, true)"
							size="small" plain shape="circle"></u-button>
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