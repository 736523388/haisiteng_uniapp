<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<!-- 轮播图 -->
			<view class="goods-swiper-box">
				<swiper class="screen-swiper square-dot" circular :autoplay="detail.video == ''" interval="5000"
					duration="500" @change="swiperChange">
					<swiper-item v-for="(item, index) in sliderInfo" :key="item.url">
						<video v-if="item.type == 'video'" style="width: 100%;" :src="item.url" autoplay loop muted
							:show-play-btn="false" :controls="false" object-fit="cover"></video>
						<view v-if="item.type == 'image'" @click="showPreviewImage(item.url)">
							<image style="width: 100%;" :src="item.url" mode="widthFix"></image>
						</view>
					</swiper-item>
				</swiper>
				<view class="goods-swiper-dot">{{current+1}}/{{sliderInfo.length}}</view>
			</view>

			<view class="bg-white padding-lr padding-tb-sm">
				<view class="margin-top-sm text-bold text-lg">{{detail.name}}</view>
				<view class="flex justify-between align-center margin-top-sm">
					<view class="text-bold text-sm flex" style="align-items: baseline;">
						<view class="margin-right-sm text-lg text-lighter">
							<text>￥{{ checkspec.price_selling ? checkspec.price_selling:detail.price_selling }}</text>
						</view>
						<view v-if="detail.price_market != detail.price_selling" class="flex align-center text-lighter" style="padding: 4rpx 10rpx;border-radius: 999rpx;opacity: .7;text-decoration: line-through;">
							<text>原价￥{{ checkspec.price_market ? checkspec.price_market:detail.price_market }}</text>
						</view>
					</view>
					<!-- <view style="opacity: .5;">已售{{detail.stock_total_txt}}</view> -->
				</view>
				<view class="text-sm margin-top-sm goods-integral" v-if="detail.integral_num > 0">积分可抵扣￥{{detail.integral_price}}</view>
				
				
			</view>
			<!-- <view class="flex align-center justify-between bg-white margin-top-xs padding-lr padding-tb-sm" @click="showSpecModal">
				<view>当前选择</view>
				<view class="flex align-center" :class="{'opacity_5':!checkspec.price_selling}">
					<view>{{ checkspec.price_selling ? checkspec.goods_spec_alias:'选择规格' }}</view>
					<view class="margin-left-xs">＞</view>
				</view>
			</view> -->
			<view class="margin-top-sm text-center" style="opacity: .7;">一 详情 一</view>
			<view class="margin-top-sm" style="padding-bottom: 160rpx;">
				<rich-text style="font-size: 0;" :nodes="detail.content"></rich-text>
			</view>
		</view>
		<!-- 固定在底部的菜单栏 -->
		<view class="bg-white flex align-center"
			style="position: fixed;bottom: 0;width: 100%;padding-bottom: env(safe-area-inset-bottom);z-index: 888;">
			<view style="position: relative;width: 100rpx;padding: 10rpx 0;">
				<button class="u-reset-button custom-button" open-type="contact" hover-class="bg-gray">
					<uni-icons type="chat" size="36"></uni-icons>
				</button>
			</view>
			<view style="position: relative;width: 100rpx;padding: 10rpx 0;">
				<button @click="gotoShopCart" class="u-reset-button custom-button" hover-class="bg-gray">
						<uni-icons type="cart" size="36"></uni-icons>
				</button>
				<u-badge numberType="ellipsis" :max="99" bgColor="#fa3534" type="error" :value="goods_cart_number"
					:offset="[2,2]" absolute></u-badge>
			</view>
			<view class="flex justify-around flex-sub align-center" style="flex: 1;padding: 10rpx;margin-left: 10px;">
				<view style="width: 45%;">
					<button type="default" :plain="true" hover-class="none" @click="showSpecModal" :data-index="1" style="font-size: 14px;padding-left: 10px;padding-right: 10px;opacity: .7;">放入购物袋</button>
				</view>
				<view style="width: 45%;">
					<button type="default" @click="showSpecModal" :data-index="2" style="color: #fff;background-color: #0B1839;font-size: 14px;padding-left: 10px;padding-right: 10px;">即刻购买</button>
				</view>
			</view>

		</view>
		<!-- 弹出层部分 -->
		<uni-popup ref="spec_popup" type="bottom" @change="onSpecPopupChange">
			<!-- 选择规格 -->
			<view class="spec-box bg-white">
				<view class="spec-box-line"></view>
				<view class="flex align-center margin-top-xl" style="height: 160rpx;">
					<view style="width: 160rpx;height: 100%;">
						<image :src="checkspecImage != '' ? checkspecImage : detail.cover" mode="scaleToFill" style="width: 100%;height: 100%;"></image>
					</view>
					<view class="flex margin-left flex-direction justify-end flex-sub"
						style="height: 100%;">
						<view style="margin-bottom: auto;letter-spacing: 2rpx;">{{detail.name}}</view>
						<view class="margin-left-xs text-lighter">
							<text>¥</text><text style="margin-left: 4rpx;">{{ checkspec.price_selling ? checkspec.price_selling:detail.price_selling }}</text>
						</view>
					</view>
				</view>
				<view class="margin-top" v-for="(item, index) in detail.specs" :key="item.spec">
					<view v-if="detail.specs && detail.specs.length > 0">
						{{detail.specs.length == 1 ? '选择规格': item.name}}
					</view>
					<view class="flex flex-wrap margin-top"
						v-if="(detail.specs && detail.specs.length > 0) || item.list.length > 1">
						<view class="spec_item text-df"
							:class="{active: value.is_seleted === true, 'disabled': value.is_seleted !== true && value.is_elective === false}"
							:data-key1="index" :data-key2="key" @click='setSpecSeleted' v-for="(value,key) in item.list"
							:key="value.spec_item" v-show="value.show">
							{{value.name}}
						</view>
					</view>
				</view>
				<view class="flex align-center margin-tb-sm justify-between">
					<view>数量</view>
					<view @click.stop>
						<u-number-box v-model="goods_number" @change="onNumChange" :min="1" :max="maxNum" integer
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
				checkspecImage: '',
				showSpecFlag: false,
				goods_number: 1,
				checkSpecArr: [],
				sliderInfo: [],
				current: 0,
			}
		},
		computed: {
			...mapState({
				// 购物车商品数量
				goods_cart_number: state => state.goods_cart.goods_cart_number,
				// 用户信息
				userinfo: state => state.user.userinfo
			}),
			// 最大数量
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
			// 保存推荐来源
			if (options.uid) {
				uni.setStorageSync('pid', options.uid)
			}
			// 场景值处理 推广二维码来源
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
				})
			} else {
				this.channel = options.channel || ''
				if (this.channel) {
					uni.setStorageSync('channel', this.channel)
				}
				this.aid = options.id
			}
			this.loadData(this.aid)


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
			swiperChange(e) {
				this.current = e.detail.current
			},
			showPreviewImage(url) {
				let index = this.detail.slider.findIndex(item => item == url)
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
						goods_number: this.goods_number,
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
								this.aid + '@' + this.checkspec.goods_spec + '@' + this.goods_number
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
						this.detail = res.data
						const sliderInfo = res.data.slider.map((item, index) => {
							return {
								type: 'image',
								url: item
							}
						})
						if (res.data.video != '') {
							sliderInfo.unshift({
								type: 'video',
								url: res.data.video
							})
						}
						this.sliderInfo = sliderInfo
						// 商品规格处理
						const specs = res.data.specs
						specs.forEach((v, vk) => {
							this.checkSpecArr[vk] = ""
							v.has_image = v.has_image || false
							for(let tk in v.list) {
								v.list[tk] = Object.assign(v.list[tk], {
									is_seleted: false,
									is_elective: this.checkIsElective(v.name + '::' + v.list[tk]
										.name)
								})
							}					
						})
						// this.specChanged()
						this.$nextTick(() => {
							this.loaded = true
						})
						console.log(specs)
						console.log(this.checkSpecArr)
					}
				})
			},
			gotoShopCart() {
				console.log('跳转到购物车')
				let params = {
					url: '/pages/shopCart/shopCart',
					success: res => {
						console.log(res)
					},
					fail: err => {
						console.log(err)
					}
				}
				console.log(params)
				try {
					uni.reLaunch(params)
				} catch (error) {
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
				console.log(specs)
				let currentGroup = specs[i]
				console.log(currentGroup)
				let currentSpec = specs[i].list[j];

				//如果点击项不可点击 则打断不往下执行
				if (currentSpec.is_elective === false) {
					return false
				}
				
				currentSpec.is_seleted = !currentSpec.is_seleted
				console.log(currentSpec)
				if (currentSpec.is_seleted === true) {
					this.checkSpecArr[i] = currentSpec.group + '::' + currentSpec.name
					if(currentGroup.has_image) {
						this.checkspecImage = currentSpec.image || ''
					}
					
				} else {
					this.checkSpecArr[i] = ''
					if(currentGroup.has_image) {
						this.checkspecImage = ''
					}
				}
				console.log('checkSpecArr', this.checkSpecArr)
				console.log('checkspecImage', this.checkspecImage)
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
							this.checkspec = specitem
						}
					})
				} else {
					this.checkspec = {}
				}
				console.log(this.detail)
				console.log(this.checkspec)
				this.goods_number = 1
			},
		}
	}
</script>

<style lang="scss" scoped>
	.goods-swiper-box {
		height: 735rpx;
		position: relative;

		.goods-swiper-dot {
			position: absolute;
			bottom: 10rpx;
			right: 10rpx;
			background-color: #e8e8e8;
			padding: 4rpx 16rpx;
			border-radius: 999rpx;
			font-size: 20rpx;
		}
		.screen-swiper {
			min-height: 735rpx;
		}
	}
	
	.goods-integral{
		background-color: #0B1839;
		color: #fff;
		display: inline-block;
		padding: 0 10rpx;
		border-radius: 6rpx;
	}
	
	.spec-box{
		padding: 10rpx 40rpx 120rpx 40rpx;
		margin-bottom: env(safe-area-inset-bottom);
		border-radius: 20px 20px 0 0;
		
		.spec-box-line{
			width: 40px;
			border-bottom: 3px solid #000;
			margin: 0 auto;
			opacity: .5;
		}
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