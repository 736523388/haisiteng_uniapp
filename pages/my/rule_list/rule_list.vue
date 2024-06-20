<template>
	<view class="container">
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<u-cell title="保养手册" isLink :border="false"
					url='/pages/agreement/agreement?name=maintenance_manual'></u-cell>
			</u-cell-group>
		</view>
		<view class="margin-top" style="background-color: #fff;border-radius: 12rpx;">
			<u-cell-group :border="false">
				<u-cell title="用户协议" isLink :border="false"
					url='/pages/agreement/agreement?name=user_agreement'></u-cell>
				<view class="padding-left padding-right">
					<u-line></u-line>
				</view>
				<u-cell title="隐私声明" isLink :border="false"
					url='/pages/agreement/agreement?name=privacy_statement'></u-cell>
			</u-cell-group>
		</view>

	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		}
	}
</script>

<style lang="scss">

</style>