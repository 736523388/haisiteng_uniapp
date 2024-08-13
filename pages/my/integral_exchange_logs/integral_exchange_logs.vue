<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="container bg-white radius padding margin-top-sm" v-for="item in list" :key="item.id">
				<view>{{item.gift.title}}</view>
				<view>{{item.create_at}}</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request'
	export default {
		data() {
			return {
				loaded: false,
				status: 'loadmore',
				list: [],
				page: 1
			};
		},
		onLoad() {
			checkLogin(() => {
				this.loadData()
			})
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			loadData(){
				if(this.status !== 'loadmore'){
					return false
				}
				this.status = 'loading'
				axios.get('/api/v1/user/integral/gift_exchange_logs', {params: {page: this.page}}).then(res => {
					if(res.code === 1){
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.page.current >= res.data.page.pages ? 'nomore' : 'loadmore'
						if(this.loaded === false) {
							this.$nextTick(() => {
								this.loaded = true
							})
						}
						
					}
				}).catch(error => {})
			},
		}
	}
</script>

<style lang="scss">

</style>
