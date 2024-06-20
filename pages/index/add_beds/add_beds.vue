<template>
	<view>
		<view class="page-bar">
			<view class="text-xl" style="font-weight: bold;">联系我们</view>
			<view class="text-sm" style="font-weight: bold;color: #71717a;margin-top: 12rpx;">CONTACT US</view>
		</view>

		<view class="container" style="margin-top: 20rpx;">
			<view class="margin-bottom-sm">留下您的联系方式</view>
			<view class="bg-white">
				<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">收货人</view>
					<view style="flex-grow: 1;"><input name="username" v-model="username" placeholder="请填写联系人" /></view>
				</view>
				<view style="padding: 0 20rpx;">
					<u-line></u-line>
				</view>
				<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">电话号码</view>
					<view style="flex-grow: 1;"><input name="phone" type="number" v-model="phone"
							placeholder="请填写联系电话" /></view>
				</view>
				<view style="padding: 0 20rpx;">
					<u-line></u-line>
				</view>
				<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">详细地址</view>
					<view style="flex-grow: 1;">
						<textarea name="remark" style="width: 100%;" auto-height placeholder="请输入备注" v-model="remark" />
					</view>
				</view>
			</view>

		</view>
		<view class="padding">
			<u-button type="primary" @click.native="submit">提交</u-button>
		</view>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request'
	export default {
		data() {
			return {
				username: '',
				phone: '',
				remark: '',
			};
		},
		methods: {
			submit() {
				if (this.username == '') {
					uni.showToast({
						title: '请填写姓名',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				axios.post('/api/v1/user/feedback', {
					username: this.username,
					phone: this.phone,
					remark: this.remark,
				}).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: res.info,
							icon: 'success',
							duration: 1200
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1200);
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none',
							duration: 1200
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '出错了,请稍后重试',
						icon: 'none',
						duration: 1200
					})
				})
			},
		}
	}
</script>

<style lang="scss">

</style>