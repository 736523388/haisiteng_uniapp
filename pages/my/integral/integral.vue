<template>
	<view>
		<u-sticky bgColor="#fff">
<!-- 			<view class="text-white padding-tb-lg" style="background-color: #0B1839;text-align: center;">
				<view>账户积分</view>
				<view style="font-size: 72rpx;">{{total}}<text style="font-size: 28rpx;">积分</text></view>
				<navigator url="/pages/shop/goods_integral/goods_integral"
					style="border: #fff 1rpx solid;display: inline-block;border-radius: 40rpx;padding: 4rpx 30rpx;">去使用
				</navigator>
			</view> -->
			<u-tabs :current="active" keyName="label" @change="onChange" :scrollable="false" :list="menu_list"
				lineColor="#000030">
			</u-tabs>
		</u-sticky>
		<block v-for="(item,index) in menu_list" :key="index">
			<view class="logs-box" v-if="index === active" v-for="(v, k) in item.list_re" :key="v.label">
				<view class="logs-label text-grey margin-top-xs">{{v.label}}</view>
				<view class="logs-list">
					<view class="logs-items van-hairline--bottom" v-for="(integral, key) in v.list" :key="integral.id">
						<text>{{integral.create_at_hi}}</text>
						<text>{{integral.name}}</text>
						<text class="logs-color-red">
							<text>{{integral.integral > 0 ? '+' : '-'}}</text>
							<text style="margin-left: 4rpx;">{{integral.integral_abs}}</text>
						</text>
					</view>
				</view>
			</view>
		</block>
		<view style="text-align: center;" v-if="menu_list[active].loading === true">
			<u-loading-icon></u-loading-icon>
		</view>
		<u-empty v-if="menu_list[active].loaded === true && menu_list[active].list.length === 0" marginTop="44"
			text="暂无积分变动记录" icon="/static/empty_data.png"></u-empty>
		<u-loadmore status="nomore" v-if="menu_list[active].loaded === true && menu_list[active].list.length > 0" />
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				active: 0,
				menu_list: [{
						label: '全部',
						date: '',
						page: 1,
						loading: false,
						loaded: false,
						list: [],
						list_re: []
					},
					{
						label: '近三天',
						date: 'day',
						page: 1,
						loading: false,
						loaded: false,
						list: [],
						list_re: []
					},
					{
						label: '本周',
						date: 'week',
						page: 1,
						loading: false,
						loaded: false,
						list: [],
						list_re: []
					},
					{
						label: '本月',
						date: 'month',
						page: 1,
						loading: false,
						loaded: false,
						list: [],
						list_re: []
					},
					{
						label: '上月',
						date: 'last_month',
						page: 1,
						loading: false,
						loaded: false,
						list: [],
						list_re: []
					}
				],
				total: 0
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				const menu = this.menu_list[this.active]
				if (menu.loading !== false || menu.loaded !== false) {
					return false
				}
				this.menu_list[this.active].loading = true
				axios.get('/api/v1/user/integral', {
					params: {
						date: menu.date,
						page: menu.page,
						limit: 20
					}
				}).then(res => {
					if (res.code === 1) {
						let list = res.data.list
						let list_re = this.menu_list[this.active].list_re || []
						for (let i in list) {
							list[i].integral_abs = Math.abs(list[i].integral)
							list[i].create_at_hi = list[i].create_at.substr(11, 5)
							let tt = list[i].create_at.substr(0, 10).replace(/-/g, '.')
							// tt = tt.replace(/-/g, '.')
							let index = list_re.findIndex(item => item.label === tt)
							if (index > -1) {
								list_re[index].list.push(list[i])
							} else {
								list_re.push({
									label: tt,
									list: [list[i]]
								})
							}
						}
						this.menu_list[this.active].page++
						this.menu_list[this.active].loaded = res.data.page.current >= res.data.page.pages
						this.menu_list[this.active].list = this.menu_list[this.active].list.concat(res.data.list)
						this.menu_list[this.active].list_re = list_re
						this.total = res.data.total
						console.log(this.menu_list)
					}
					// console.log(this.menu_list)
				}).finally(() => {
					this.menu_list[this.active].loading = false
				})
			},
			onChange(e) {
				console.log('onChange', e)
				this.active = e.index
				this.loadData()
			},
			onReachBottom() {
				this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	page {
		background-color: #f7f8fa;
	}

	.logs-label {
		// color: #D1D5DB;
		padding: 4rpx 20rpx;
	}

	.logs-list {
		background-color: #fff;
	}

	.logs-items {
		display: flex;
		justify-content: space-between;
		font-size: 28rpx;
		padding: 20rpx;
	}

	.logs-color-red {
		min-width: 100rpx;
		text-align: right;
	}
</style>