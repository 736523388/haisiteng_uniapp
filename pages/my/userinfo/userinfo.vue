<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded" class="container">
			<view style="font-size: 48rpx;color: #000030;margin-top: 40rpx;">完善个人信息</view>
			<view class="text-center"
				style="position: relative;width: 114rpx;height: 180rpx;margin: 0 auto;margin-top: 96rpx;">
				<!-- #ifdef MP-WEIXIN -->
				<button class="headimg-btn" open-type="chooseAvatar" @chooseavatar="onWexinChooseAvatar">修改头像</button>
				<!-- #endif -->
				<!-- #ifndef MP-WEIXIN -->
				<button class="headimg-btn" @click="onChooseAvatar">修改头像</button>
				<!-- #endif -->
				<u-image :src="userinfo.headimg || defaultAvatarUrl" width="114rpx" height="114rpx" mode="scaleToFill"
					shape="circle"></u-image>
				<view class="text-xs text-desc">修改头像</view>
			</view>
			<view class="flex align-center" style="padding-bottom: 24rpx;">
				<view style="font-size: 30rpx;">手机</view>
				<input style="margin-left: 63rpx;" :value="userinfo.phone" disabled />
			</view>
			<view style="margin-top:35rpx;">
				<view class="flex align-center" style="padding-bottom: 24rpx;border-bottom: 1px solid #ABB0C0;">
					<view style="font-size: 30rpx;">昵称</view>
					<!-- #ifndef MP-WEIXIN -->
					<input style="margin-left: 63rpx;" @input="onChangeNickname" :value="nickname"
						placeholder-style="font-size: 30rpx;color: #ABB0C0;" placeholder="请输入昵称" />
					<!-- #endif -->
					<!-- #ifdef MP-WEIXIN -->
					<input style="margin-left: 63rpx;" @change="onChangeNickname" :value="nickname"
						placeholder-style="font-size: 30rpx;color: #ABB0C0;" placeholder="请输入昵称" type="nickname" />
					<!-- #endif -->
				</view>
				<!-- <text>姓名</text><input type="nickname" auto-focus placeholder="将会获取焦点" /> -->
			</view>
			<view style="color: #ABB0C0;font-size: 22rpx;font-weight: 300;">第一次完善姓名可获得100积分</view>
			<view style="margin-top:59rpx;">
				<view class="flex align-center">
					<view style="font-size: 30rpx;">性别</view>
					<view style="margin-left: 63rpx;">
						<view style="display: inline-block;">
							<u-button @click="onSexClick('男')" size="small" type="primary"
								:plain="base_sex =='女'">男</u-button>
						</view>
						<view style="display: inline-block;margin-left:20rpx;">
							<u-button @click="onSexClick('女')" size="small" type="primary"
								:plain="base_sex =='男'">女</u-button>
						</view>
					</view>
				</view>
			</view>
			<!-- 生日 -->
			<view style="margin-top:59rpx;">
				<picker mode="date" @change="bindBirthdayChange" :value="base_birthday">
					<view class="flex align-center" style="padding-bottom: 24rpx;border-bottom: 1px solid #ABB0C0;">
						<view style="font-size: 30rpx;">生日</view>
						<block v-if="base_birthday != ''">
							<view style="margin-left:63rpx;font-size: 30rpx;font-weight: 300;">
								{{base_birthday}}
							</view>
						</block>
						<block v-else>
							<view style="margin-left:63rpx;color: #ABB0C0;font-size: 30rpx;font-weight: 300;">请选择</view>
						</block>
						<view style="margin-left:auto;">
							<u-icon name="arrow-down-fill" />
						</view>
					</view>
				</picker>
				<view style="color: #ABB0C0;font-size: 22rpx;font-weight: 300;margin-top: 17rpx;">第一次完善生日可获得100积分</view>
			</view>
			<!-- 生日end -->
			<view style="margin-top:59rpx;">
				<picker mode="multiSelector" @change="bindMutilPickerChange" @columnchange="bindMutilPickerColumnChange"
					:range="newArr" :value="multiIndex">
					<view class="flex align-center" style="padding-bottom: 24rpx;border-bottom: 1px solid #ABB0C0;">
						<view style="font-size: 30rpx;">地区</view>
						<block v-if="multiIds.length > 0">
							<view style="margin-left:63rpx;font-size: 30rpx;font-weight: 300;">
								{{multiIds[0].name}} {{multiIds[1].name}} {{multiIds[2].name}}
							</view>
						</block>
						<block v-else>
							<view style="margin-left:63rpx;color: #ABB0C0;font-size: 30rpx;font-weight: 300;">请选择</view>
						</block>
						<view style="margin-left:auto;">
							<u-icon name="arrow-down-fill" />
						</view>
					</view>
				</picker>
				<view style="color: #ABB0C0;font-size: 22rpx;font-weight: 300;margin-top: 17rpx;">第一次完善地区可获得100积分
				</view>
			</view>
			<view style="margin: 0 auto;margin-top:65rpx;text-align: center;">
				<u-button @click="submit" custom-style="border-radius: 10rpx;" type="primary" text="保存信息"></u-button>
			</view>
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
		base_url,
		checkLogin
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				loaded: false,
				nickname: '',
				base_sex: '男',
				base_birthday: '',
				regions: [],
				multiIndex: [0, 0, 0],
				multiIds: [],
				newArr: [],
				defaultAvatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
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
		onLoad() {
			checkLogin(() => {
				this.loadRegions()
			})

		},
		onShow() {
			this.nickname = this.userinfo.nickname
			this.base_sex = this.userinfo.base_sex
			this.base_birthday = this.userinfo.base_birthday
		},
		methods: {
			// picker选择事件
			bindMutilPickerChange(event) {
				// console.log(event)
				// console.log(this.multiIds)
				// console.log(this.multiIndex)
				let multiIds = []
				this.regions.map((v, vk) => {
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
					this.regions.map((v, vk) => {
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
				this.regions = regions
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
				// console.log(this.newArr)
				// console.log(this.multiIndex)
			},
			async loadRegions() {
				try {
					const region_res = await axios.get('/api/v1/goods/region')
					if (region_res.code !== 1) {
						throw new Error("城市数据获取失败")
					}
					this.buildRegions(region_res.data)
					this.nickname = this.userinfo.nickname
					this.base_sex = this.userinfo.base_sex
					this.base_birthday = this.userinfo.base_birthday
					if (this.userinfo.region_province !== '') {
						let state = {
							multiIndex: [...this.multiIndex],
							multiIds: [...this.multiIds],
							arr2: [],
							arr3: []
						}
						this.regions.map((v, vk) => {
							if (v.name === this.userinfo.region_province) {
								state.multiIndex[0] = vk
								state.multiIds[0] = {
									...v
								}
								v.subs.map((c, ck) => {
									state.arr2.push(c.name)
									if (c.name === this.userinfo.region_city) {
										state.multiIndex[1] = ck
										state.multiIds[1] = {
											...c
										}
										c.subs.map((t, tk) => {
											state.arr3.push(t.name)
											if (t.name === this.userinfo.region_area) {
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
			onSexClick(event) {
				this.base_sex = event
				// this.userinfo.base_sex = event
				// this.$store.commit('user/update_user_sex', {
				// 	base_sex: event
				// })
			},
			onChangeNickname(e) {
				console.log('onChangeNickname', e)
				this.nickname = e.detail.value
				// this.$store.commit('user/update_user_nickname', {
				// 	nickname: e.detail.value
				// })
			},
			bindBirthdayChange(e) {
				this.base_birthday = e.detail.value
				// this.$store.commit('user/update_user_base_birthday', {
				// 	base_birthday: e.detail.value
				// })
			},
			onChooseAvatar() {
				console.log('上传图片')
				uni.chooseImage({
					count: 1,
					sizeType: ['compressed'],
					success: res => {
						console.log(res)
						uni.showLoading({
							title: '上传中~',
							mask: true
						})
						uni.uploadFile({
							url: base_url + '/api/v1/user/info/set_portrait',
							fileType: 'image',
							filePath: res.tempFilePaths[0],
							name: 'file',
							formData: {
								'token': this.$store.state.user.token
							},
							success: uploadFileRes => {
								uni.hideLoading()
								console.log(uploadFileRes)
								let ref = JSON.parse(uploadFileRes.data)
								if (ref.code === 1) {
									this.$store.commit('user/update_user_headimg', {
										headimg: ref.data.url
									})
									uni.showToast({
										title: ref.info,
										icon: 'success'
									})
								} else {
									uni.showToast({
										title: ref.info,
										icon: 'none'
									})
								}
							},
							fail: error => {
								uni.hideLoading()
								console.log(error)
								uni.showToast({
									title: '出错了，请稍后再试！',
									icon: 'none'
								})
							}
						})
					}
				})
			},
			onWexinChooseAvatar(e) {
				console.log('微信选择了图片', e)
				const {
					avatarUrl
				} = e.detail
				uni.uploadFile({
					url: base_url + '/api/v1/user/info/set_portrait',
					fileType: 'image',
					filePath: avatarUrl,
					name: 'file',
					formData: {
						'token': this.$store.state.user.token
					},
					success: uploadFileRes => {
						console.log(uploadFileRes)
						let ref = JSON.parse(uploadFileRes.data)
						if (ref.code === 1) {
							this.$store.commit('user/update_user_headimg', {
								headimg: ref.data.url
							})
							uni.showToast({
								title: ref.info,
								icon: 'success'
							})
						} else {
							uni.showToast({
								title: ref.info,
								icon: 'error'
							})
						}
					},
					fail: error => {
						uni.showToast({
							title: '出错了，请稍后再试！',
							icon: 'error'
						})
					}
				})
			},
			submit() {
				console.log('点击了保存信息按钮')
				let data = {
					base_sex: this.base_sex,
					base_birthday: this.base_birthday,
					nickname: this.nickname,
				}
				if (this.multiIds.length > 2) {
					data.region_province = this.multiIds[0].name
					data.region_city = this.multiIds[1].name
					data.region_area = this.multiIds[2].name
				}
				this.updateUserInfo(data)
			},
			updateUserInfo(data) {
				uni.showLoading({
					title: '保存中~',
					mask: true
				})
				axios.post('/api/v1/user/info', data).then(res => {
					uni.hideLoading()
					if (res.code === 1) {
						this.$store.commit('user/update_user', Object.assign({}, this.userinfo, data))
						uni.showToast({
							title: res.info,
							icon: 'success',
							duration: 1200
						})

					} else {
						uni.showToast({
							title: res.info,
							icon: 'none',
							duration: 1200
						})

					}
				}).catch(error => {
					uni.hideLoading()
					uni.showToast({
						title: '出错了~',
						icon: 'none',
						duration: 1200
					})
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
	.avatar-wrapper {
		padding: 0;
		width: 56px !important;
		border-radius: 8px;
		margin: 40px auto;
	}

	.avatar {
		display: block;
		width: 56px;
		height: 56px;
	}

	.test-image {
		width: 100%;
		position: absolute;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		opacity: 0;
	}

	.agreement-desc {
		font-size: 22rpx;
		font-weight: 300;
		color: #ABB0C0;
		line-height: 36rpx;
	}

	.headimg-btn {
		position: absolute;
		left: 0;
		top: 0;
		right: 0;
		bottom: 0;
		opacity: 0;
		z-index: 2;
	}

	.headimg-btn::after {
		border: none;
	}
</style>