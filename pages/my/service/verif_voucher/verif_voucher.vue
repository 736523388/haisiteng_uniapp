<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入核销码" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="coupon-list">
			<view class="container margin-bottom-sm" v-if="store_loaded">
				<text>当前选择门店：{{store_list[storeActiveIndex].name}} </text>
				<picker style="display: inline-block;" :range="store_list" range-key="name" :value="storeActiveIndex" @change="bindStoreChange">
					<text style="color: #1989fa;">切换</text>
				</picker>
				
			</view>
			<view class="container" v-for="(item,index) in list" :key="item.id">
				<view class="coupon" :style="'background-image: url('+coupon_background_image+');'">
					<view class="coupon-left">
						<view>{{item.title}}</view>
						<view class="text-xxs margin-top-xs">有效期：{{item.expire_datetime}}</view>
						<view style="margin-top: 16rpx;height: 36rpx;margin-left: 6rpx;">
							<image src="/static/images/logo.svg" mode="heightFix" style="height: 100%;width: 120rpx;">
							</image>
						</view>
						<view class="text-xxs margin-top-xs">·{{item.remark}}</view>
						<view class="margin-top-xs" v-if="item.type === 2">核销码 {{item.code}}</view>
					</view>
					<view class="coupon-right">
						<view class="margin-top-sm margin-right">
							<u-button type="primary" @click="receive(item.id)" size="small" text="确认核销"></u-button>
						</view>
					</view>
				</view>
				<u-line></u-line>
			</view>
			<view>
				<block v-if="loaded && list.length < 1">
					<u-empty mode="data" icon="/static/empty_data.png"></u-empty>
				</block>
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
				coupon_background_image: "https://hst.dev.cqclxsc.com/upload/a1/69ab59816e29a0164befa8ee8bcdad.jpg",
				value: '',
				list: [],
				loading: false,
				loaded: false,
				store_loaded: false,
				store_list: [],
				storeActiveIndex: 0
			};
		},
		onLoad() {
			this.storeActiveIndex = uni.getStorageSync('storeActiveIndex') || 0
			checkLogin(() => {
				axios.get('/api/v1/admin/store_list').then(res => {
					if(res.code === 1){
						this.store_list = res.data
						this.store_loaded = true
						if(this.storeActiveIndex > this.store_list.length) {
							this.storeActiveIndex = 0
						}
					}
				})
			})
		},
		methods: {
			bindStoreChange(e){
				this.storeActiveIndex = Number(e.detail.value)
				uni.setStorageSync('storeActiveIndex', this.storeActiveIndex)
			},
			choose_store(){
				console.log('切换门店')
			},
			onClick() {
				if (!this.value) {
					this.list = []
					this.loaded = true
					return
				}
				if (this.loading === true) {
					return
				}
				this.loading = true
				axios.get('api/v1/admin/verify_voucher?type=2&code=' + this.value).then(res => {
					if (res.code === 1) {
						this.list = res.data.list
						this.loading = false
						this.loaded = true
					} else {
						uni.$u.toast(res.info)
					}
				}).catch(error => {
					uni.$u.toast('出错了，请稍后再试！')
				})
			},
			receive(id) {
				axios.post('/api/v1/admin/verify_voucher/confirm', {
					id,
					store_id: this.store_list[this.storeActiveIndex].id
				}).then(res => {
					uni.showToast({
						title: res.info,
						duration: 1500
					})
					if (res.code === 1) {
						setTimeout(() => {
							this.list = []
							this.value = ''
						}, 1500)
					}
				})
			},
		},
		
	}
</script>

<style lang="scss" scoped>
	.hst-search {
		padding: 0 !important;
	}

	.coupon-list {
		background-color: #fff;
		min-height: 100vh;
	}

	.coupon {
		margin-top: 4rpx;
		color: #fff;
		overflow: hidden;
		background-repeat: no-repeat;
		background-size: 100% 100%;
	}

	.coupon-left,
	.coupon-right {
		display: inline-block;
		padding-top: 30rpx;
		padding-bottom: 30rpx;
		height: 100%;
	}

	.coupon-left {
		width: 413rpx;
		padding-left: 20rpx;
	}

	.coupon-right {
		width: 277rpx;
		text-align: center;
	}
</style>