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
				<view class="flex" v-for="(item,index) in goods_list" :key="item.id">
					<image style="width: 200rpx;height: 200rpx;border-radius: 20rpx;" mode="aspectFill"
						:src='item.goods_cover'></image>
					<view class="margin-left" style="width: 470rpx;">
						<view class=""><text v-if="item.activity_title != null" class="text-white margin-right-xs"
								style="background-color: #e43d33;border:1px solid #e43d33;padding: 1px 3px;border-radius: 2px;font-size: 12px;
">{{item.activity_title}}</text>{{item.goods_name}}</view>
						<view class="text-gray text-sm">{{item.goods_spec_alias}}</view>
						<view class="margin-top">
							<text v-if="item.price_selling != item.price_real" class="text-xs text-gray" style="text-decoration: line-through;"><text class="text-sm">￥{{item.price_selling}}</text></text>
							<text class="text-xs">￥<text class="text-df">{{item.price_real}}</text></text>
							<text class="margin-left-xs"> x {{item.stock_sales}}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white container padding-xs margin-bottom-sm" style="border-radius: 12rpx;">
				<u-cell-group :border="false">
					<u-cell title="商品总额" :border="false" :value="'￥'+total.amount_goods"></u-cell>
					<u-cell v-if="total.activity_discount_amount_total != '0.00'" title="活动优惠" :border="false">
						<template slot="value">
							<view class="text-df text-red">-￥{{total.activity_discount_amount_total}}</view>
						</template>
						<template slot="right-icon">
							<view class="text-df" @click.native.stop="show_activity_discount=!show_activity_discount">
								<u-icon :name="show_activity_discount ? 'arrow-up':'arrow-down'"></u-icon>
							</view>
						</template>
					</u-cell>
					<view v-if="show_activity_discount">
						<u-cell v-for="item in goods_list" v-if="item.activity_discount_amount_total != '0.00'" :border="false">
							<template slot="title">
								<view class="text-sm">{{item.goods_name}}</view>
							</template>
							<template slot="value">
								<view class="text-df text-red">-￥{{item.activity_discount_amount_total}}</view>
							</template>
						</u-cell>
					</view>
					
					<u-cell :border="false" title="运费"
						:value="total.express_amount == '0.00' ? '包邮':'￥' + total.express_amount " />
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
			<view class="bg-white container padding-xs margin-bottom-sm" style="border-radius: 12rpx;">
				<u-cell-group :border="false">
					<u-cell :border="false" title="发票">
						<template slot="value">
							<view v-if="invoiceSet" class="text-df" style="line-height: 24px;"
								@click.native.stop="openInvoicePopup">
								<text>电子({{invoice.content_type == 1 ?'商品明细':'商品类别'}}-{{invoice.type == 1 ? '个人':'企业'}})</text>
							</view>
							<view v-else class="text-df" style="line-height: 24px;"
								@click.native.stop="openInvoicePopup">
								<text class="text-gray">不需要发票</text>
							</view>
						</template>
						<template slot="right-icon">
							<view class="text-df" @click.native.stop="openInvoicePopup">
								<u-icon name="arrow-right"></u-icon>
							</view>
						</template>
					</u-cell>
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
													<view><u-button type="primary" shape="circle" plain text="立即使用"
															size="mini"
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
		<uni-popup ref="invoice_ref" type="bottom" background-color="#f8f8f8" borderRadius="10px 10px 0 0">
			<view class="container padding-tb invoice-box flex flex-direction justify-between"
				style="position: relative;">
				<view>
					<view class="padding-tb-sm text-lg">发票抬头</view>
					<view class="">
						<view style="display: inline-block;">
							<u-button @click="invoice.type=1" size="small" type="primary"
								:plain="invoice.type ==2">个人</u-button>
						</view>
						<view style="display: inline-block;margin-left:20rpx;">
							<u-button @click="invoice.type=2" size="small" type="primary"
								:plain="invoice.type ==1">单位</u-button>
						</view>
					</view>
					<view class="flex align-center padding-top-sm padding-bottom-xs" style="width: 650rpx;">
						<view style="width: 180rpx;">{{invoice.type==1 ? '个人名称':'单位名称'}}</view>
						<view style="flex-grow: 1;"><input name="name" v-model="invoice.name"
								:placeholder="'请填写' + (invoice.type==1 ? '您的姓名' : '单位名称')" /></view>
					</view>
					<view v-if="invoice.type==2" class="flex align-center padding-top-xs padding-bottom-xs"
						style="width: 650rpx;">
						<view style="width: 180rpx;">纳税人识别号</view>
						<view style="flex-grow: 1;"><input name="licence_no" v-model="invoice.licence_no"
								placeholder="请填写纳税人识别码" /></view>
					</view>
					<view class="padding-tb-sm text-lg">发票内容</view>
					<view class="">
						<view style="display: inline-block;">
							<u-button @click="invoice.content_type=1" size="small" type="primary"
								:plain="invoice.content_type ==2">商品明细</u-button>
						</view>
						<view style="display: inline-block;margin-left:20rpx;">
							<u-button @click="invoice.content_type=2" size="small" type="primary"
								:plain="invoice.content_type ==1">商品类别</u-button>
						</view>
					</view>
					<view class="padding-tb-sm text-sm">
						{{invoice.content_type == 1 ? '发票内容将显示详细商品名称与价格信息' : '发票内容将显示商品所属类别及价格信息'}}，发票金额为实际支付金额，不含优惠扣减金额。
					</view>
				</view>
				<view>
					<u-button type="error" shape="circle" text="确定" @click.native="confirmInvoice"></u-button>
				</view>
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
				show_activity_discount: false,
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
				invoiceSet: false,
				invoice: {
					type: 1,
					name: "",
					licence_no: "",
					content_type: 1
				}
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
			checkLogin(async () => {
				try {
					const ref1 = await axios.get('/api/v1/user/info')
					if (ref1.code === 1) {
						this.integral_available = ref1.data.integral_available
					}
					const ref2 = await axios.get('/api/v1/user/address')
					if (ref2.code === 1) {
						this.$store.commit('user_address/update_user_address_list', {
							address_list: ref2.data.list
						})
					}
					const ref3 = await axios.get('/api/v1/user/invoice')
					if (ref3.code === 1 && ref3.data.type) {
						// this.invoiceSet = true
						this.invoice.type = ref3.data.type
						this.invoice.content_type = ref3.data.content_type
						this.invoice.name = ref3.data.name
						this.invoice.licence_no = ref3.data.licence_no
						console.log(this.invoice)
					}
				} catch (error) {
					console.log(error)
				}
				this.loadData()

			})
		},
		methods: {
			confirmInvoice() {
				console.log(this.invoice)
				if (this.invoice.name == '') {
					uni.showToast({
						title: '请输入' + (this.invoice.type == 1 ? '您的姓名' : '单位名称'),
						icon: 'none',
						duration: 1200
					})
					return
				}

				if (this.invoice.type == 2 && this.invoice.licence_no == '') {
					uni.showToast({
						title: '请输入纳税人识别号',
						icon: 'none',
						duration: 1200
					})
					return
				}
				this.invoiceSet = true
				this.$refs.invoice_ref.close()
			},
			openInvoicePopup() {
				this.$refs.invoice_ref.open()
			},
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
				if (this.invoiceSet) {
					params.need_invoice = 1
					params.invoice_type = this.invoice.type
					params.invoice_content_type = this.invoice.content_type
					params.invoice_name = this.invoice.name
					params.licence_no = this.invoice.licence_no

					if (params.invoice_type == 2 && params.licence_no == "") {
						uni.showToast({
							title: '请补充纳税人识别号',
							icon: 'none'
						})
						this.openInvoicePopup()
						this.orderLoading = false
						return false
					}
				}
				// 创建订单时传递渠道码
				params.spread_channel = uni.getStorageSync('channel') || ''
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
						uni.redirectTo({
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
			async loadData() {
				let params = this.createParams()
				try {
					const res = await axios.post("/api/v1/user/order/confirm", params)
					if (res.code !== 1) {
						throw new Error(res.info)
					}
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
				} catch (error) {
					uni.showToast({
						title: '出错了，请稍后重试！',
						icon: 'none',
						duration: 1200
					})
					// setTimeout(() => {
					// 	uni.navigateBack()
					// }, 1200)
				}
			},
		}
	}
</script>

<style lang="scss">
	.invoice-box {
		height: 65vh;
	}
</style>