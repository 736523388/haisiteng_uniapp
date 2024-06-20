<template>
	<view>
		<u-sticky>
			<view class="bg-white padding-top padding-bottom">
				<view class="container">
					<view class="flex" style="border: 1px solid #334155;width: 100%;border-radius: 6rpx;">
						<view style="flex: 1;">
							<u-search placeholder="请输入优惠券名称" :showAction="true" actionText="搜索" :animation="false"
								bgColor="#fff" v-model="value" @custom="onClick"></u-search>
						</view>
					</view>
				</view>
			</view>
		</u-sticky>
		<view>
			<view @click="choose_this(item)" v-for="(item,index) in list" :key="item.id"
				class="bg-white solid-bottom padding-sm">
				<view class="text-xl text-bold">{{item.title}}</view>
				<view>{{item.remark}}</view>
				<view>有效期：{{item.expire_datetime}}</view>
			</view>
			<block v-if="status == 'nomore' && list.length < 1">
				<u-empty text="暂无数据" icon="/static/empty_data.png"></u-empty>
			</block>
			<u-loadmore :status="status" v-else />
		</view>
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
				value: '',
				list: [],
				page: 1,
				status: 'loadmore'
			};
		},
		onLoad(options) {
			this.change = options.change || ''
			checkLogin(() => {
				this.loadData()
			})

		},
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
			loadData() {
				if (this.status !== 'loadmore') {
					return
				}
				this.status = 'loading'

				axios.get('api/v1/admin/coupon', {
					params: {
						page: this.page,
						title: this.value
					}
				}).then(res => {
					if (res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.page.pages <= res.data.page.current ? 'nomore' : 'loadmore'
					} else {
						uni.showToast({
							title: res.info,
							icon: 'none'
						})
					}
				})
			},
			choose_this(item){
				if(this.change != ''){
					uni.setStorageSync('choose_coupon', item)
					// 把所选用户信息保存好
					uni.navigateBack()
				}
			}
		}
	}
</script>

<style lang="scss">

</style>