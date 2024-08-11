<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="container-xl bg-white padding-sm radius-sm">
				<view v-for="item in goods_list" class="flex align-center padding-tb-xs">
					<image style="width: 80rpx;height: 80rpx;" :src="item.goods_cover"></image>
					<view class="margin-left-xxs">
						<text class="u-line-1">{{item.goods_name}}</text>
						<view style="color: #666;">{{item.goods_spec_alias}}</view>
					</view>
				</view>
			</view>
			<view class="container-xl bg-white padding radius-sm margin-top">
				<view
					@click="$globalJump2View('/pages/my/refund_order_apply/refund_order_apply?order_no='+order_no, true)"
					class="flex align-center justify-between margin-bottom">
					<view>
						<view class="text-bold padding-tb-xs">仅退款（无需退货）</view>
						<view style="color: #666;">未收到货/已拒收，协商一致不用退货只退款</view>
					</view>
					<view>
						<uni-icons type="right" size="14" color="#666"></uni-icons>
					</view>
				</view>
				<view
					@click="$globalJump2View('/pages/my/refund_order/refund_order?value='+order_no, true)"
					class="flex align-center justify-between">
					<view>
						<view class="text-bold padding-tb-xs">退货退款</view>
						<view style="color: #666;">已收到货，需退还收到的货物</view>
					</view>
					<view>
						<uni-icons type="right" size="14" color="#666"></uni-icons>
					</view>
				</view>
			</view>
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
				loaded: false,
				order_no: '',
				goods_list: []
			};
		},
		onLoad(options) {
			this.order_no = options.order_no || ''
			this.loadData()
		},
		methods: {
			loadData() {
				axios.get('/api/v1/user/order?order_no=' + this.order_no).then(res => {
					console.log(res)
					if (res.code === 1 && res.data.list.length === 1) {
						this.loaded = true
						this.goods_list = res.data.list[0].items
					}
				}).catch(error => {})
			}
		}
	}
</script>

<style lang="scss">

</style>