<template>
	<view style="background-color: #000;min-height: 100vh;width: 100%;">
		<view class="head_bar" :style="'height:' + systemBar + 'px'"></view>
		<view :style="'height:' + systemBar + 'px'"></view>
		<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_1.jpg" style="width: 100%;"
			mode="widthFix" />
		<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_2.jpg" style="width: 100%;"
			mode="widthFix" />
		<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_3.jpg" style="width: 100%;"
			mode="widthFix" />
		<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_4.jpg" style="width: 100%;"
			mode="widthFix" />
		<image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_5.jpg" style="width: 100%;"
			mode="widthFix" />
		<image @click="jump2view('https://mp.weixin.qq.com/s/SLEZqsnOQH9VOhbr0ciF6w')"
			src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_result_6.jpg" style="width: 100%;"
			mode="widthFix" />
		<view class="text-center" style="height: 150rpx;padding-top: 30rpx;">
			<navigator class="text-df"
				style="display: inline-block;color: #fff;border: 1px solid #fff;border-radius: 30rpx;padding: 6rpx 30rpx;box-sizing: border-box;"
				open-type="switchTab" url="/pages/index/index">进入海丝腾</navigator>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				systemBar: 0,
				styleObject: {
					height: '0px'
				}
			};
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
		},
		methods: {
			jump2view(path) {
				uni.navigateTo({
					url: '/pages/web_view/web_view?url=' + encodeURI(path),
				})
			},

		}
	}
</script>

<style lang="scss" scoped>
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
</style>