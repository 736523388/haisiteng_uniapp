<template>
	<view class="container">
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<u-cell title="业绩看板" isLink :border="false" url="/pages/my/service/statistics/statistics"></u-cell>
			</u-cell-group>
		</view>
		<block v-if="auth > 0">
			<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
				<u-cell-group :border="false">
					<u-cell title="床具信息-已分配" isLink :border="false"
						url="/pages/my/service/beds_order/beds_order"></u-cell>
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="床具信息-待分配" isLink :border="false" url="/pages/my/service/beds/beds"></u-cell>
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="保养维护订单" isLink :border="false" url="/pages/my/service/beds_server/beds_server">
						<u-badge slot="value" numberType="ellipsis" type="error" max="99"
							:value="bed_service_count"></u-badge>
					</u-cell>
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="核销代金券" isLink :border="false"
						url="/pages/my/service/verif_voucher/verif_voucher"></u-cell>
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="赠送优惠券" isLink :border="false"
						url="/pages/my/service/give_coupon/give_coupon"></u-cell>
				</u-cell-group>
			</view>
		</block>
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<u-cell v-if="auth > 0" title="地址管理" isLink :border="false"
					url="/pages/my/service/store_user_address/store_user_address"></u-cell>
				<block v-if="false">
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="门店信息设置" isLink :border="false"
						url="/pages/my/service/information_settings/information_settings"></u-cell>
				</block>
				<block v-if="auth == 3">
					<u-line length="92%" style="margin: 0 auto;"></u-line>
					<u-cell title="门店管理" isLink :border="false" url="/pages/my/service/store/store"></u-cell>
				</block>
				<u-line length="92%" style="margin: 0 auto;"></u-line>
				<u-cell title="客户管理" isLink :border="false" url="/pages/my/service/user/user"></u-cell>
				<u-line length="92%" style="margin: 0 auto;"></u-line>
				<u-cell title="潜客管理" isLink :border="false" url="/pages/my/service/intend_customer/intend_customer">
					<u-badge slot="value" numberType="ellipsis" type="error" max="99"
						:value="intend_customers_count"></u-badge>
				</u-cell>

			</u-cell-group>
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
				loaded: false,
				auth: 0,
				intend_customers_count: 0,
				bed_service_count: 0
			};
		},
		onLoad() {
			checkLogin(() => {
				axios.get('/api/v1/user/info').then(res => {
					this.loaded = true
					this.auth = res.data.auth
				})
				// #ifdef MP-WEIXIN
				uni.requestSubscribeMessage({
					tmplIds: ['B-aO2DYlNE43wdM-q9FDg9VE7g5HkDW6GdUVwfrpbN0',
						'VntoDAokGtxZSs6a0WXAkMoDfeDu7ri6DHepX6G4Vm0'
					],
					success(res) {
						console.log(res)
					}
				})
				// #endif

			})
		},
		onShow() {
			axios.get('/api/v1/admin/backlog').then(res => {
				this.bed_service_count = res.data.bed_service
				this.intend_customers_count = res.data.intend_customers
			})
		}
	}
</script>

<style lang="scss" scoped>

</style>