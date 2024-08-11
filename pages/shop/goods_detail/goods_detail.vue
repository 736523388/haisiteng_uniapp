<template>
	<view class="bg-white">
		<u-toast ref="uToast"></u-toast>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<!-- 轮播图 -->
			<swiper class="screen-swiper square-dot" indicator-dots circular :autoplay="detail.video == ''"
				interval="5000" duration="500" indicator-color="#6b7280" indicator-active-color="#374151">
				<swiper-item v-if="detail.video != ''">
					<video style="width: 100%;" :src="detail.video" autoplay loop muted :show-play-btn="false"
						:controls="false" object-fit="cover"></video>
				</swiper-item>
				<swiper-item v-for="(item, index) in detail.slider" :key="item">
					<view @click="showPreviewImage(index)">
						<image style="width: 100%;" :src="item" mode="widthFix"></image>
					</view>
				</swiper-item>
			</swiper>
			<view class="bg-white padding-sm">
				<view>
					<!-- 					<view v-if="detail.activity_title != null" class="text-white"
						style="background-color: #e43d33;flex: 1;">
						{{detail.activity_title}}
					</view> -->
					<text v-if="detail.activity_title != null" class="text-white" style="background-color: #e43d33;border:1px solid #e43d33;padding: 1px 3px;border-radius: 2px;font-size: 12px;
">{{detail.activity_title}}</text>
					<text class="margin-left-xs">{{detail.name}}</text>
				</view>
				<view class="margin-top-xs flex align-center">
					<view style="text-decoration: line-through;" v-if="detail.price_market != detail.price_selling">
						<!-- <text class="text-sm" style="text-decoration: line-through;">¥</text> -->
						<text
							class="text-lg margin-left-xxs text-gray">¥{{ checkspec.price_market ? checkspec.price_market:detail.price_market }}</text>
					</view>
					<view class="margin-left-xs">
						<text
							class="text-lg margin-left-xxs text-red">¥{{ checkspec.price_selling ? checkspec.price_selling:detail.price_selling }}</text>
					</view>
					<text class="text-sm margin-left-xxs" v-if="!checkspec.id">起</text>
					<text class="margin-left-xxs"
						v-if="(checkspec.id && checkspec.integral_num > 0) || detail.integral_num > 0">+{{checkspec.integral_num ? checkspec.integral_num : detail.integral_num}}积分</text>
					<view class="text-sm margin-left-xxs"> / 件</view>
				</view>

				<!-- <view class="">{{checkspec.goods_spec_alias}}</view> -->
				<view class="text-sm text-desc">{{detail.remark}}</view>
			</view>
			<view class="margin-top-sm" style="padding-bottom: 160rpx;">
				<rich-text style="font-size: 0;" :nodes="detail.content"></rich-text>
			</view>
		</view>
		<view class="bg-white flex align-center"
			style="position: fixed;bottom: 0;width: 100%;padding-bottom: env(safe-area-inset-bottom);z-index: 10080;">
			<view style="position: relative;width: 100rpx;padding: 10rpx 0;">
				<button class="u-reset-button custom-button" open-type="contact" hover-class="bg-gray">
					<u-icon name="chat" size="52rpx" label="客服" labelPos="bottom" labelSize="20rpx" space="0"></u-icon>
				</button>
			</view>
			<view style="position: relative;width: 100rpx;padding: 10rpx 0;">
				<button @click.native="gotoShopCart" class="u-reset-button custom-button" hover-class="bg-gray"><u-icon
						name="shopping-cart" size="52rpx" label="购物车" labelPos="bottom" labelSize="20rpx"
						space="0"></u-icon></button>
				<u-badge numberType="ellipsis" :max="99" bgColor="#fa3534" type="error" :value="goods_cart_number"
					:offset="[0,2]" absolute></u-badge>
			</view>
			<view style="flex: 1;padding: 10rpx;">
				<view style="border: none;display: inline-block;width: 50%;">
					<u-button type="primary" text="加入购物车" color="#0B1839"
						:custom-style="{'border-radius':'999px 0 0 999px'}" :data-index="1"
						@click.native="showSpecModal"></u-button>
				</view>
				<view style="border: none;display: inline-block;width: 50%;">
					<u-button type="primary" text="立即购买" color="#000"
						:custom-style="{'border-radius':'0 999px 999px 0'}" :data-index="2"
						@click.native="showSpecModal"></u-button>
				</view>
			</view>

		</view>
		<uni-popup ref="spec_popup" type="bottom" @change="onSpecPopupChange">
			<!-- 选择规格 -->
			<view class="spec-box bg-white"
				style="padding: 30rpx 30rpx 120rpx 30rpx;margin-bottom: env(safe-area-inset-bottom);">
				<view class="flex align-center">
					<u-image :src="detail.cover" height="224rpx" width="224rpx" />
					<view class="flex padding-right-xl margin-left-sm flex-direction justify-end"
						style="height: 224rpx;">
						<view style="margin-bottom: auto;">{{detail.name}}</view>
						<view class="flex align-center">
							<view class="text-lg" style="text-decoration: line-through;">
								¥{{ checkspec.price_market ? checkspec.price_market:detail.price_market }}
							</view>
							<view class="text-lg margin-left-xs text-red">
								¥{{ checkspec.price_selling ? checkspec.price_selling:detail.price_selling }}
							</view>
							<text class="text-sm margin-left-xxs" v-if="!checkspec.id">起</text>
							<text class="margin-left-xxs"
								v-if="(checkspec.id && checkspec.integral_num > 0) || detail.integral_num > 0">+{{checkspec.integral_num ? checkspec.integral_num : detail.integral_num}}积分</text>
							<text class="text-sm margin-left-xxs"> / 件</text>


						</view>
						<view>
							<text
								class="text-sm text-desc">剩余{{checkspec.id ? (checkspec.stock_total - checkspec.stock_sales) : (detail.stock_total-detail.stock_sales)}}件</text>
						</view>
					</view>
				</view>
				<view v-for="(item, index) in detail.specs" :key="item.spec" style="margin-top: 8rpx;">
					<view class="text-lg" v-if="detail.specs && detail.specs.length > 0">
						{{detail.specs.length == 1 ? '选择规格': item.name}}
					</view>
					<view class="flex flex-wrap"
						v-if="(detail.specs && detail.specs.length > 0) || item.list.length > 1"
						style="margin-top: 8rpx;">
						<view class="spec_item text-df"
							:class="{active: value.is_seleted === true, 'disabled': value.is_seleted !== true && value.is_elective === false}"
							:data-key1="index" :data-key2="key" @click='setSpecSeleted' v-for="(value,key) in item.list"
							:key="value.spec_item" v-show="value.show">
							{{value.name}}
						</view>
					</view>
				</view>
				<view class="flex align-center margin-tb-sm justify-between">
					<view class="text-lg">数量</view>
					<view @click.stop>
						<u-number-box v-model="Num" @change="onNumChange" :min="1" :max="maxNum" integer
							:button-size="24"></u-number-box>
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	import {
		axios,
		checkLogin
	} from '@/utils/request'
	export default {
		data() {
			return {
				aid: '',
				channel: '',
				loaded: false,
				detail: {},
				checkspec: {},
				showSpecFlag: false,
				Num: 1,
				checkSpecArr: [],
			}
		},
		computed: {
			...mapState({
				goods_cart_number: state => state.goods_cart.goods_cart_number,
				userinfo: state => state.user.userinfo
			}),
			maxNum() {
				if (this.checkspec.id) {
					return this.checkspec.stock_total - this.checkspec.stock_sales
				} else {
					return 1
				}
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.uid) {
				uni.setStorageSync('pid', options.uid)
			}
			if (options.scene) {
				const scene = decodeURIComponent(options.scene)
				console.log(scene)
				const scene_arr = scene.split('#')
				console.log(scene_arr)
				scene_arr.forEach(item => {
					const scene_arr_2 = item.split('=')
					if (scene_arr_2[0] == 'id') {
						this.aid = scene_arr_2[1]
					} else if (scene_arr_2[0] == 'channel') {
						this.channel = scene_arr_2[1]
						uni.setStorageSync('channel', this.channel)
					}
					this.loadData(this.aid)
				})

			} else {
				this.channel = options.channel || ''
				if (this.channel) {
					uni.setStorageSync('channel', this.channel)
				}
				this.aid = options.id
				this.loadData(options.id)
			}


		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage(res) {
			const url = 'pages/shop/goods_detail/goods_detail?id=' + this.aid + '&uid=' + this.userinfo.id
			console.log(url)
			return {
				title: this.detail.name,
				path: url,
				imageUrl: this.detail.cover
			}
		},
		methods: {
			showPreviewImage(index) {
				uni.previewImage({
					current: index,
					urls: this.detail.slider,
					indicator: 'number'
				})
			},
			onSpecPopupChange(e) {
				this.showSpecFlag = e.show
			},
			showSpecModal(e) {
				let index = e.currentTarget.dataset.index
				if (this.showSpecFlag === false) {
					this.$refs.spec_popup.open()
					return false
				}
				if (!this.checkspec.id) {
					uni.showToast({
						title: '请选择商品规格',
						icon: 'none'
					})
					return
				}
				if (index == 1) {
					//加入购物车
					this.addCart()
				} else if (index == 2) {
					//立即购买
					this.goToBuycreate()
				}
			},
			addCart() {
				console.log('加入购物车')
				checkLogin(() => {
					axios.post("/api/v1/user/goods/cart/add", {
						goods_id: this.aid,
						goods_spec: this.checkspec.goods_spec,
						goods_number: this.Num,
						goods_title: this.detail.name,
						goods_cover: this.detail.cover
					}).then(res => {
						this.$refs.spec_popup.close()
						if (res.code === 1) {
							this.$store.commit('goods_cart/update_goods_cart_number', {
								number: res.data
							})
							uni.showToast({
								title: res.info,
								icon: 'none'
							})
						} else {
							uni.showToast({
								title: '操作失败',
								icon: 'none'
							})
						}
					}).catch(error => {
						console.log(error)
						uni.showToast({
							title: '操作失败',
							icon: 'none'
						})
					})
				})

			},
			goToBuycreate() {
				console.log('直接购买')
				checkLogin(() => {
					if (this.checkspec.stock_total > this.checkspec.stock_sales) {
						let available_integral = this.detail.available_integral ? 1 : 0
						uni.navigateTo({
							url: '/pages/my/confirm_order/confirm_order?use_integral=' +
								available_integral +
								'&key=' +
								this.aid + '@' + this.checkspec.goods_spec + '@' + this.Num
						})
					} else {
						uni.showToast({
							title: '库存不足',
							icon: 'none'
						})
					}

				})
			},
			goods_spec_alias(items) {
				console.log(items)
				let goods_spec_alias = [];
				items.goods_spec.split(";;").map(item => {
					goods_spec_alias.push(item.split("::")[1])
				})
				items.goods_spec_alias = goods_spec_alias.join(" ")
				return items
			},
			checkIsElective(goods_spec) {
				let is_elective = false
				this.detail.items.forEach((v, vk) => {
					let onchecck = ';;' + v.goods_spec + ';;'
					if (onchecck.indexOf(';;' + goods_spec + ';;') > -1 && v.stock_total > v.stock_sales) {
						is_elective = true
					}
				})
				return is_elective
			},
			loadData(id) {
				axios.get('/api/v1/goods/' + id).then(res => {
					console.log(res)
					if (res.code === 1) {
						this.loaded = true
						this.detail = res.data

						const specs = [...res.data.specs]
						specs.forEach((v, vk) => {
							this.checkSpecArr[vk] = ""
							v.list.forEach((t, tk) => {
								t = Object.assign(t, {
									is_seleted: false,
									is_elective: this.checkIsElective(v.name + '::' + t
										.name)
								})
							})
						})
						console.log(specs)
						console.log(this.checkSpecArr)
					}
				})
			},
			gotoShopCart() {
				console.log('跳转到购物车')
				let params = {url: '/pages/shopCart/shopCart', success: res => {console.log(res)},fail: err => {console.log(err)}}
				console.log(params)
				try {
					uni.reLaunch(params)
				} catch(error) {
					console.log(error)
				}
				
			},
			onNumChange(event) {
				console.log('当前值为: ' + event.value)
			},
			setSpecSeleted(e) {
				this.specChanged(e.currentTarget.dataset.key1, e.currentTarget.dataset.key2)
			},
			checkIsElectiveFromSpecArr(specArr) {
				let is_elective = false
				for (let v of this.detail.items) {
					let onchecck = ';;' + v.goods_spec + ';;'
					let is = true
					for (let t of specArr) {
						if (onchecck.indexOf(t) === -1) {
							is = false
							break
						}
					}
					if (is !== false && v.stock_total > v.stock_sales) {
						is_elective = true
						break
					}
				}
				return is_elective
			},
			specChanged(i, j) {
				let specs = this.detail.specs
				let currentSpec = specs[i].list[j];

				//如果点击项不可点击 则打断不往下执行
				if (currentSpec.is_elective === false) {
					return false
				}
				console.log(currentSpec)
				currentSpec.is_seleted = !currentSpec.is_seleted

				if (currentSpec.is_seleted === true) {
					this.checkSpecArr[i] = currentSpec.group + '::' + currentSpec.name
				} else {
					this.checkSpecArr[i] = ''
				}
				console.log(this.checkSpecArr)
				specs[i].list.forEach((v, vk) => {
					if (vk !== j) {
						v.is_seleted = false
					}
				})
				// 处理其他规格的是否可点击状态
				specs.forEach((v, vk) => {
					if (vk !== i || currentSpec.is_seleted === false) {
						v.list.forEach((t, tk) => {
							if (t.is_seleted === false) {
								let specArr = [";;" + t.group + "::" + t.name + ";;"]
								this.checkSpecArr.forEach((c, ck) => {
									if (c !== "" && ck !== vk) {
										specArr.push(";;" + c + ";;")
									}
								})
								console.log('specArr', specArr)
								t.is_elective = this.checkIsElectiveFromSpecArr(specArr)
							}
						})
					}
				})
				console.log(specs)
				specs[i].list[j] = currentSpec
				this.detail.specs = [...specs]
				let checked = true
				for (let v of this.checkSpecArr) {
					if (v === '') {
						checked = false
						break
					}
				}
				if (checked) {
					this.detail.items.forEach((specitem, specindex) => {
						let is_check = true
						this.checkSpecArr.forEach((checkitem, checkindex) => {
							let onchecck = ';;' + specitem.goods_spec + ';;'
							if (onchecck.indexOf(';;' + checkitem + ';;') === -1) {
								is_check = false
							}
						})
						if (is_check === true) {
							specitem = this.goods_spec_alias(specitem)
							this.checkspec = specitem
						}
					})
				} else {
					this.checkspec = {}
				}
				console.log(this.detail)
				console.log(this.checkspec)
				this.Num = 1
			},
		}
	}
</script>

<style lang="scss" scoped>
	.screen-swiper {
		min-height: 735rpx;
	}

	.spec_item {
		// border: 1px solid #000;
		padding: 6rpx 30rpx;
		border-radius: 8rpx;
		margin-right: 20rpx;
		min-width: 120rpx;
		text-align: center;
		margin-bottom: 10rpx;
		background-color: #F6F6F6;
	}

	.spec_item.active {
		background-color: #0B1839;
		color: #fff;
	}

	.spec_item.disabled {
		color: #BEBEBE;
		// background-color: #e8e8e8;
		// opacity: .5;
		text-decoration: line-through;
	}

	.custom-button {
		background-color: transparent;
		/* 移除背景颜色 */
		border: none;
		/* 移除边框 */
		box-shadow: none;
		/* 移除阴影 */
		color: inherit;
		/* 文字颜色继承父元素 */
		/* 其他需要重置的样式 */
		padding: 0;
		text-align: center;
	}

	.custom-button::after {
		border: none;
	}
</style>