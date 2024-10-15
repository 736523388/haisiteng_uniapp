<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view class="bg-white text-center" v-if="loaded">
			<view v-if="payment">
				<uni-icons type="checkbox" size="56" color="#07c160"></uni-icons>
			</view>
			<view v-else>
				<uni-icons type="close" size="56" color="#fa5151"></uni-icons>
			</view>
			<view class="margin-tb-xs">付款{{payment ? '成功':'失败'}}！</view>
			<view class="margin-tb-xs">{{payment_amount}}</view>
			<view class="margin-tb-xs" v-if="payment">{{payment_datetime}}</view>
			<view class="flex justify-center padding-bottom">
				<view class="margin-right"><button type="default" size="mini" @click="goHome">返回首页</button></view>
				<view><button type="default" size="mini" @click="$globalJump2View('/pages/my/my_order/my_order', true)">查看订单</button></view>
			</view>
		</view>
	</view>
	
</template>

<script>
	import {
		axios,checkLogin
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				order_no: '',
				loaded: false,
				payment: false,
				payment_amount: '￥19.88',
				payment_datetime: '2024-10-15 12:00:00'
			};
		},
		onLoad(options) {
			this.order_no = options.order_no || ''
			checkLogin(() => {
				this.loadData()
			})
			
		},
		methods: {
			loadData(){
				axios.get('/api/v1/user/order/get_payment_result?order_no='+this.order_no).then(res => {
					if(res.code === 1) {
						this.payment = res.data.payment
						this.payment_amount = '￥' + res.data.payment_amount
						this.payment_datetime = res.data.payment_datetime
						this.$nextTick(() => {
							this.loaded = true
						})
					}
				}).catch(error => {})
			},
			goHome(){
				uni.switchTab({
					url: '/pages/index/index'
				})
			}
		}
	}
</script>

<style lang="scss">

</style>
