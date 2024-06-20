<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded" class="padding-bottom">
			<view class="container radius-lg bg-white padding-sm margin-top-sm" v-for="(item,index) in logs"
				:key="index">
				<view class="flex align-center">
					<u-avatar :src="item.cover"></u-avatar>
					<view class="margin-left-sm">
						<view class="text-lg margin-tb-xs">{{item.title}}</view>
						<view style="color: #666;">{{item.timestamp}}</view>
					</view>
				</view>
				<view class="margin-top-sm">
					<view class="margin-bottom-sm" v-for="v in item.desc" :key="v">{{v}}</view>
				</view>
				<view class="flex align-center flex-wrap">
					<view v-for="(vv, kk) in item.images" :key="kk" class="margin-right-xs margin-bottom-xs">
						<image style="width: 110rpx;height: 110rpx;" :src="vv"></image>
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
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				id: '',
				loaded: false,
				logs: []
			};
		},
		onLoad(options) {
			this.id = options.id || ''
			checkLogin(() => {
				axios.get('/api/v1/user/refund_order_logs/' + this.id).then(res => {
					if (res.code === 1) {
						this.logs = res.data.reverse()
						this.$nextTick(() => {
							this.loaded = true
						})
					}
				})
			})

		}
	}
</script>

<style lang="scss">

</style>