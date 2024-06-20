<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<block v-if="loaded">
			<view style="width: 690rpx;margin: 0 auto;border-radius: 20rpx;">
				<image style="width: 100%;border-radius: 10rpx;" mode="widthFix"
					src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/chuangju.jpg" />
			</view>
			<view
				style="color: #fff;background-color: #0B1839;width: 630rpx;margin: 0 auto;border-bottom-right-radius: 10rpx;border-bottom-left-radius: 10rpx;padding: 30rpx 30rpx 20rpx;">
				<view style="font-weight: bold;" class="text-lg">床具溯源 正品验证</view>
				<view style="display: flex;justify-content: space-between;align-items: center;margin-top: 20rpx;">
					<view class="text-desc text-xs">成为海丝腾理想睡眠拥有者</view>
					<view @click="$globalJump2View('/pages/index/search/search', true)" class="text-sm"
						style="border: 1px solid #fff;border-radius: 10rpx;padding: 0 20rpx;">立即验证</view>
				</view>
			</view>
			<view class="container margin-tb-sm">床具详情</view>
			<view class="container beds_list">
				<view v-for="(item, index) in list" :key="item.id" class="beds_box margin-bottom-sm">
					<view>床具编号：{{item.sn_s_sn}}</view>
					<view>床具款式：{{item.model}}</view>
					<view>床具部位：{{item.type}}</view>
					<view>床具名称：{{item.name}}</view>
					<view>床具尺寸：{{item.size}}</view>
					<view>床具颜色：{{item.color}}</view>
					<view>送货地址：{{item.user_province}}{{item.user_city}}{{item.user_area}}{{item.user_address}}</view>

					<view>门店名称：{{item.store.name}}</view>
					<view>门店电话：{{item.store.telephone}}</view>
					<view class="text-desc text-xs">{{item.remark}}</view>

				</view>
				<view v-if="service_btn == true" style="text-align: center;margin-top: 40rpx;">
					<u-button @click="$globalJump2View('/pages/index/maintenance_service/maintenance_service', true)" type="primary">预约保养</u-button>
				</view>
				<view style="height: 30rpx;"></view>
			</view>
		</block>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				list: [],
				loaded: false,
				service_btn: false
			};
		},
		onLoad() {
			axios.get("/api/v1/user/beds").then(res => {
				console.log(res)
				if (res.code === 1) {
					this.list = res.data.list
					this.loaded = true
					this.service_btn = res.data.service_btn
				}
			})
		}
	}
</script>

<style lang="scss" scoped>
	image {
		display: block;
	}

	.beds_list {
		/* background-color: #fff; */
		line-height: 1.6;
		/* margin-top: 60rpx; */
	}

	.beds_box {
		padding: 20rpx;
		background-color: #fff;
		/* border-bottom: 1px solid #000; */
	}

	.beds_confirm {
		text-align: center;
		margin-top: 32rpx;
		padding: 32rpx 0;
	}
</style>