<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入昵称或电话" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view class="bg-white">
			<view @click="choose_this(item)" v-for="(item,index) in list" :key="item.id"
				class="flex align-center justify-between padding-sm solid-bottom">
				<u-avatar :src="item.headimg ? item.headimg : avatarUrl" mode="square" size="100rpx"></u-avatar>
				<view style="margin-left: 20rpx;line-height: 50rpx;">
					<view>{{item.nickname || '未设置昵称'}}</view>
					<view>
						<u-icon name="phone-fill" :label="item.phone ? item.phone : '未绑定手机'" labelPos="right"/>
					</view>
				</view>
				<view style="margin-left: auto;">{{item.region_province}} {{item.region_city}} {{item.region_area}}
				</view>
			</view>
			
		</view>
		<view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty mode="list"></u-empty>
			</block>
			<u-loadmore :status="status" v-else />
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
				avatarUrl: 'https://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRna42FI242Lcia07jQodd2FJGIYQfG0LAJGFxM4FbnQP6yfMxBgJ0F3YRqJCJ1aPAK2dQagdusBZg/0',
				set_admin: '',
				change: false,
				value: '',
				list: [],
				page: 1,
				status: 'loadmore'
			};
		},
		onLoad(options) {
			this.change = options.change || false
			this.set_admin = options.set_admin || ''
			this.loadData()
		},
		methods: {
			loadData() {
				if (this.status !== 'loadmore') {
					return false
				}
				this.status = 'loading'
				axios.get('/api/v1/admin/user', {
					params: {
						page: this.page,
						keyword: this.value,
						set_admin: this.set_admin
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.list.length < 20 ? 'nomore' : 'loadmore'
					} else {
						uni.$u.toast(res.info)
					}
				})
			},
			onClick(){
				this.list = []
				this.page=1
				this.status = 'loadmore'
				this.loadData()
			},
			choose_this(item){
				if(this.change){
					uni.setStorageSync('choose_user', item)
					// 把所选用户信息保存好
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #fff;
	}
</style>