<template>
	<view style="height: 100%;background-color: #fff;">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="is_login && loaded && (carts.length > 0 || invalid.length > 0)">
			<view class="flex justify-between align-center bg-white margin-bottom-sm padding-sm">
				<view class="flex align-center"><u-icon name="bag" /><text>Hastens海丝腾官方旗舰店</text></view>
				<view v-if="carts.length > 0" @click="showRemoveBtn=!showRemoveBtn">
					<text>{{showRemoveBtn ? '完成':'编辑'}}</text>
				</view>
			</view>
			<view v-for="(item,index) in carts" :key="item.id" class="bg-white flex align-center padding-sm"
				style="border-bottom: 1px solid #F3F4F6;" @click="selectList" :data-index="index" :data-id="item.id">
				<view class="margin-right-sm">
					<uni-icons type="checkbox-filled" size="20" v-if="item.selected"></uni-icons>
					<uni-icons type="circle" size="20" color="#afafaf" v-else></uni-icons>
				</view>

				<view>
					<view style="width: 180rpx;height: 180rpx;">
						<image style="width: 100%;height: 100%;"
							@click.stop="$globalJump2View('/pages/shop/goods_detail/goods_detail?id='+item.goods_id)"
							mode="aspectFill" :src="item.goods_cover"></image>
					</view>
				</view>
				<view class="flex flex-direction justify-between" style="height: 180rpx;width: 100%;">
					<view class="goods-card-title">
						<text><text v-if="item.activity_title" class="text-white margin-right-xs" style="background-color: #e43d33;border:1px solid #e43d33;padding: 1px 3px;border-radius: 2px;font-size: 12px;
">{{item.activity_title}}</text>{{item.goods_title}}</text>
					</view>
					<view class="padding-left-sm text-xs">{{item.goods_spec_alias}}<text v-if="item.stock < 10"
							class="margin-left-xs text-gray">仅剩{{item.stock}}件</text></view>
					<view class="goods-card-price">
						<view>
							<view>
								<text class="margin-left-xs text-gray" style="text-decoration: line-through;"
									v-if="item.price_market != item.price_selling">¥{{item.price_market}}</text>
								<text class="goods-card-price-striking text-red" style="font-size: 20rpx;">¥</text>
								<text class="goods-card-price-striking text-red">{{item.price_selling}}</text>
							</view>
						</view>
						<view @click.stop>
							<u-number-box v-model="item.goods_number" :asyncChange="true"
								@change="valChange(index, $event)" :min="0" :max="item.stock" integer
								:button-size="22"></u-number-box>
						</view>
					</view>
				</view>
			</view>
			<view class="bg-white margin-top-sm" v-if="invalid.length > 0">
				<view class="flex justify-between align-center padding-sm">
					<view style="opacity: .5;">失效商品{{invalid.length}}件</view>
					<view style="opacity: .8;"><u--text @click="removeLoseGoods" type="primary" size="12"
							text="移除失效商品"></u--text></view>
				</view>
				<view v-for="(item,index) in invalid" :key="item.id" class="bg-white flex align-center padding-sm"
					style="border-bottom: 1px solid #F3F4F6;opacity: .5;">
					<view class="margin-right-sm">
						<uni-icons type="circle" size="20" color="#afafaf"></uni-icons>
					</view>
					<view>
						<view style="width: 180rpx;height: 180rpx;">
							<image style="width: 100%;height: 100%;" mode="aspectFill" :src="item.goods_cover"></image>
						</view>
					</view>
					<view class="flex flex-direction justify-between" style="height: 180rpx;width: 100%;">
						<view class="goods-card-title">
							<text>{{item.goods_title}}</text>
						</view>
						<view class="padding-left-sm text-xs">{{item.goods_spec_alias}}</view>
						<view class="goods-card-price">
							<view>
								<view class="text-sm" style="border: 1px solid #ccc;padding: 0 6rpx;">
									<text>{{item.goods_status == 0 || item.goods_item_status == 0 ? '商品已下架':'商品库存不足'}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view class="cart-footer-t"></view>
			<view class="cart-footer align-center">
				<!-- -------------------底部全选模块------------------ -->
				<view class='allselect'>
					<view @click="selectAll" class="text-xl flex margin-left-sm justify-start align-center">
						<uni-icons type="checkbox-filled" size="20" v-if="selectAllStatus"></uni-icons>
						<uni-icons type="circle" size="20" color="#afafaf" v-else></uni-icons>
						<text>全选</text>
					</view>
				</view>
				<view class="padding-right flex justify-end align-center" style="margin-left: auto;">
					<view v-if="!showRemoveBtn">
						<text>合计:<text class="text-xl text-red text-bold"><text
									class="text-sm">￥</text>{{totalPrice}}</text></text>
					</view>
					<view v-if="!showRemoveBtn">
						<u-button @click.native="topay" custom-style="width: 100rpx;margin-left: 12rpx;" size="small"
							type="primary" text="去结算"></u-button>
					</view>
					<view v-else>
						<u-button @click.native="removeGoodsFromCart" custom-style="width: 100rpx;margin-left: 12rpx;"
							size="small" type="primary" text="删除"></u-button>
					</view>

				</view>
			</view>
		</view>
		<view class="bg-white" style="height: 100%;"
			v-if="loaded && ((carts.length === 0 && invalid.length === 0) || !is_login)">
			<u-empty mode="data" icon="/static/empty_data.png" :text="is_login ? '购物车是空的 ~ 快去逛逛吧':'你未登录 ~'">
				<view class="margin-top">
					<u-button v-if="is_login" @click="$globalJump2View('/pages/shop/goods_index/goods_index')"
						type="primary" size="small" shape="circle" text="去逛逛"></u-button>
					<u-button v-else @click="$globalJump2View('/pages/login/login')" type="primary" size="small"
						shape="circle" text="点击注册/登录"></u-button>
				</view>
			</u-empty>
		</view>
		<drag-button :isDock="true" :existTabBar="true" />
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request'
	import {
		Calc
	} from '@/utils/util'
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				carts: [],
				invalid: [],
				totalPrice: 0,
				selectAllStatus: false,
				loaded: false,
				loading: false,
				showRemoveBtn: false
			};
		},
		computed: {
			...mapState({
				goods_cart_number: state => state.goods_cart.goods_cart_number
			}),
			...mapGetters({
				is_login: 'user/is_login',
			})
		},
		onShow() {
			console.log('当前购物车数量', this.goods_cart_number)
			this.selectAllStatus = false
			if (this.is_login) {
				this.loadData()
			} else {
				this.loaded = true
			}
		},
		methods: {
			removeLoseGoods() {
				console.log('移除失效商品')
				let id = ''
				for (let k in this.invalid) {
					id += id ? ',' : ''
					id += this.invalid[k].id
				}
				if (!id) {
					uni.showToast({
						title: '没有要移除的商品',
						icon: 'none'
					})
					return
				}
				uni.showModal({
					title: '提示',
					content: '确定移除失效商品?',
					success: res => {
						if (res.confirm) {
							axios.post('/api/v1/user/goods_cart/remove', {
								id
							}).then(ref => {
								uni.$u.toast(ref.info, 1200);
								if (ref.code === 1) {
									this.$store.dispatch(
										'goods_cart/update_goods_cart_number_badge', {
											number: ref.data
										})
									setTimeout(() => {
										this.loadData()
									}, 1200)
								}
							}).catch(err => {
								uni.$u.toast("删除失败");
							})
						}

					},
				})

			},
			loadData() {
				axios.get('/api/v1/user/goods/cart').then(res => {
					if (res.code === 1) {
						let carts = res.data.list
						for (let k in carts) {
							carts[k].selected = false
							// carts[k].slideviewShow = false
						}
						this.carts = carts
						this.getTotalPrice();
						this.invalid = res.data.invalid
					}
				}).finally(() => {
					this.loaded = true
				})
			},
			getTotalPrice() {
				let totalPrice = 0
				for (let k in this.carts) {
					if (this.carts[k].selected === true) {
						// totalPrice += this.carts[k].goods_number * this.carts[k].price_selling
						totalPrice = Calc.Add(totalPrice, Calc.Mul(this.carts[k].goods_number, this.carts[k]
							.price_selling))
					}
				}
				this.totalPrice = totalPrice.toFixed(2)
			},
			selectList(e) {
				let id = e.currentTarget.dataset.id
				let index = this.carts.findIndex(item => item.id === id)
				if (this.carts[index].stock < 1) {
					uni.showToast({
						title: '库存不足',
						icon: 'none',
						duration: 1200
					})
					return
				}
				this.carts[index].selected = !this.carts[index].selected
				this.carts = [...this.carts]
				let selectAllStatus = true
				for (let k in this.carts) {
					selectAllStatus = selectAllStatus && this.carts[k].selected
				}
				this.selectAllStatus = selectAllStatus
				this.getTotalPrice()
			},
			valChange(index, e) {
				console.log(index, e)
				console.log(this.carts[index].goods_number)
				const pre_number = this.carts[index].goods_number
				if (e.value > 0) {
					uni.showLoading()
					axios.post('/api/v1/user/goods/cart', {
						...this.carts[index],
						...{
							goods_number: e.value
						}
					}).then(res => {
						uni.hideLoading()
						if (res.code !== 1) {
							setTimeout(() => {
								uni.$u.toast(res.info);
							}, 200)
						} else {
							this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
								number: res.data
							})
							this.carts[index].goods_number = e.value
							this.getTotalPrice();
						}
					}).catch(error => {
						uni.hideLoading()
						setTimeout(() => {
							uni.$u.toast('操作失败');
						}, 300)
					})
				} else {
					uni.showModal({
						title: '提示',
						content: '确定移除购物车?',
						// showCancel: true,
						// cancelText: "取消",
						// cancelColor: '#000000',
						// confirmText: '确定',
						// confirmColor: '#3CC51F',
						success: res => {
							//  点击确定，即删除商品
							if (res.confirm) {
								console.log('确定移除购物车')
								axios.delete('/api/v1/user/goods/cart/' + this.carts[index].id).then(ref => {
									if (ref.code === 1) {
										let new_goods_number = this.goods_cart_number - 1
										this.$store.dispatch(
											'goods_cart/update_goods_cart_number_badge', {
												number: new_goods_number
											})
										uni.$u.toast(ref.info);
										setTimeout(() => {
											this.loadData()
										}, 1500)
									} else {
										uni.$u.toast('网络错误，请稍后再试！');
									}
								}).catch(err => {
									uni.$u.toast('网络错误，请稍后再试！');
								})
							}
						},
					})
				}

			},
			// ----------------------------购物车全选事件----------------------------
			selectAll() {
				this.selectAllStatus = !this.selectAllStatus
				for (let k in this.carts) {
					if (this.carts[k].stock > 0) {
						this.carts[k].selected = this.selectAllStatus
					}

				}
				this.getTotalPrice();
			},
			createParams() {
				let params = ''
				for (let k in this.carts) {
					if (!this.carts[k].selected) {
						continue;
					}
					params += params ? '||' : ''
					params += this.carts[k].goods_id + '@' + this.carts[k].goods_spec + '@' + this.carts[k].goods_number
				}
				console.log(params)
				return params
			},
			/**
			 * 结算
			 */
			topay(e) {
				const params = this.createParams()
				if (!params) {
					uni.showToast({
						title: '请选择要购买的商品',
						icon: 'none'
					})
					return false
				}
				uni.navigateTo({
					url: '/pages/my/confirm_order/confirm_order?key=' + params + '&from_cart=1',
				})
			},
			removeGoodsFromCart() {
				let id = ''
				for (let k in this.carts) {
					if (!this.carts[k].selected) {
						continue;
					}
					id += id ? ',' : ''
					id += this.carts[k].id
				}
				if (!id) {
					uni.showToast({
						title: '请选择要移除的商品',
						icon: 'none'
					})
					return
				}
				uni.showModal({
					title: '提示',
					content: '确定移除选中商品?',
					success: res => {
						if (res.confirm) {
							axios.post('/api/v1/user/goods_cart/remove', {
								id
							}).then(ref => {
								uni.$u.toast(ref.info, 1200);
								if (ref.code === 1) {
									this.$store.dispatch(
										'goods_cart/update_goods_cart_number_badge', {
											number: ref.data
										})
									setTimeout(() => {
										this.loadData()
									}, 1200)
								}
							}).catch(err => {
								uni.$u.toast("删除失败");
							})
						}

					},
				})

			}
		}
	}
</script>

<style lang="scss" scoped>
	// page {
	// 	position: absolute;
	// 	top: 0;
	// 	right: 0;
	// 	left: 0;
	// 	bottom: 0;
	// }
	// page {
	// 	height: calc(100% - 44px - 50px);
	// }
	.main {
		background-color: #fff;
		height: 100%;
	}

	.cart-footer-t {
		// height: calc(env(safe-area-inset-bottom) + 98rpx);
		// height: calc(var(--window-bottom) + 98rpx);
		// width: 100%;
		padding-bottom: 98rpx;
	}

	.cart-footer {
		position: fixed;
		bottom: var(--window-bottom);
		// padding-bottom: env(safe-area-inset-bottom);
		// box-sizing: content-box;
		// left: 0;
		// right: 0;
		width: 100%;
		height: 98rpx;
		background: #fff;
		display: flex;
		justify-content: space-between;
		z-index: 2;

		.allselect {
			// width: 25%;
			height: 100%;

			>view {
				// width: 100%;
				height: 100%;

				text {
					color: #121314;
					font-weight: 600;
					font-size: 28rpx;
					margin-left: 10rpx;
				}
			}
		}
	}

	.cart-footer>view {
		height: 100%;
	}

	.allprice {
		width: 49%;
		height: 100%;
		display: flex;
		justify-content: flex-end;
		white-space: nowrap;
		overflow: auto;
		text-align: center;
		box-sizing: border-box;
		padding: 0 10rpx;
	}

	.allprice text {
		text-align: center;
		line-height: 98rpx;
	}



	.order-icon {
		width: 25.35%;
		background: #000030;
		line-height: 98rpx;
		text-align: center;
		color: #fff;
	}

	.order-icon>text {
		font-size: 30rpx;
	}

	.goods-card-title {
		padding: 10rpx 20rpx;
		/* color: #374151; */
		font-size: 24rpx;
		font-weight: 500;
	}

	.goods-card-price {
		/* padding: 10rpx 20rpx 20rpx 20rpx; */
		padding: 0 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}

	.goods-card-price view {
		// display: inline-block;
	}

	.goods-card-price-striking {
		/* color: #DC2626; */
		font-weight: 600;
		font-size: 28rpx;
		padding-left: 6rpx;
	}
</style>