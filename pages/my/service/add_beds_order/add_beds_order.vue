<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<block v-if="loaded">
			<view class="container margin-top">
				<view class="flex justify-between align-center bg-white" style="flex-direction: row-reverse;">
					<view @click="$globalJump2View('/pages/my/service/beds/beds?change=1', true)"
						class="bg-black padding-sm" style="border: 1px solid #000030;">选择></view>
					<view class="padding-sm" style="flex:1;border: 1px solid #000030;">床具信息</view>
				</view>
				<view v-if="current_beds.sn_s_sn" class="padding bg-white margin-top-xs">
					<view>SN：{{current_beds.sn_s_sn}}</view>
					<view>名称：{{current_beds.name}}</view>
					<view>款式：{{current_beds.model}}</view>
					<view>类型：{{current_beds.type}}</view>
					<view>硬度：{{current_beds.hardness}}</view>
					<view>尺寸：{{current_beds.size}}</view>
					<view>颜色：{{current_beds.color}}</view>
				</view>
			</view>
			<view class="container margin-top">
				<view class="flex justify-between align-center bg-white" style="flex-direction: row-reverse;">
					<view
						@click="$globalJump2View('/pages/my/service/store_user_address/store_user_address?change=1', true)"
						class="bg-black padding-sm" style="border: 1px solid #000030;">选择></view>
					<view class="padding-sm" style="flex:1;border: 1px solid #000030;">客户信息</view>
				</view>
				<view class="bg-white margin-top-xs">
					<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
						<view style="width: 180rpx;">收货人</view>
						<view style="flex-grow: 1;"><input name="name" v-model="name" placeholder="请输入收货人姓名" /></view>
					</view>
					<view style="padding: 0 20rpx;">
						<u-line></u-line>
					</view>
					<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
						<view style="width: 180rpx;">电话号码</view>
						<view style="flex-grow: 1;"><input name="phone" type="number" v-model="phone"
								placeholder="请输入收货人手机号" /></view>
					</view>
					<view style="padding: 0 20rpx;">
						<u-line></u-line>
					</view>

					<picker mode="multiSelector" @change="bindMutilPickerChange"
						@columnchange="bindMutilPickerColumnChange" :range="newArr" :value="multiIndex">
						<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
							<view style="width: 180rpx;">地区</view>
							<block v-if="multiIds.length > 0">
								<view style="flex-grow: 1;">
									{{multiIds[0].name}} {{multiIds[1].name}} {{multiIds[2].name}}
								</view>
							</block>
							<block v-else>
								<view style="flex-grow: 1;color: rgb(128,128,128);">
									请选择地区
								</view>
							</block>
							<u-icon name="arrow-right"></u-icon>
						</view>
					</picker>
					<view style="padding: 0 20rpx;">
						<u-line></u-line>
					</view>
					<view class="flex" style="width: 650rpx;padding: 20rpx 30rpx;">
						<view style="width: 180rpx;">详细地址</view>
						<view style="flex-grow: 1;">
							<textarea name="address" style="width: 100%;" auto-height placeholder="街道、楼牌号等"
								v-model="address" />
						</view>
					</view>
				</view>

			</view>
			<view class="operate-box">
				<u-button custom-style="width:100%;border-radius:999rpx;" type="primary"
					@click.native="submit">保存</u-button>
			</view>
		</block>

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
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				name: '',
				phone: '',
				address: '',
				region: [],
				loaded: false,
				items: [],
				multiIndex: [0, 0, 0],
				multiIds: [],
				newArr: [
					[],
					[],
					[]
				]
			};
		},
		computed: {
			...mapState({
				current_beds: state => state.admin_beds.current_beds,
				current_address: state => state.store_user_address.address_current
			})
		},
		onLoad() {
			checkLogin(() => {
				this.loadData()
			})
		},
		onShow() {
			if (this.loaded) {
				console.log('刷新地址信息')
				this.showCurrentAddress()
			}
		},
		methods: {
			// picker选择事件
			bindMutilPickerChange(event) {
				console.log(event)
				// console.log(this.multiIds)
				console.log(this.multiIndex)
				let multiIds = []
				this.items.map((v, vk) => {
					if (this.multiIndex[0] === vk) {
						this.multiIds[0] = {
							...v
						}
						v.subs.map((c, ck) => {
							if (this.multiIndex[1] === ck) {
								this.multiIds[1] = {
									...c
								}
								c.subs.map((t, tk) => {
									if (this.multiIndex[2] === tk) {
										this.multiIds[2] = {
											...t
										}
									}
								})
							}
						})
					}
				})
				console.log(this.multiIds)
				this.$forceUpdate()

			},
			bindMutilPickerColumnChange(e) {
				// console.log('picker滑动事件', e)
				let data = {
					newArr: this.newArr,
					multiIndex: this.multiIndex,
				}
				data.multiIndex[e.detail.column] = e.detail.value
				let searchColumn = () => {
					let arr1 = []
					let arr2 = []
					this.items.map((v, vk) => {
						if (data.multiIndex[0] === vk) {
							v.subs.map((c, ck) => {
								arr1.push(c.name)
								if (data.multiIndex[1] === ck) {
									c.subs.map((t, tk) => {
										arr2.push(t.name)
									})
								}
							})
						}
					})
					data.newArr[1] = arr1
					data.newArr[2] = arr2
				}
				switch (e.detail.column) {
					case 0:
						data.multiIndex[1] = 0
						data.multiIndex[2] = 0
						searchColumn();
						break;
					case 1:
						data.multiIndex[2] = 0
						searchColumn();
						break;
					case 2:
						searchColumn();
						break;
				}
				this.newArr = data.newArr
				this.multiIndex = [...data.multiIndex]
				this.$forceUpdate()
			},

			buildRegions(regions) {
				this.items = regions
				let state = {
					arr: [],
					arr1: [],
					arr2: [],
					arr3: [],
				}
				regions.map((v, vk) => {
					state.arr1.push(v.name)
					if (state.arr2.length <= 0) {
						v.subs.map((c, ck) => {
							state.arr2.push(c.name)
							if (state.arr3.length <= 0) {
								c.subs.map((t, tk) => {
									state.arr3.push(t.name)
								})
							}
						})
					}
				})
				state.arr[0] = state.arr1
				state.arr[1] = state.arr2
				state.arr[2] = state.arr3
				this.newArr = state.arr
				console.log(this.newArr)
				console.log(this.multiIndex)
			},
			showCurrentAddress() {
				console.log('onShow的地址处理')
				console.log(this.current_address)
				console.log(this.current_address.id)
				if (this.current_address.id) {
					console.log('地址更新')
					this.name = this.current_address.name
					this.phone = this.current_address.phone
					this.address = this.current_address.address
					this.multiIndex = [0,0,0]
					this.multiIds = []
					let state = {
						multiIndex: [...this.multiIndex],
						multiIds: [...this.multiIds],
						arr2: [],
						arr3: []
					}
					this.items.map((v, vk) => {
						if (v.name === this.current_address.province) {
							state.multiIndex[0] = vk
							state.multiIds[0] = {
								...v
							}
							v.subs.map((c, ck) => {
								state.arr2.push(c.name)
								if (c.name === this.current_address.city) {
									state.multiIndex[1] = ck
									state.multiIds[1] = {
										...c
									}
									c.subs.map((t, tk) => {
										state.arr3.push(t.name)
										if (t.name === this.current_address.area) {
											state.multiIndex[2] = tk
											state.multiIds[2] = {
												...t
											}
										}
									})
								}
							})
						}
					})
					console.log(state)
					if (state.multiIds.length === 3) {
						this.multiIndex = state.multiIndex
						this.multiIds = state.multiIds
						this.newArr[1] = state.arr2
						this.newArr[2] = state.arr3
						this.$forceUpdate()
					}
				} else {
					console.log('重置')
					this.name = ''
					this.phone=''
					this.address = ''
					this.buildRegions(this.items)
					this.$forceUpdate()
				}
			},
			async loadData() {
				try {
					const region_res = await axios.get('/api/v1/goods/region')
					if (region_res.code !== 1) {
						throw new Error("城市数据获取失败")
					}
					this.buildRegions(region_res.data)
					this.showCurrentAddress()
					this.loaded = true
				} catch (error) {
					console.log(error)
				}
			},
			submit() {
				if (this.name == '') {
					uni.showToast({
						title: '请输入用户姓名',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				if (this.phone == '') {
					uni.showToast({
						title: '请输入用户电话',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				if (this.multiIds.length < 3) {
					uni.showToast({
						title: '请选择地区',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				if (this.address == '') {
					uni.showToast({
						title: '请输入详细地址',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				if (!this.current_beds.sn_s_sn) {
					uni.showToast({
						title: '请选择床具',
						icon: 'none',
						duration: 1200
					})
					return false
				}
				let data = {
					bed_id: this.current_beds.id,
					user_name: this.name,
					user_phone: this.phone,
					user_province: this.multiIds[0].name,
					user_city: this.multiIds[1].name,
					user_area: this.multiIds[2].name,
					user_address: this.address
				}
				console.log(data)
				uni.showLoading({
					mask: true
				})
				axios.post('/api/v1/admin/beds_order', data).then(res => {
					if (res.code === 1) {
						this.$store.commit('admin_beds/clean_beds')
						uni.showToast({
							title: res.info,
							duration: 1200
						})
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
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

				}).finally(() => {
					uni.hideLoading()
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
		/* padding-bottom: 30rpx;
  padding-top: 30rpx;
  padding-left: 30rpx;
  padding-right: 30rpx; */
		width: 100%;
		text-align: center;
		background-color: #fff;
		z-index: 5;
	}
</style>