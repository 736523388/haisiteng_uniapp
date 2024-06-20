<template>
	<view class="bg-white">
		<view class="page-bar">
			<view class="text-xl text-bold">分享推荐</view>
			<view class="text-sm text-bold page-bar-desc">SHARE</view>
		</view>
		<view class="pos-re">
			<u-image src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_page.png" width="100vw"
				height="1200rpx" mode="aspectFill" />
			<view class="share-btn-box">
				<u-button open-type="share" type="primary" size="small" shape="circle">立即分享</u-button>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {

			};
		},
		// #ifndef APP | H5 |MP-BAIDU
		onShareAppMessage(options) {
			return {
				title: '您的好友正在为您推荐宝藏床具~点击开启理想睡眠之旅！',
				path: '/pages/index/share_detail/share_detail?uid=' + this.$store.state.user.userinfo.id,
				imageUrl: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/images/share_icon.jpg'
			}
		}
		// #endif
	}
</script>

<style lang="scss" scoped>
	.share-btn-box {
		position: absolute;
		top: 1000rpx;
		width: 30%;
		left: 35%;
		text-align: center;
		z-index: 2;
	}
</style>