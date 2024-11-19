<template>
	<view class="bg-white">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<!-- <view class="page-bar" >
				<view class="text-xl text-bold">精选配饰</view>
				<view class="text-sm text-bold page-bar-desc">RECOMMEND</view>
			</view> -->
			<view style="padding: 30rpx 30rpx 100rpx 30rpx;">
				<view v-for="(item, index) in list" :key="item.id" style="margin-bottom: 60rpx;">
					<view>
						<video style="width: 100%;" id="myVideo" :src="item.video_path"
							:poster="item.video_path + '?x-oss-process=video/snapshot,t_1000,f_jpg'"
							binderror="videoErrorCallback" controls :picture-in-picture-mode="['push', 'pop']"
							bindenterpictureinpicture='bindVideoEnterPictureInPicture'
							bindleavepictureinpicture='bindVideoLeavePictureInPicture'></video>
							<!-- <channel-video style="width: 100%;" finder-user-name="sphw3hmD3d4gIob" feed-token="token/ACqQcPIwR" :autoplay="true" object-fit="cover"></channel-video> -->
					</view>
					<view class="text-lg align-center flex flex-wrap">
						<view class="margin-left-xs">{{ item.title }}</view>
					</view>
					<view class="text-desc">{{ item.desc }}</view>
					<!-- <view style="display: flex;justify-content: flex-end;align-items: center;margin-top: 30rpx;">
						<view v-if="item.show_market" style="margin-right: 12rpx;text-decoration: line-through;">
							<text class="text-lg">￥{{ item.price_market }}</text>
						</view> 
						<view style="margin-right: 12rpx;"><text class="text-sm">￥</text><text
								class="text-lg">{{ item.price_selling }}</text></view>
						<navigator :url="'/pages/shop/goods_detail/goods_detail?id=' + item.id" class="text-df"
							style="border:1px #71717a solid;border-radius: 20rpx;padding: 0 40rpx;">立即购买</navigator>
					</view> -->
			
				</view>
			</view>
		</view>
		<!-- <drag-button :isDock="true" :existTabBar="true" /> -->
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request'
	export default {
		data() {
			return {
				loaded: false,
				list: []
			};
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				// axios.get('/api/v1/goods?mark=,精选配饰,').then(res => {
				// 	this.list = res.data.list
				// 	this.$nextTick(() => {
				// 		this.loaded = true
				// 	})
				// }).catch(error => {
				// 	console.log(error)
				// })
				
				axios.get('/api/v1/videos').then(res => {
					this.list = res.data.list
					this.$nextTick(() => {
						this.loaded = true
					})
				}).catch(error => {
					console.log(error)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>

</style>