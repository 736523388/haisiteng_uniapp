<template>
	<view>
		<u-tabbar :border="false" :value="currentIndex" @change="change1" :fixed="true" :placeholder="false" activeColor="#000030"
			:safeAreaInsetBottom="true">
			<u-tabbar-item :name="index" :text="item.text" v-for="(item, index) in list" :key="index"
				@click="switchTab(index, item.url)" :badge="index == 1 ? goods_cart_number : ''">
				<image class="u-tabbar-image" slot="active-icon" :src="item.active"></image>
				<image class="u-tabbar-image" slot="inactive-icon" :src="item.icon"></image>
			</u-tabbar-item>
		</u-tabbar>
	</view>
</template>

<script>
	import {
		mapState
	} from 'vuex'
	export default {
		name: "custom-tabbar",
		props: {
			currentIndex: {
				type: Number,
				default: 0
			}
		},
		data() {
			return {
				list: [{
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/home_o.png',
						active: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/home.png',
						text: 'Hastens',
						url: '/pages/index/index',
					},
					{
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/cart_o.png',
						active: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/cart.png',
						text: '购物袋',
						url: '/pages/shop_cart/shop_cart',
					},
					{
						icon: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/my_o.png',
						active: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/icon/my.png',
						text: '我的',
						url: '/pages/my/my',
					}
				],
			};
		},
		computed: {
			...mapState({
				goods_cart_number: state => state.goods_cart.goods_cart_number,
			})
		},
		methods: {
			switchTab(index, url) {
				if(index == this.currentIndex){
					return
				}
				// console.log('switchTab', index, url);
				// #ifdef MP-WEIXIN
				if(index == 1){
					uni.navigateTo({
						url
					})
				} else {
					uni.switchTab({
						url
					})
				}
				// #endif
				// #ifndef MP-WEIXIN
				uni.navigateTo({
					url
				})
				// #endif
				
			},
			change1(e){
				console.log('change1',e)
			}
		}
	}
</script>

<style lang="scss">

.u-tabbar-image{
	width: 28px; 
	height: 28px;
}
</style>