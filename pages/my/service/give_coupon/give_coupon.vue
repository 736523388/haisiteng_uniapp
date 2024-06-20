<template>
	<view>
		<view class="container margin-top">
			<view class="flex justify-between align-center" style="flex-direction: row-reverse;">
				<view @click="$globalJump2View('/pages/my/service/user/user?change=1', true)"
					class="bg-black padding-sm" style="border: 1px solid #000030;">选择></view>
				<view class="padding-sm" style="flex:1;border: 1px solid #000030;">顾客信息</view>
			</view>

			<view class="container margin-tb-sm" v-if="userinfo != null">
				<view class="flex align-center justify-between padding-sm solid-bottom bg-white">
					<u-avatar :src="userinfo.headimg ? userinfo.headimg : avatarUrl" mode="square"
						size="100rpx"></u-avatar>
					<view class="margin-left-sm" style="line-height: 50rpx;">
						<view>{{userinfo.nickname}}</view>
						<view>
							<u-icon name="phone-fill" :label="userinfo.phone ? userinfo.phone : '未绑定手机'"
								labelPos="right" />
						</view>
					</view>
					<view style="margin-left: auto;">{{userinfo.region_province}} {{userinfo.region_city}}
						{{userinfo.region_area}}
					</view>
				</view>
			</view>
		</view>
		<view class="container margin-top">
			<view class="flex justify-between align-center" style="flex-direction: row-reverse;">
				<view @click="$globalJump2View('/pages/my/service/coupon/coupon?change=1', true)"
					class="bg-black padding-sm" style="border: 1px solid #000030;">选择></view>
				<view class="padding-sm" style="flex:1;border: 1px solid #000030;">代金券信息</view>
			</view>

			<view class="padding-sm margin-tb-sm bg-white" v-if="coupon != null">
				<view>{{coupon.title}}</view>
				<view>有效期：{{coupon.expire_datetime}}</view>
				<view>{{coupon.remark}}</view>
				<view>赠送数量：</view>
				<view style="margin-top: 8rpx;">
					<u-number-box v-model="value" :min="1" integer :button-size="24"></u-number-box>
				</view>
			</view>
		</view>
		<view class="operate-box">
			<u-button custom-style="width:100%;border-radius: 999rpx;" type="primary" @click.native="submit">保存</u-button>
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
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				userinfo: null,
				coupon: null,
				value: 1
			};
		},
		onLoad() {
			checkLogin()
		},
		onShow() {
			this.userinfo = uni.getStorageSync('choose_user') || null
			this.coupon = uni.getStorageSync('choose_coupon') || null
			console.log(this.userinfo)
			console.log(this.coupon)
		},
		methods: {
			submit() {
				console.log(this.value)
				if (this.userinfo == null) {
					uni.showToast({
						title: '请选择用户',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				if (this.coupon == null) {
					uni.showToast({
						title: '请选择优惠券',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				axios.post('/api/v1/admin/coupon', {
					uuid: this.userinfo.id,
					coupon_id: this.coupon.id,
					num: this.value
				}).then(res => {
					if (res.code === 1) {
						uni.showToast({
							title: res.info,
							duration: 1200
						})
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none',
							duration: 1200
						})
					}
				}).catch(err => {
					uni.showToast({
						title: '出错了',
						icon: 'none',
						duration: 1200
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.operate-box {
		position: fixed;
		bottom: 0;
		padding: 30rpx;
		width: 100%;
		text-align: center;
		background-color: #fff;
		z-index: 5;
	}
</style>