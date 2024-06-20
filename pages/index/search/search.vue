<template>
	<view>
		<image style="width: 100%;padding: 0;margin: 0;z-index: 2;" mode="widthFix"
			src="https://hst-default.oss-cn-chengdu.aliyuncs.com/images/%E6%BA%AF%E6%BA%90%E5%9B%BE.png" />
		<view class="container"
			style="background-color: #fff;text-align: center;border-bottom-left-radius: 20rpx;border-bottom-right-radius: 20rpx;position: relative;padding-top: 60rpx;padding-bottom: 60rpx;margin-top: -8rpx;z-index: 1;">
			<view class="text-lg">感谢您购买海丝腾！</view>
			<view class="text-sm text-desc" style="margin-top: 20rpx;">请在下方输入你的产品序列号</view>
			<view class="van-hairline--bottom" style="width: 95%;margin: 60rpx auto 10rpx;">
				<input class="weui-input" @input="bindSNinput" auto-focus placeholder="请输入床具的SN" />
			</view>
			<view style="position: absolute;bottom: 0;left: 50%;transform: translate(-50%,+50%);">
				<u-button @click="search" size="small" type="primary">查询</u-button>
			</view>



		</view>
		<view class="bg-white padding-sm" style="margin-top: 90rpx;" v-if="beds !== null">
			<view>查询结果：</view>
			<view class="container">
				<view>床具编号：{{beds.sn_s_sn}}</view>
				<view>床具名称：{{beds.name}}</view>
				<view>床具款式：{{beds.model}}</view>
				<view>床具尺寸：{{beds.size}}</view>
				<view>床具颜色：{{beds.color}}</view>
				<view>床具硬度：{{beds.hardness}}</view>
				<view>状态：{{beds.status == 1 ? '待售' : '已售出'}}</view>
				<view v-if="beds.status == 1" class="text-sm">此床具属于您？<text class="text-blue"
						@click="$globalJump2View('/pages/index/draw_beds/draw_beds?id=' + beds.id, true)">立即领取</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				sn_s_sn: '',
				beds: null
			};
		},
		methods: {
			bindSNinput(e) {
				console.log(e)
				this.sn_s_sn = e.detail.value
			},
			search() {
				if (this.sn_s_sn === '') {
					return false
				}
				this.beds = null
				axios.get('/api/v1/user/beds/search', {
					params: {
						sn_s_sn: this.sn_s_sn
					}
				}).then(res => {
					if (res.code === 1) {
						this.beds = res.data
					} else {
						uni.showModal({
							title: '提示',
							content: '您的信息未查到，请留下联系方式，便于我们为您提供服务',
							cancelText: '取消',
							confirmText: '联系我们',
							success(res) {
								console.log(res)
								if (res.confirm) {
									wx.navigateTo({
										url: '/pages/index/add_beds/add_beds',
									})
								}
							},
						})
					}
				}).catch(err => {
					uni.$u.toast('出错了~');
				})
			},
		}
	}
</script>

<style lang="scss">

</style>