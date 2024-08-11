<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view style="line-height: 1.5;">
				<view class="flex align-center padding u-border-top" @click="show=true">
					<view>退款原因：</view>
					<view class="margin-left-sm" :class="{'text-gray': !clickFlag}">{{!clickFlag ? '请先选择退款原因' : radiovalue1}}</view>
					<view style="margin-left: auto;"><u-icon size="24rpx" name="arrow-right" color="#333"></u-icon>
					</view>
				</view>
				<view class="flex align-center padding u-border-top u-border-top-bottom">
					<view>联系方式：</view>
					<view class="margin-left-sm"><u--text mode="phone" text="13368088740" format="encrypt"></u--text>
					</view>
				</view>
			</view>
			<view class="padding margin-top-xl">
				<u-button type="error" :disabled="!clickFlag" shape="circle" text="申请退款"
					@click.native="submit"></u-button>
			</view>

			<view class="margin-top-xl padding" style="color: #666;line-height: 1.5;">
				<view>温馨提示：<br><br>1. 消费者因个人原因申请退货，包邮商品需要承担返回运费，非包邮商品需要承担送返两程运费<br>2. 订单一旦取消，无法恢复<br></view>
			</view>
		</view>

		<u-popup :show="show" @close="close" closeable round="20rpx" :closeOnClickOverlay="false">
			<view class="padding">
				<view class="text-center text-lg text-bold">取消原因</view>
				<view class="margin-top-xl padding" style="color: #666;line-height: 1.5;background-color: #f8f8f8;">
					<view>温馨提示：<br><br>1. 消费者因个人原因申请退货，包邮商品需要承担返回运费，非包邮商品需要承担送返两程运费<br>2. 订单一旦取消，无法恢复<br></view>
				</view>
				<view class="margin-top text-bold">请选择取消订单的原因（必选）：</view>
				<view class="margin-top padding-lr-sm">
					<u-radio-group v-model="radiovalue1" placement="column">
						<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in reasons" :key="index"
							:label="item.name" :name="item.name" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="margin-top-sm">
					<u-button :disabled="radiovalue1 ==''" type="error" shape="circle" text="确定"
						@click.native="confirmReasons"></u-button>
				</view>
			</view>
		</u-popup>
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
				order_no: '',
				show: false,
				loaded: false,
				reasons: [],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: '',
				clickFlag: false
			};
		},
		onLoad(options) {
			this.order_no = options.order_no || ''
			axios.get('/api/v1/refund_order_reasons').then(res => {
				if (res.code === 1) {
					this.reasons = res.data.reasons_type1.map((item, index) => {
						return {
							name: item
						}
					})
					console.log(this.reasons)
					this.loaded = true
				}
			})
		},
		methods: {
			confirmReasons() {
				this.clickFlag = true
				this.show = false
				console.log(this.radiovalue1)
			},
			radioChange(n) {
				this.radiovalue1 = n
			},
			close() {
				this.show = false
			},
			submit() {
				console.log(this.radiovalue1)
				axios.post('/api/v1/user/order_cancel', {
					order_no: this.order_no,
					reason: this.radiovalue1
				}).then(res => {
					console.log(res)
					uni.showToast({
						title: res.info,
						icon: "none",
						duration: 1500
					})
					if (res.code === 1) {
						setTimeout(() => {
							uni.navigateBack()
						}, 1500)
					}
				}).catch(err => {
					uni.showToast({
						title: "出错了，请稍后重试",
						icon: "none",
						duration: 1500
					})
				})
			}
		}
	}
</script>

<style lang="scss">

</style>