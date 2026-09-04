<template>
	<view style="background-color: #f6f6f6;min-height: 100vh;width: 100%;">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<view class="head_bar" :style="'height:' + systemBar + 'px'"></view>
			<view :style="'height:' + systemBar + 'px'"></view>
			<view @click="videoPay" class="image-container" style="width: 750rpx;height: 463rpx;position: relative;">
				<video id="video_1" style="width: 100%;height: 463rpx;z-index: -1;" 
				    :src="activity_video_path"
					:poster="activity_cover"
					:controls="true" 
					:title="activity_title"
					object-fit="contain"
					@fullscreenchange="bindfullscreenchange"></video>
					<image lazy-load :src="activity_cover" mode="scaleToFill" style="height: 100%;width: 100%;position: absolute;top: 0;z-index: 2;left: 0;"></image>
					<view class="play-button"></view>
			</view>
			<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_home.jpg" class="activity-image" mode="widthFix"></image>
			<image @click="$globalJump2View('/pages/shop/goods_detail/goods_detail?id=82')" src="https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_1.png" class="activity-image" mode="widthFix"></image>
			<image @click="$globalJump2View('/pages/shop/goods_detail/goods_detail?id=90')" src="https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_2.png" class="activity-image" mode="widthFix"></image>
			<image @click="$globalJump2View('/pages/shop/goods_detail/goods_detail?id=86')" src="https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_3.png" class="activity-image" mode="widthFix"></image>
			<image @click="$globalJump2View('/pages/shop/goods_detail/goods_detail?id=91')" src="https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_4.png" class="activity-image" mode="widthFix"></image>
			<view class="activity-url-box">
				<view @click="jump2goods">点击查看更多好物</view>
			</view>
		</view>
	</view>
</template>

<script>
import { axios } from '../../../utils/request';

	export default {
		data() {
			return {
				systemBar: 0,
				styleObject: {
					height: '0px'
				},
				loaded: false,
				activity_title: '',
				activity_cover: '',
				activity_video_path: '',
				videoContext: null
			};
		},
		onShareAppMessage: function(options) {
			let path = 'pages/index/activity/activity'
			console.log(path)
			return {
				title: "百年匠心 邂逅魅力进博 2025/11/5 静待莅临",
				path: path,
				imageUrl: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/activity/activity_home.jpg'
			}
		},
		onLoad(options) {
			console.log(options)
			if (options.uid) {
				uni.setStorageSync('pid', options.uid)
			}
			uni.getSystemInfo({
				success: (result) => {
					console.log(result)
					this.styleObject.height = result.statusBarHeight + 'px'
					this.systemBar = result.statusBarHeight
					console.log(this.styleObject)
				},
			})
			this.videoContext = uni.createVideoContext('video_1')
			this.loadData()
		},
		methods: {
			loadData(){
				const axios1 = axios.get('/api/v1/conf?name=activity_title');
				const axios2 = axios.get('/api/v1/conf?name=activity_cover');
				const axios3 = axios.get('/api/v1/conf?name=activity_video_path');
				Promise.all([axios1, axios2, axios3]).then(results => {
					console.log(results)
					this.activity_title = results[0].data
					this.activity_cover = results[1].data
					this.activity_video_path = results[2].data
					this.$nextTick(() => {
						this.loaded = true
						this.videoContext = uni.createVideoContext('video_1')
					})
				})
			},
			bindfullscreenchange(e){
				console.log(e)
				if(e.detail.fullScreen === false) {
					this.videoContext.pause()
				}
			},
			videoPay(e){
				console.log(e)
				this.videoContext.requestFullScreen({direction:0})
				this.videoContext.play()
			},
			jump2goods(){
				console.log('跳转到商品列表')
				uni.navigateTo({
					url: '/pages/shop/goods_index/goods_index'
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.activity-image{
	width: 750rpx;
}
.head_bar{
	width: 100%;
	background-color: #fff;
	position: fixed;
	z-index: 999;
}
image {
  display: block;
  font-size: 0;
}
.activity-url-box{
	padding-top: 15px;
	padding-bottom: 70px;
	display: flex;
	justify-content: center;
	view{
		color: #4d4d4d;
		font-size: 12px;
	}
}
.play-button{
	position: absolute;
	z-index: 12;
	// height: 72rpx;
	// width: 72rpx;
	// border-radius: 50%;
	// border: 4rpx solid #FFFFFF;
	top: 50%;
	left: 50%;
	margin-left: -14rpx;
	margin-top: -24rpx;
	// background: rgba(255, 255, 255, .3);
	
	width: 0;
	height: 0;
	border-top: 28rpx solid transparent;
	border-bottom: 28rpx solid transparent;
	border-left: 48rpx solid rgba(255, 255, 255, .6);
}
</style>
