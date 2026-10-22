<template>
	<view class="activity-page">
		<view class="poster">
			<image v-for="(height, index) in sliceHeights" :key="index"
				class="poster-slice" :src="'https://hst-default.oss-cn-chengdu.aliyuncs.com/vividus/poster-' + (index + 1) + '.jpg'"
				:style="{ height: height + 'rpx' }" mode="scaleToFill" />
			<button class="hotspot benefit-one" open-type="contact" hover-class="none"
				aria-label="福利一：联系客服领取积分" />
				<navigator class="hotspot benefit-two" url="/pages/shop/goods_index/goods_index"
					open-type="switchTab" hover-class="none" aria-label="福利二：进入商城首页" />
			<navigator class="hotspot benefit-three" url="/pages/shop/goods_index/goods_index"
				open-type="switchTab" hover-class="none" aria-label="福利三：进入商城" />
			<navigator class="hotspot benefit-four" url="/pages/shop/goods_integral/goods_integral?section=exchange"
				hover-class="none" aria-label="福利四：进入积分兑换" />
				<button class="hotspot qr-code" hover-class="none" @tap="previewQrCode"
					aria-label="查看二维码，长按识别" />
			<navigator class="hotspot home-entry" url="/pages/index/index"
				open-type="switchTab" hover-class="none" aria-label="进入首页" />
			</view>
			<view v-if="qrCodeVisible" class="qr-overlay" @tap="closeQrCode">
				<view class="qr-dialog" @tap.stop>
					<image class="qr-image" src="https://hst-default.oss-cn-chengdu.aliyuncs.com/vividus/qwei.jpg"
						mode="aspectFit" :show-menu-by-longpress="true" @error="onQrCodeError" />
					<view class="qr-hint">长按二维码，打开名片或识别二维码</view>
					<button class="qr-close" @tap="closeQrCode">关闭</button>
				</view>
			</view>
		</view>
</template>

<script>
	export default {
		data() {
			return {
				// 原图 1200 × 9077，分片固定比例，加载时热点位置不会移动。
					sliceHeights: [1500, 1500, 1500, 1173.125],
					qrCodeVisible: false
			}
		},
			methods: {
				previewQrCode() {
						this.qrCodeVisible = true
					},
					closeQrCode() {
						this.qrCodeVisible = false
					},
					onQrCodeError() {
						uni.showToast({ title: '二维码加载失败，请重试', icon: 'none' })
					}
			},
			onShareAppMessage() {
			return {
				title: '岁月相伴，共赴好眠。您的专属积分好礼请查收！',
				path: '/pages/index/vividus/vividus',
					// OSS 压缩图片；每小时更新版本号，覆盖原图后新分享可刷新缓存。
					imageUrl: 'https://hst-default.oss-cn-chengdu.aliyuncs.com/vividus/hero.png?x-oss-process=image/resize,w_500/format,jpg/quality,q_85&v=' + Math.floor(Date.now() / 3600000)
			}
		}
	}
</script>

<style scoped>
	.activity-page {
		background: #fff;
		padding-bottom: env(safe-area-inset-bottom);
	}
	.poster {
		position: relative;
		width: 750rpx;
	}
	.poster-slice {
		display: block;
		width: 100%;
	}
	/* 热点以整张海报百分比定位，覆盖对应福利和按钮，随屏幕等比缩放。 */
	.hotspot {
		position: absolute;
		left: 4%;
		width: 92%;
		margin: 0;
		padding: 0;
		border: 0;
		border-radius: 0;
		background: transparent;
	}
	.hotspot::after {
		border: 0;
	}
	.benefit-one { top: 31.4%; height: 4%; }
	.benefit-two { top: 37.7%; height: 4.5%; }
	.benefit-three { top: 45.7%; height: 4.5%; }
	.benefit-four { top: 52.4%; height: 22.1%; }
		.qr-code { top: 89.3%; height: 3.5%; left: 39%; width: 24%; }
	.home-entry { top: 94.4%; height: 5.6%; left: 0; width: 100%; }
		.qr-overlay {
			position: fixed;
			top: 0;
			right: 0;
			bottom: 0;
			left: 0;
			z-index: 1000;
			display: flex;
			align-items: center;
			justify-content: center;
			background: rgba(0, 0, 0, 0.65);
		}
		.qr-dialog {
			width: 600rpx;
			padding: 32rpx;
			box-sizing: border-box;
			border-radius: 16rpx;
			background: #fff;
			text-align: center;
		}
		.qr-image { display: block; width: 536rpx; height: 536rpx; }
		.qr-hint { margin: 24rpx 0; font-size: 26rpx; color: #333; }
		.qr-close { font-size: 28rpx; }
</style>
