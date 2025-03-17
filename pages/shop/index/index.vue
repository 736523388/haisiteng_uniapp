<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view class="bg-white" v-show="loaded">
			<!-- <view class="page-bar" >
				<view class="text-xl text-bold">精选配饰</view>
				<view class="text-sm text-bold page-bar-desc">RECOMMEND</view>
			</view> -->
			<view class="padding padding-bottom-xl">
				<view v-for="(item, index) in list" :key="item.id" style="position: relative;">
					<view v-if="index > 0" class="video-line"></view>
					<view v-if="index > 0" style="width: 100%;padding-top: 92rpx;"></view>
					<view class="flex align-center" style="position: relative;">
						<view :id="'video_' + item.id" @click="videoPay" class="image-container" style="width: 272rpx;height: 168rpx;position: relative;">
							<video :id="'video_' + item.id" style="width: 100%;height: 168rpx;z-index: -1;" 
							    :src="item.video_path"
								:poster="item.cover"
								:controls="true" 
								:title="item.title"
								object-fit="contain"
								@fullscreenchange="bindfullscreenchange"></video>
								<image lazy-load :src="item.cover" mode="scaleToFill" style="height: 100%;width: 100%;position: absolute;top: 0;z-index: 2;left: 0;"></image>
								<view class="play-button"></view>
						</view>
						<view style="height: 168rpx;letter-spacing: 0.1rem;" class="flex-sub flex margin-left-sm flex-direction justify-start">
							<view style="margin-top: 4rpx;">{{ item.title }}</view>
							<view class="text-xs" style="opacity: .6;margin-top: 6rpx;">{{ item.desc }}</view>
							<view class="text-xs" style="opacity: .6;margin-top: auto;">HASTENS</view>
						</view>
					</view>
					
				</view>
				<!-- <view style="margin-bottom: 60rpx;">
					<view>
							<channel-video style="width: 100%;" finder-user-name="sphw3hmD3d4gIob" feed-token="token/AuG4Osd6H" :autoplay="true" object-fit="cover"></channel-video>
					</view>
					<view class="text-lg align-center flex flex-wrap">
						<view class="margin-left-xs">这个是视频号</view>
					</view>
					<view class="text-desc">从视频号点击</view>				
				</view> -->
			</view>
		</view>
		<u-empty v-if="loaded === true && list.length === 0" marginTop="44"
			text="暂无数据" icon="/static/empty_data.png"></u-empty>
		<view v-if="loaded === true && list.length > 0" class="padding-bottom"><u-loadmore loadingIcon="circle" :status="status"></u-loadmore></view>
			
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
				status: 'loadmore',
				page:1 ,
				list: []
			};
		},
		onLoad() {
			this.loadData()
		},
		onReachBottom() {
			this.loadData()
		},
		methods: {
			bindfullscreenchange(e){
				console.log(e)
				if(e.detail.fullScreen === false) {
					let id = e.currentTarget.id
					for(let item of this.list) {
						item.videoContext.pause()
					}
				}
			},
			videoPay(e){
				console.log(e)
				
				let id = e.currentTarget.id
				for(let item of this.list) {
					// if(item.videoContext === null || item.videoContext === undefined) {
					// 	item.videoContext = uni.createVideoContext('video_' +item.id)
					// }
					if(id === 'video_' +item.id) {
						console.log(item)
						item.videoContext.requestFullScreen({direction:0})
						item.videoContext.play()
					} else {
						item.videoContext.pause()
					}
				}
			},
			loadData() {
				if (this.status === 'nomore') {
					return false
				}
				this.status = 'loading'
				axios.get('/api/v1/videos', {params: {page:this.page}}).then(res => {
					if(res.code === 1) {
						this.list = this.list.concat(res.data.list)
						this.page++
						this.status = res.data.page.current >= res.data.page.pages ? 'nomore' : 'loadmore'
						if (this.loaded === false) {
							this.$nextTick(() => {
								this.loaded = true
								for(let item of this.list) {
									if(item.videoContext === null || item.videoContext === undefined) {
										item.videoContext = uni.createVideoContext('video_' +item.id)
									}
								}
							})
						}
					}
				}).catch(error => {
					console.log(error)
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
.video-line::after {
	content: " ";
	position: absolute;
	top: 30rpx;
	// right: 0;
	// bottom: 0;
	left: 292rpx;
	height: 1px;
	right: 0;
	background-color: #ccc;
	transform: scaleY(0.5);
	transform-origin: top;
	// border-top: 1px solid #ccc;
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
// .play-button::after {
// 	content: ' ';
// 	height: 22rpx;
// 	width: 22rpx;
// 	transform: rotate(45deg);
// 	border-right: 4px solid #FFFFFF;
// 	border-top: 4px solid #FFFFFF;
// 	position: absolute;
// 	top: 22rpx;
// 	left: 20rpx;
// }

</style>