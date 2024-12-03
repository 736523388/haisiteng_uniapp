<template>
	<view class="bg-white">
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-show="loaded">
			<!-- <view class="page-bar" >
				<view class="text-xl text-bold">精选配饰</view>
				<view class="text-sm text-bold page-bar-desc">RECOMMEND</view>
			</view> -->
			<view style="padding: 30rpx 30rpx 30rpx 30rpx;">
				<view v-for="(item, index) in list" :key="item.id" style="margin-bottom: 60rpx;">
					<view>
						<video @play="videoPay" :id="'video_' + item.id" object-fit="contain" style="width: 100%;height: 205px;" :src="item.video_path"
							:poster="item.video_path + '?x-oss-process=video/snapshot,t_1000,f_jpg'"
							controls play-btn-position="center" :picture-in-picture-mode="[]"></video>
							<!-- <channel-video style="width: 100%;" finder-user-name="sphw3hmD3d4gIob" feed-token="token/ACqQcPIwR" :autoplay="true" object-fit="cover"></channel-video> -->
					</view>
					<view class="text-lg">
						<view>{{ item.title }}</view>
					</view>
					<view class="text-desc">{{ item.desc }}</view>		
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
		<!-- <drag-button :isDock="true" :existTabBar="true" /> -->
		<u-empty v-if="loaded === true && list.length === 0" marginTop="44"
			text="暂无数据" icon="/static/empty_data.png"></u-empty>
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
			videoPay(e){
				console.log(e)
				
				let id = e.currentTarget.id
				for(let item of this.list) {
					if(item.videoContext === null || item.videoContext===undefined) {
						item.videoContext = uni.createVideoContext('video_' +item.id)
					}
					if(id === 'video_' +item.id) {
						item.videoContext.requestFullScreen({direction:0})
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

</style>