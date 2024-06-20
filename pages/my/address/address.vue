<template>
	<view>
		<view class="margin-top-sm container padding-left-sm padding-right-sm bg-white" style="border-radius: 20rpx;">
			<view @click="choose_this(item.id)" v-for="(item,index) in list" :key="item.id"
				class="padding-top-sm padding-bottom-sm solid-bottom flex align-center">
				<view class="margin-right" v-if="item.id === address_current_id">
					<u-icon name="checkmark-circle-fill" color="#000030"></u-icon>
				</view>
				<view style="flex: 1;">
					<view class="text-sm">
						{{item.province}}{{item.city != '县' && item.city != '市' ? item.city : ''}}{{item.area}}
					</view>
					<view class="text-bold" style="margin: 6rpx 0;">{{item.address}}</view>
					<view class="flex align-center justify-start"><text>{{item.name}}</text>
						<view><u--text mode="phone" :text="item.phone" format="encrypt" size="28rpx"
								margin="0 0 0 6rpx"></u--text></view>
						<uni-tag v-if="item.is_default == 1" text="默认" size="mini"
							custom-style="background-color: #f43f5e; border-color: #f43f5e; color: #fff;margin-left: 6rpx;"></uni-tag>
					</view>
				</view>
				<view style="margin-left: auto;">
					<u-icon size="44rpx" name="edit-pen"
						@click.native.stop="$globalJump2View('/pages/my/address_add/address_add?id='+item.id+'&change='+change,true)"></u-icon>
				</view>
			</view>
		</view>
		<view v-if="loaded && list.length < 1">
			<u-empty text="暂无数据" icon="/static/empty_data.png"></u-empty>
		</view>
		<view class="operate-box">
			<u-button shape="circle" type="primary"
				@click="$globalJump2View('/pages/my/address_add/address_add?change='+change)">新建收货地址</u-button>
		</view>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request.js'
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		data() {
			return {
				change: '',
				list: [],
				page: 1,
				loading: false,
				loaded: false
			};
		},
		computed: {
			...mapGetters({
				address_current_id: 'user_address/address_current_id'
			})
		},
		onLoad(options) {
			if (options.change) {
				this.change = options.change
			}
		},
		onShow() {
			checkLogin(() => {
				this.loadData()
			})
			console.log(this.address_current_id)
		},
		methods: {
			loadData() {
				axios.get('/api/v1/user/address').then(res => {
					console.log(res)
					if (res.code === 1) {
						this.list = res.data.list
						this.$store.commit('user_address/update_user_address_list', {
							address_list: res.data.list
						})
					}
				}).finally(() => {
					this.loaded = true
				})
			},
			choose_this(id) {
				console.log(id);
				if (this.change !== '') {
					this.$store.commit('user_address/update_user_address_active', {
						id
					})
					uni.navigateBack()
				}
			},
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