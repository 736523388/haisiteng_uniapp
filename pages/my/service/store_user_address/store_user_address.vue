<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入姓名或电话" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="margin-top-sm container padding-left-sm padding-right-sm bg-white" style="border-radius: 20rpx;">
			<view @click="choose_this" :data-index="index" v-for="(item,index) in list" :key="item.id"
				class="padding-top-sm padding-bottom-sm solid-bottom  flex justify-between align-center">
				<view>
					<view class="text-sm">
						{{item.province}}{{item.city != '县' && item.city != '市' ? item.city : ''}}{{item.area}}
					</view>
					<view class="text-bold" style="margin: 6rpx 0;">{{item.address}}</view>
					<view><text>{{item.name}}</text> <text style="margin-left: 6rpx;">{{item.phone}}</text></view>
				</view>
				<view>
					<u-icon size="44rpx" name="edit-pen"
						@click.native.stop="$globalJump2View('/pages/my/service/store_user_address_add/store_user_address_add?id='+item.id+'&change='+change,true)"></u-icon>
				</view>
			</view>

		</view>
		<view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty text="暂无数据" icon="/static/empty_data.png">
				</u-empty>
			</block>
			<u-loadmore :status="status" v-else />
		</view>
		<view class="operate-box">
			<u-button shape="circle" type="primary"
				@click="$globalJump2View('/pages/my/service/store_user_address_add/store_user_address_add?change='+change)">新建收货地址</u-button>
		</view>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				change: '',
				value: '',
				list: [],
				page: 1,
				status: 'loadmore'
			};
		},
		onLoad(options) {
			this.change = options.change || ''
		},
		onShow() {
			this.list = []
			this.page = 1
			this.status = 'loadmore'
			this.loadData()
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'
				axios.get('/api/v1/admin/store/user_address', {
					params: {
						page: this.page,
						keyword: this.value
					}
				}).then(res => {
					console.log(res)
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.page.pages <= res.data.page.current ? 'nomore' : 'loadmore'
						console.log(this.list)
						console.log(this.status)
					}
				})
			},
			choose_this(event) {
				console.log(event);
				if (this.change !== '') {
					let index = event.currentTarget.dataset.index
					let data = this.list[index]
					this.$store.commit('store_user_address/choose_store_user_address', {
						address: data
					})
					uni.navigateBack()
				}
			},
			onClick() {
				this.list = []
				this.page = 1
				this.status = 'loadmore'
				this.loadData()
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