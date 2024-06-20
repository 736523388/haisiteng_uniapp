<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view @click="show=true"
							style="padding-left:24rpx;padding-right:24rpx;align-self:center;border-right: 1px solid #000030;">
							{{chooseStoreActive !== '' ?'已':''}}筛选
						</view>
						<view style="flex: 1;">
							<u-search placeholder="请输入床具的sn" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<view class="container margin-top-sm padding-sm bg-white" v-for="(item,index) in list" :key="item.id"
				@click="choose_this" :data-index="index">
				<view>编号：{{item.sn_s_sn}}</view>
				<view>名称：{{item.name}}</view>
				<view>颜色：{{item.color}}</view>
				<view>硬度：{{item.hardness}}</view>
				<view>款式：{{item.model}}</view>
				<view>组件：{{item.type}}</view>
			</view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty text="暂无数据" icon="/static/empty_data.png"></u-empty>
			</block>
			<u-loadmore :status="status" v-else />
		</view>
		<u-popup :show="show" @close="close" closeOnClickOverlay mode="left">
			<view class="padding chooseDate">
				<view class="text-sm margin-bottom-sm flex">
					<view>按门店</view>
					<block v-if="chooseStoreActive !== ''">
						<view class="text-bold" style="margin-left: auto;">{{store_list[chooseStoreActive].name}}
						</view>
					</block>
				</view>
				<view class="flex flex-wrap text-sm text-center">
					<view @click="chooseStore(index)" v-for="(item,index) in store_list" :key="item.id"
						class="margin-right-xs margin-bottom-sm date_choose"
						:class="{active: chooseStoreActive === index}">{{item.name}}</view>
				</view>
				<view class="flex justify-around van-hairline--top padding-top-sm margin-top-sm">
					<view style="width: 45%;">
						<u-button type="primary" @click="chooseStoreConfirm" text="确认"></u-button>
					</view>
					<view style="width: 45%;">
						<u-button type="default" @click="chooseStoreReset" text="重置"></u-button>
					</view>


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
				change: '',
				show: false,
				value: '',
				list: [],
				page: 1,
				status: 'loadmore',
				store_list: [],
				chooseStoreActive: ''
			};
		},
		onLoad(options) {
			this.change = options.change || ''
			checkLogin(() => {
				this.loadData()
				axios.get('/api/v1/admin/store').then(res => {
					if (res.code === 1) {
						this.store_list = res.data.list
					}
				})
			})
		},
		/**
		 * 页面上拉触底事件的处理函数
		 */
		onReachBottom() {
			this.loadData()
		},
		methods: {
			onClick() {
				this.list = []
				this.page = 1
				this.status = 'loadmore'
				this.loadData()
			},
			chooseStore(index) {
				this.chooseStoreActive = index
			},
			close() {
				this.show = false
			},
			chooseStoreConfirm() {
				this.show = false
				setTimeout(() => {
					this.onClick()
				}, 300)
			},
			chooseStoreReset() {
				this.chooseStoreActive = ''
			},
			choose_this(event) {
				console.log(event)
				let index = event.currentTarget.dataset.index
				let data = this.list[index]
				this.$store.commit('admin_beds/choose_beds', {
					beds: data
				})
				if (this.change !== '') {
					uni.navigateBack()
				} else {
					uni.navigateTo({
						url: '/pages/my/service/add_beds_order/add_beds_order',
					})
				}
			},
			loadData() {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'
				axios.get('/api/v1/admin/beds', {
					params: {
						sn: this.value,
						page: this.page
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.list.length < 10 ? 'nomore' : 'loadmore'
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						})
					}
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	.chooseDate {
		width: 640rpx;
		height: 100%;
	}

	.date_choose {
		background-color: #e5e5e5;
		border-radius: 50rpx;
		width: 30%;
		padding: 10rpx 0;
	}

	.date_choose.active {
		background-color: #000030;
		color: #fff;
	}

	.hst-search {
		padding: 0 !important;
	}
</style>