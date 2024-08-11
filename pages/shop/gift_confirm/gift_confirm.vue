<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view v-if="address_current_id > 0" @click="$globalJump2View('/pages/my/address/address?change=1', true)"
				class="margin-top-sm container padding-tb-sm padding-lr bg-white margin-bottom-sm flex align-center"
				style="border-radius: 12rpx;">
				<view style="flex: 1;">
					<view class="flex align-center">
						<uni-tag v-if="address_current.is_default == 1" text="默认" size="mini"
							custom-style="background-color: #e43d33; border-color: #e43d33; color: #fff;margin-right: 6rpx;"></uni-tag>
						<view class="text-sm">
							{{address_current.province}}{{address_current.city != '县' && address_current.city != '市' ? address_current.city : ''}}{{address_current.area}}
						</view>
					</view>
					<view class="text-bold" style="margin: 6rpx 0;">{{address_current.address}}</view>
					<view class="flex align-center justify-start"><text>{{address_current.name}}</text>
						<view><u--text mode="phone" :text="address_current.phone" format="encrypt" size="28rpx"
								margin="0 0 0 6rpx"></u--text></view>
					</view>
				</view>
				<view style="margin-left: auto;">
					<u-icon name="arrow-right" color="#808080" size="28rpx"></u-icon>
				</view>
			</view>
			<view v-else @click="$globalJump2View('/pages/my/address/address?change=1', true)"
				class="margin-top-sm container padding-tb-sm padding-lr bg-white margin-bottom-sm flex align-center"
				style="border-radius: 12rpx;">
				<view style="flex: 1;">
					<view class="text-bold">您还未添加收货地址，立即添加</view>
				</view>
				<view style="margin-left: auto;">
					<u-icon name="arrow-right" color="#b2b2b2" size="28rpx"></u-icon>
				</view>
			</view>

			<!-- 结算的产品 -->
			<view class="bg-white container padding margin-bottom-sm" style="border-radius: 12rpx;">
				<view class="flex">
					<image style="width: 200rpx;height: 200rpx;border-radius: 20rpx;" mode="aspectFill"
						:src='gift.cover'></image>
					<view class="margin-left" style="width: 470rpx;">
						<view class="">{{gift.title}}</view>
						<view class="margin-top">
							<text class="text-xs"><text class="text-df">{{gift.integral_num}}积分</text></text>
							<!-- <text class="margin-left-xs"> x 1</text> -->
						</view>
						<view class="margin-top-sm">
							<u-number-box v-model="num" :min="1" :max="gift.stock" integer
								:button-size="22"></u-number-box>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white"
				style="position: fixed;width: 100%;left: 0;bottom: 0;padding-bottom: env(safe-area-inset-bottom);z-index: 9;">
				<view class="flex align-center justify-center" style="padding: 0 32rpx;">
					<view class="flex justify-end" style="flex: 1;text-align: right;">
						<!-- <view>合计：</view> -->
						<view class="text-red">{{total_integral_num}}积分
						</view>
					</view>
					<view style="padding: 10rpx;">
						<view style="border: none;display: inline-block;">
							<u-button :disabled="address_current_id === 0" type="primary" text="确认兑换" color="#000"
								:custom-style="{'border-radius':'999px','width':'160rpx'}"
								style="width: 160rpx;border-radius: 999px;" @click.native="receive"></u-button>
						</view>
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
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				id: '',
				loaded: false,
				gift: {},
				num: 1
			};
		},
		onLoad(options) {
			this.id = options.id || id
			checkLogin(() => {
				this.loadData()
			})
		},
		computed: {
			total_integral_num() {
				return (this.gift.integral_num || 0) * this.num
			},
			...mapGetters({
				address_current: 'user_address/address_current',
				address_current_id: 'user_address/address_current_id'
			})
		},
		methods: {
			loadData() {
				axios.get('/api/v1/user/integral/gift/detail?id=' + this.id).then(res => {
					if (res.code === 1) {
						this.gift = res.data
						this.$nextTick(() => {
							this.loaded = true
						})
					}
				})
			},
			receive() {
				let params = {
					gift_id: this.id,
					number: this.num,
					address_name: this.address_current.name,
					address_phone: this.address_current.phone,
					address_province: this.address_current.province,
					address_city: this.address_current.city,
					address_area: this.address_current.area,
					address_content: this.address_current.address
				}
				axios.post('/api/v1/user/integral/receive_gift', params).then(res => {
					uni.showToast({
						title: res.info,
						icon: 'none',
						duration: 1200
					})
					if (res.code === 1) {
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
					}
				}).catch(error => {
					uni.showToast({
						title: "出错了，请稍后重试",
						icon: 'none',
						duration: 1200
					})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>