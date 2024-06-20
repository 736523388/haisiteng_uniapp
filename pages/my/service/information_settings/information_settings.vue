<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded" class="container bg-white margin-top-xs"
			style="border-radius: 20rpx;padding: 20rpx;overflow: hidden;">
			<view>
				<view class="flex align-center" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">名称</view>
					<view style="flex-grow: 1;"><input name="name" v-model="name" placeholder="请输入店铺名称" /></view>
				</view>
				<view class="flex align-center" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">电话</view>
					<view style="flex-grow: 1;"><input name="telephone" v-model="telephone"
							placeholder="请输入电话" /></view>
				</view>
				<picker mode="multiSelector" @change="bindMutilPickerChange" @columnchange="bindMutilPickerColumnChange"
					:range="newArr" :value="multiIndex">
					<view class="flex align-center" style="width: 650rpx;padding: 20rpx 30rpx;">
						<view style="width: 180rpx;">地区</view>
						<block v-if="multiIds.length > 0">
							<view style="flex-grow: 1;">
								{{multiIds[0].name}} {{multiIds[1].name}} {{multiIds[2].name}}
							</view>
						</block>
						<block v-else>
							<view style="flex-grow: 1;color: rgb(128, 128, 128);">
								请选择地区
							</view>
						</block>
						<u-icon name="arrow-right"></u-icon>
					</view>
				</picker>
				<view class="flex align-center" style="width: 650rpx;padding: 20rpx 30rpx;">
					<view style="width: 180rpx;">详细地址</view>
					<view style="flex-grow: 1;">
						<textarea name="address" style="width: 100%;" auto-height placeholder="街道、楼牌号等"
							v-model="address" />
					</view>
				</view>
			</view>
		</view>
		<view v-if="loaded" class="operate-box flex justify-around align-center">
			<block v-if="id !== ''">
				<view style="width: 45%;">
					<u-button shape="circle" type="primary" @click="submit"
						:text="change !=='' ? '保存并使用':'保存'"></u-button>
				</view>
				<view style="width: 45%;">
					<u-button shape="circle" type="error" @click="deleteAddress" text="删除"></u-button>
				</view>
			</block>
			<block v-else>
				<u-button shape="circle" type="primary" @click="submit" :text="change !=='' ? '保存并使用':'保存'"></u-button>
			</block>
		</view>
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
				checked: true,
				change: '',
				id: '',
				name: '',
				telephone: '',
				region: [],
				address: '',
				loading: false,
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
				current_address: state => state.store_user_address.address_current
			})
		},
		onLoad(options) {
			this.change = options.change || ''
			this.id = options.id || ''

			checkLogin(() => {
				this.loadData()
			})
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
			async loadData() {
				try {
					const region_res = await axios.get('/api/v1/goods/region')
					if (region_res.code !== 1) {
						throw new Error("城市数据获取失败")
					}
					this.buildRegions(region_res.data)
					if (this.id) {
						const res = await axios.get('/api/v1/admin/store/user_address/' + this.id)
						if (res.code !== 1) {
							throw new Error("收货地址获取失败")
						}
						this.name = res.data.name
						this.phone = res.data.phone
						this.address = res.data.address
						let state = {
							multiIndex: [...this.multiIndex],
							multiIds: [...this.multiIds],
							arr2: [],
							arr3: []
						}
						this.items.map((v, vk) => {
							if (v.name === res.data.province) {
								state.multiIndex[0] = vk
								state.multiIds[0] = {
									...v
								}
								v.subs.map((c, ck) => {
									state.arr2.push(c.name)
									if (c.name === res.data.city) {
										state.multiIndex[1] = ck
										state.multiIds[1] = {
											...c
										}
										c.subs.map((t, tk) => {
											state.arr3.push(t.name)
											if (t.name === res.data.area) {
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
						if (state.multiIds.length === 3) {
							this.multiIndex = state.multiIndex
							this.multiIds = state.multiIds
							this.newArr[1] = state.arr2
							this.newArr[2] = state.arr3
							this.$forceUpdate()
						}
					}
					this.loaded = true
				} catch (error) {
					console.log(error)
				}
			},
			deleteAddress() {
				uni.showModal({
					title: '提示',
					content: '确定删除此地址?',
					showCancel: true,
					cancelText: "取消",
					cancelColor: '#000030',
					confirmText: '确定',
					confirmColor: '#3CC51F',
					success: res => {
						//  点击确定
						if (res.confirm) {
							axios.delete('/api/v1/admin/store/user_address/' + this.id).then(ref => {
								if (ref.code === 1) {
									console.log('触发了清除地址')
									if (Number(this.id) === this.current_address.id) {
										this.$store.commit(
											'store_user_address/clean_store_user_address')
									}
									this.$u.toast(ref.info, 1200)
									setTimeout(() => {
										uni.navigateBack()
									}, 1200)
								} else {
									uni.$u.toast('网络错误，请稍后再试！');
								}
							}).catch(err => {
								uni.$u.toast('网络错误，请稍后再试！');
							})
						}
					},
				})
			},

			submit() {
				if (this.loading !== false) {
					return false
				}
				this.loading = true
				axios.post('/api/v1/admin/store/user_address', {
					id: this.id,
					name: this.name,
					phone: this.phone,
					address: this.address,
					province: this.multiIds[0].name,
					city: this.multiIds[1].name,
					area: this.multiIds[2].name,
				}).then(res => {
					if (res.code === 1) {
						this.$u.toast(res.info, 1200)
						setTimeout(() => {
							if (this.change !== '') {
								this.$store.commit(
									'store_user_address/choose_store_user_address',{address: res.data})
								uni.navigateBack({
									delta: 2
								})
							} else {
								uni.navigateBack()
							}
						}, 1200)
					} else {
						this.$u.toast(res.info, 1200)
					}
				}).catch(err => {
					this.$u.toast("出错了，请稍后重试!", 1200)
				}).finally(() => {
					this.loading = false
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
		width: 100%;
		text-align: center;
		background-color: #fff;
		z-index: 5;
	}
</style>