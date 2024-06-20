<template>
	<view class="container">
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<!-- #ifndef APP-PLUS | H5 -->
				<u-cell title="授权管理" isLink :border="false" @click.native="openSet"></u-cell>
				<view class="padding-left padding-right">
					<u-line></u-line>
				</view>
				<!-- #endif -->
				<u-cell title="协议与规则" isLink :border="false" url="/pages/my/rule_list/rule_list"></u-cell>
			</u-cell-group>
		</view>
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<u-cell title="收货地址" isLink :border="false" @click="$globalJump2View('/pages/my/address/address', true)"></u-cell>
				<view class="padding-left padding-right">
					<u-line></u-line>
				</view>
				<u-cell title="修改手机号" isLink :border="false"
					@click="$globalJump2View('/pages/my/edit_mobile/edit_mobile', true)"></u-cell>
				<view class="padding-left padding-right">
					<u-line></u-line>
				</view>

				<u-cell title="退出登录" isLink :border="false" @click="logout"></u-cell>
			</u-cell-group>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			}
		},
		methods: {
			logout() {
				uni.removeStorageSync('choose_user')
				uni.removeStorageSync('choose_coupon')
				this.$store.dispatch("user/logout")
				setTimeout(() => {
					uni.navigateBack()
				}, 600)
			},
			openSet(){
				uni.openSetting()
			}
		}
	}
</script>

<style>

</style>