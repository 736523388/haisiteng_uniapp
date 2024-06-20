<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<image style="width: 750rpx;" mode="widthFix"
				src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E5%85%BB%E6%8A%A4%E4%B8%AD%E5%BF%831634107335313.png" />
			<view style="background-color: #fff;">
				<view class="container">
					<view class="text-xxl padding-top-sm margin-bottom-sm text-red">{{service_price}} <text
							class="text-sm">元/次</text></view>
					<view class="text-xxl">保养服务</view>
				</view>
			</view>
			<view class="margin-top padding-bottom" style="background-color: #fff;">
				<view class="container padding-top-sm padding-bottom-sm flex align-center">
					<view class="text-xl" style="margin-right: 40rpx;">时间</view>
					<picker mode="date" :value="date" :start="min_date" :end="max_date" @change="bindDateChange">
						<view class="picker" :class="{'text-gray': date==''}" style="margin-right: 40rpx;">
							{{date == '' ? '请选择服务日期' :date}}
						</view>
					</picker>
					<picker :value="index" :range="array" @change="bindPickerChange">
						<view class="picker" :class="{'text-gray': index===''}">
							{{index === '' ? '请选择服务时段' :array[index]}}
						</view>
					</picker>
				</view>
				<view class="container">
					<u-checkbox-group @change="checkboxChange" placement="column" v-model="checkboxValue1">
						<view v-for="(item,index) in list" :key="item.id"
							class="flex justify-between align-center margin-top">
							<view>
								<view>款式：{{item.model}}</view>
								<view>编号：{{item.sn_s_sn}}</view>
								<view>床源：{{item.laiyuan}}</view>
								<view>组件：{{item.type}}</view>
								<view>地址：{{item.user_province}}{{item.user_city}}{{item.user_area}}{{item.user_address}}
								</view>
							</view>
							<u-checkbox class="slate" :key="index" :name="item.id" activeColor="#000030"/>
						</view>
					</u-checkbox-group>
				</view>
			</view>
			<view class="container" style="display: flex;z-index: 1;">
				<image @click="$globalJump2View('/pages/agreement/agreement?name=maintenance_manual')"
					style="width: 345rpx;" mode="widthFix"
					src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%B5%B7%E4%B8%9D%E8%85%BE11.png" />
				<image @click="$globalJump2View('/pages/agreement/agreement?name=maintenance_instructions')"
					style="width: 345rpx;" mode="widthFix"
					src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%B5%B7%E4%B8%9D%E8%85%BE12.png" />
			</view>
			<view style="height: 48px;"></view>
			<view class="submit-box">
				<u-button @click="submit" :disabled="checkboxValue1.length == 0"
					:text="checkboxValue1.length+'张床，需支付'+amount_total+'元，立即预约'" type="primary"></u-button>
			</view>
		</view>

	</view>
</template>

<script>
	import {
		getDateByDate,
		Calc
	} from '@/utils/util'
	import {
		axios
	} from '@/utils/request'
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				service_price: '',
				amount_total: '0',
				array: ['上午', '下午'],
				checkboxValue1: [],
				index: '',
				date: '',
				min_date: getDateByDate(),
				max_date: getDateByDate(365),
				list: [],
				loaded: false,
				checked: [],
				loading: false
			};
		},
		computed: {
			...mapState({
				userinfo: state => state.user.userinfo
			}),
			...mapGetters({
				is_login: 'user/is_login',
			})
		},
		onLoad(options) {
			if (options.uid) {
				uni.setStorageSync('pid', options.uid)
			}
			axios.get("/api/v1/common").then(res => {
				if (res.code === 1) {
					this.service_price = res.data.bed_service_price
					this.loaded = true
				}
			})
			axios.post('/api/v1/user/beds/server/confirm').then(res => {
				if (res.code === 1) {
					this.list = res.data.beds
				}
			})
		},
		methods: {
			bindDateChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.date = e.detail.value
			},
			bindPickerChange(e) {
				console.log('picker发送选择改变，携带值为', e.detail.value)
				this.index = e.detail.value
			},
			checkboxChange(event) {
				console.log('checkbox发生change事件，携带value值为：', event)
				// const list = this.list
				// const values = event.detail.value
				// for (let i = 0, lenI = list.length; i < lenI; ++i) {
				// 	list[i].checked = false
				// 	for (let j = 0, lenJ = values.length; j < lenJ; ++j) {
				// 		if (Number(list[i].id) === Number(values[j])) {
				// 			list[i].checked = true
				// 			break
				// 		}
				// 	}
				// }
				axios.post('/api/v1/user/beds/server/confirm', {
					checked: event.join(',')
				}).then(res => {
					console.log(res)
					if (res.code === 1) {
						this.amount_total = res.data.total.total
					}
				})
			},
			submit() {
				if (this.loading !== false) {
					return false
				}
				if (this.checkboxValue1.length === 0) {
					this.$u.toast('请选择床具', 1200)
					return false
				}
				if (!this.date) {
					this.$u.toast('请选择服务日期', 1200)
					return false
				}
				if (this.index === '') {
					this.$u.toast('请选择服务时间', 1200)
					return false
				}
				let items = [];
				for (let item of this.checkboxValue1) {
					items.push({
						id: item,
						date: this.date,
						pm: this.array[this.index],
						coupon_id: 0
					})
				}
				console.log(items)
				this.loading = true
				uni.showLoading()
				axios.post('/api/v1/user/beds/server', {
					items
				}, {
					header: {
						'Content-Type': 'application/json',
					}
				}).then(res => {
					console.log(res)
					if (res.code === 1) {
						if (res.data.need_pay === false) {
							uni.hideLoading()
							//直接跳转到我的服务
							this.$u.toast('下单成功', 1200)
							setTimeout(() => {
								uni.navigateTo({
									url: '/pages/my/my_beds_server/my_beds_server',
								})
							}, 1200)
						} else {
							axios.post('/api/v1/user/beds/server/payment', {
								order_no: res.data.order_no
							}).then(res => {
								uni.hideLoading()
								if (res.code !== 1) {
									this.$u.toast(res.info, 1200)
									setTimeout(() => {
										uni.navigateTo({
											url: '/pages/my/my_beds_server/my_beds_server',
										})
									}, 1200)
								} else {
									//发起支付
									uni.requestPayment({
										...res.data.param,
										success: (red) => {
											console.log('支付结果', red)
										},
										complete: (red) => {
											if (red.errMsg == "requestPayment:ok") {
												this.$u.toast('支付成功', 1200)
											} else {
												this.$u.toast('支付失败', 1200)
											}
											setTimeout(() => {
												uni.navigateTo({
													url: '/pages/my/my_beds_server/my_beds_server',
												})
											}, 1200)
										}
									})
								}
							}).catch(err => {
								uni.hideLoading()
								this.$u.toast('出错了', 1200)
								setTimeout(() => {
									wx.navigateTo({
										url: '/pages/my/my_beds_server/my_beds_server',
									})
								}, 1200)
							})
						}
					} else {
						wx.hideLoading()
						this.$u.toast(res.info, 1200)
						this.loading = false
					}
				}).catch(err => {
					uni.hideLoading()
					this.$u.toast('出错了', 1200)
					this.loading = false
				})
			},
		},
		/**
		 * 用户点击右上角分享
		 */
		onShareAppMessage() {
			let path = 'pages/index/maintenance_service/maintenance_service'
			if(this.is_login){
				path = path + '?uid='+this.userinfo.id
			}
			console.log(path)
			return {
				title: "养护中心",
				path: path,
				imageUrl: "https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E5%85%BB%E6%8A%A4%E4%B8%AD%E5%BF%831634107335313.png"
			}
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.submit-box {
		position: fixed;
		bottom: 0;
		z-index: 9;
		background-color: #fff;
		width: 100%;
		text-align: center;
		box-sizing: border-box;
		padding: 20rpx 30rpx;
	}

	.submit-box.active {
		background-color: var(--button-default-background-color);
		color: var(--button-default-color);
	}
</style>