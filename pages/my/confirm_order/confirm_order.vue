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
							custom-style="background-color: #f43f5e; border-color: #f43f5e; color: #fff;margin-right: 6rpx;"></uni-tag>
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
				<view class="flex" v-for="(item,index) in goods_list" :key="item.id">
					<image style="width: 200rpx;height: 200rpx;border-radius: 20rpx;" mode="aspectFill"
						:src='item.goods_cover'></image>
					<view class="margin-left" style="width: 470rpx;">
						<view class="text-lg">{{item.goods_name}}</view>
						<view class="text-desc text-sm">{{item.goods_spec_alias}}</view>
						<view class="margin-top">
							<text class="text-xs">￥<text class="text-lg">{{item.price_selling}}</text></text>
							<text style="margin-left: 6rpx;"> x {{item.stock_sales}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white container padding-xs margin-bottom-sm" style="border-radius: 12rpx;">
				<u-cell-group :border="false">
					<u-cell title="商品总额" :border="false" :value="'￥'+total.amount_goods"></u-cell>
					<u-cell :border="false" title="运费" :value="'￥' + total.express_amount " />
					<u-cell :border="false" title="优惠券">
						<template slot="value">
							<view v-if="coupon.used.id" class="text-df" style="line-height: 24px;">
								<text>「{{coupon.used.label}}」 -￥{{total.discount_amount}}</text>
							</view>
							<view v-else class="text-df" style="line-height: 24px;"
								@click.native.stop="openCouponPopup">
								<text class="text-red"
									v-if="coupon.available.length>0">{{coupon.available.length}}个可用</text>
								<text class="text-gray" v-else>无可用</text>
							</view>
						</template>
						<template slot="right-icon">
							<view v-if="coupon.used.id" class="text-df" @click.native.stop="onNotUseCoupon">
								<u-icon name="close-circle"></u-icon>
							</view>
							<view v-else class="text-df" @click.native.stop="openCouponPopup">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</template>
					</u-cell>
					<u-cell :border="false" center v-if="use_available && integral_available > 0">
						<view slot="title" class="u-slot-title">
							<text class="u-cell-text">积分抵扣</text>
						</view>
						<u-switch slot="right-icon" size="18" v-model="switchChecked" @change="onSwitchChange"
							activeColor="#0B1839"></u-switch>
						<view slot="value" class="text-df" style="color: #606266;line-height: 48rpx;">
							-￥{{total.amount_integral}}</view>
						<view slot="label" class="text-xs" style="color: #808080;">
							{{integral_available}}积分可用{{total.integral_num > 0 ? '(-'+total.integral_num+'积分)':''}}
						</view>
					</u-cell>
					<view style="text-align: right;padding: 20rpx 30rpx;">合计：<text
							class="text-red">￥{{total.amount_real}}</text></view>
				</u-cell-group>
			</view>
			<view class="bg-white"
				style="position: fixed;width: 100%;left: 0;bottom: 0;padding-bottom: env(safe-area-inset-bottom);z-index: 9;">
				<view class="flex align-center justify-center" style="padding: 0 32rpx;">
					<view class="flex justify-end" style="flex: 1;text-align: right;">
						<!-- <view>合计：</view> -->
						<view class="text-red">￥<text
								class="text-xl text-bold">{{total_order_amount}}</text>.{{total_order_amount_ceil}}
						</view>
					</view>
					<view style="padding: 10rpx;">
						<view style="border: none;display: inline-block;">
							<u-button :disabled="address_current_id === 0" type="primary" text="付款" color="#000"
								:custom-style="{'border-radius':'999px','width':'160rpx'}"
								style="width: 160rpx;border-radius: 999px;" @click.native="pay"></u-button>
						</view>
					</view>
				</view>
			</view>
		</view>
		<uni-popup ref="coupon_ref" type="bottom" background-color="#f8f8f8">
			<view>
				<view class="padding">
					<uni-segmented-control :current="current" :values="couponTabsLabel" @clickItem="onClickItem"
						styleType="button" activeColor="#000030"></uni-segmented-control>
				</view>
				<scroll-view scroll-y style="height: 700rpx;">
					<view class="padding-lr padding-bottom">
						<view>
							<view v-show="current === 0">
								<uni-collapse v-model="coupon_available_opens" style="background-color: transparent;">
									<view class="container bg-white padding-lr padding-tb-sm margin-tp"
										style="border-radius: 12rpx;" v-for="(item,index) in coupon.available"
										:key="item.id">
										<view class="margin-tb-sm">
											<view class="flex justify-between align-center text-lg">
												<text>{{item.title}}</text>
												<text class="text-red">可折扣￥{{item.discount_amount}}</text>
											</view>
											<view class="flex justify-between align-center margin-tb-xs">
												<text>有效期至{{item.end_time_format}}</text>
												<text class="text-red">{{item.label}}</text>
											</view>
										</view>
										<u-line dashed></u-line>
										<uni-collapse-item :name="'available_'+index" titleBorder="none" :border="false"
											:show-arrow="false">
											<template v-slot:title>
												<view class="flex justify-between align-center margin-top-xs">
													<view class="flex align-center">
														<text class="text-xs">使用规则</text>
														<view class="margin-left-xs">
															<u-icon name="arrow-down-fill" size="10rpx"></u-icon>
														</view>
													</view>
													<view><u-button type="primary" shape="circle" plain text="立即使用" size="mini"
															@click.native.stop="onCouponUse(item.id)"></u-button></view>
												</view>
											</template>

											<view class="text-xs">{{item.remark}}</view>
										</uni-collapse-item>
									</view>
								</uni-collapse>
								<u-empty v-if="coupon.available.length === 0" marginTop="44" text="暂无可用优惠券"
									icon="/static/empty_data.png"></u-empty>
							</view>
							<view v-show="current === 1">
								<uni-collapse v-model="coupon_unavailable_opens" style="background-color: transparent;">
									<view class="container bg-white padding-lr padding-tb-sm margin-tp"
										style="border-radius: 12rpx;" v-for="(item,index) in coupon.unavailable"
										:key="item.id">
										<view class="margin-tb-sm">
											<view class="flex justify-between align-center text-lg">
												<text>{{item.title}}</text>
												<text class="text-gray">暂不可用</text>
											</view>
											<view class="flex justify-between align-center margin-tb-xs">
												<text>有效期至{{item.end_time_format}}</text>
												<text class="text-red">{{item.label}}</text>
											</view>
										</view>
										<u-line dashed></u-line>
										<uni-collapse-item :name="'unavailable_'+index" titleBorder="none"
											:border="false" :show-arrow="false">
											<template v-slot:title>
												<view class="flex justify-between align-center margin-top-xs">
													<view class="flex align-center">
														<text class="text-xs">使用规则</text>
														<view class="margin-left-xs">
															<u-icon name="arrow-down-fill" size="10rpx"></u-icon>
														</view>
													</view>
												</view>
											</template>
											<view class="text-xs">{{item.remark}}</view>
										</uni-collapse-item>
									</view>
								</uni-collapse>
								<u-empty v-if="coupon.unavailable.length === 0" marginTop="44" text="暂无不可用优惠券"
									icon="/static/empty_data.png"></u-empty>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>

		</uni-popup>
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
				from_cart: '0',
				current: 0,
				// 购物车传过来的数据
				ans_list: '',
				// 结算的产品
				goods_list: [],
				express: {
					amount: '0.00'
				},
				total: {
					amount_goods: '0.00',
					amount_integral: '0.00',
					express_amount: '0.00',
					discount_amount: '0.00',
					amount_real: '0.00'
				},
				orderLoading: false,
				loaded: false,
				coupon: {
					available: [],
					unavailable: [],
					used: {}
				},
				coupon_id: '',
				switchChecked: false,
				integral_available: 0,
				use_available: false,
				coupon_available_opens: [],
				coupon_unavailable_opens: [],
				// couponTabsLabel: ['可用（0）', '不可用（0）']
			};
		},
		computed: {
			total_order_amount() {
				return parseInt(this.total.amount_real || 0);
			},
			total_order_amount_ceil() {
				let str = this.total.amount_real || '0.00'
				return str.substring(str.indexOf(".") + 1, str.indexOf(".") + 3);
			},
			couponTabsLabel() {
				return ['可用(' + this.coupon.available.length + ')', '不可用(' + this.coupon.unavailable.length + ')']
			},
			...mapGetters({
				address_current: 'user_address/address_current',
				address_current_id: 'user_address/address_current_id'
			})
		},
		onLoad(options) {
			this.ans_list = options.key
			this.switchChecked = options.use_integral == '1' ? true : false
			this.from_cart = options.from_cart === '1' ? '1' : '0'
			// console.log(this.address_current)
			// console.log(this.address_current_id)
		},
		onShow() {
			checkLogin(() => {
				this.loadData()
				axios.get('/api/v1/user/info').then(res => {
					if (res.code === 1) {
						this.integral_available = res.data.integral_available
					}
				})
				axios.get('/api/v1/user/address').then(res => {
					if (res.code === 1) {
						this.$store.commit('user_address/update_user_address_list', {
							address_list: res.data.list
						})
					}
				})
			})
		},
		methods: {
			openCouponPopup() {
				this.$refs.coupon_ref.open()
			},
			onNotUseCoupon() {
				this.coupon_id = '-1'
				this.loadData()
			},
			onCouponUse(id) {
				this.coupon_id = id
				this.$refs.coupon_ref.close()
				this.loadData()
			},
			onClickItem(e) {
				if (this.current != e.currentIndex) {
					this.current = e.currentIndex;
				}
			},
			onSwitchChange(e) {
				this.switchChecked = e
				this.loadData()
			},
			// 创建订单+支付接口
			pay() {
				console.log('创建订单')
				if (!this.address_current_id) {
					uni.showToast({
						title: '请选择收货地址',
						icon: 'none'
					})
					return false
				}
				if (this.orderLoading !== false) {
					return false
				}
				this.orderLoading = true
				let params = this.createParams()
				axios.post('/api/v1/user/order/create', params).then(async (res) => {
					if (res.code === 1) {
						axios.get('/api/v1/user/goods/cart_num').then(res => {
							if (res.code === 1) {
								this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
									number: res.data
								})
							}
						}).catch(err => {
							console.log(err)
						})
						// 下单成功 获取订单支付参数
						const paymentRes = await axios.post('/api/v1/user/order/payment', {
							order_no: res.data.order_no
						})
						if (paymentRes.code === 1) {
							this.orderLoading = false
							uni.requestPayment({
								...paymentRes.data.param,
								success: (red) => {
									if (red.errMsg == "requestPayment:ok") {
										uni.navigateTo({
											url: '/pages/my/my_order/my_order',
										})
									}
								},
							})
						} else {
							this.resetPay(paymentRes.info, true)
						}
					}
				})
			},
			resetPay(msg, golist = false) {
				uni.showToast({
					title: msg,
					icon: "none"
				})
				setTimeout(() => {
					this.orderLoading = false
					if (golist) {
						uni.navigateTo({
							url: '/pages/my/my_order/my_order',
						})
					}
				}, 1500)
			},
			createParams() {
				let params = {
					items: this.ans_list,
				}
				if (this.address_current_id > 0) {
					params.address_name = this.address_current.name
					params.address_phone = this.address_current.phone
					params.address_province = this.address_current.province
					params.address_city = this.address_current.city
					params.address_area = this.address_current.area
					params.address_content = this.address_current.address
				}
				params.coupon_id = this.coupon_id
				params.integral = this.switchChecked ? '1' : '0'
				console.log(params)
				params.from_cart = this.from_cart
				return params
			},
			loadData() {
				let params = this.createParams()
				axios.post("/api/v1/user/order/confirm", params).then(res => {
					if (res.code === 1) {
						let {
							items,
							express,
							coupon,
							total
						} = res.data
						this.total = Object.assign({}, this.total, total)
						this.goods_list = items
						this.coupon = coupon
						// this.couponTabsLabel[0] = '可用（' + coupon.available.length + '）'
						// this.couponTabsLabel[1] = '不可用（' + coupon.unavailable.length + '）'
						this.loaded = true
						if (res.data.items.length === 1 && res.data.items[0].integral_limit !== '0.00') {
							this.use_available = true
						}

						console.log(this.coupon)
						// setTimeout(() => {
						// 	this.$refs.coupon_ref.open()
						// }, 1500)
					}
				}).catch(error => {
					console.log(error)
					uni.showToast({
						title: '出错了，请稍后重试！',
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