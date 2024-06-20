<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="container radius-lg bg-white padding margin-top-sm">
				<view class="flex justify-between align-center">
					<view>服务进度</view>
					<view><u-button
							@click="$globalJump2View('/pages/my/refund_order_logs/refund_order_logs?id='+detail.id, true)"
							type="primary" size="mini" shape="circle" plain text="查看更多"></u-button></view>
				</view>
				<view style="background-color: #f8f8f8;" class="padding-tb margin-tb">
					<uni-steps active-color="#303133" :options="refund_step" :active="refund_step_active"></uni-steps>
				</view>
				<view class="margin-tb-xs">{{detail.step_status_txt}}</view>
				<view class="text-sm" style="color: #666;" v-if="detail.last_logs">{{detail.last_logs.content || ''}}</view>
			</view>
			<view class="container radius-lg bg-white padding margin-top-sm">
				<view class="flex">
					<view>
						<image mode="aspectFill" style="height: 150rpx;width: 150rpx;"
							src="http://hst-default.oss-cn-chengdu.aliyuncs.com/8c/2a07fdcdcf14acdaf63764da2a1601.jpg">
						</image>
					</view>
					<view class="flex flex-direction" style="height: 150rpx;">
						<view class="padding-tb-xs padding-lr-sm text-sm u-line-2" style="max-height: 76rpx;">
							Hastens 海丝腾纯白系列床品枕套被套柔软床上用品 「白色 大号」Hastens 海丝腾纯白系列床品枕套被套柔软床上用品 「白色 大号」
						</view>
						<view class="padding-tb-xs padding-lr-sm">
							<view>
								<text class="text-xs">数量：1</text>
							</view>
						</view>
					</view>
				</view>
				<view class="refund_order_desc_cell u-border-top">
					<view>
						<view class="label">订单编号</view><text>{{detail.order_no}}</text>
						<view class="copy">复制</view>
					</view>
					<view>
						<view class="label">服务单号</view><text>{{detail.code}}</text>
						<view class="copy">复制</view>
					</view>
					<view>
						<view class="label">申请时间</view><text>{{detail.create_at}}</text>
					</view>
					<view>
						<view class="label">服务类型</view><text>{{detail.type == 1 ? '仅退款':'退货退款'}}</text>
					</view>
					<view>
						<view class="label">申请原因</view><text>{{detail.reason}}</text>
					</view>
					<view>
						<view class="label">详细原因</view><text>{{detail.content}}</text>
					</view>
					<view>
						<view class="label">退款方式</view><text>原支付返回</text>
					</view>
				</view>
				<view class="refund_order_desc_cell u-border-top">
					<view>
						<view class="label">返件方式</view><text>寄件</text>
					</view>
					<view>
						<view class="label">寄件信息</view><text>{{refundsend.name}} {{refundsend.phone}} </text>
					</view>
					<view>
						<view class="label"></view><text>{{refundsend.province}}{{refundsend.city}}{{refundsend.area}}{{refundsend.content}}</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		axios,
		checkLogin
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				id: '',
				loaded: false,
				refund_step_active: 1,
				refund_step: [{
					title: '提交审核'
				}, {
					title: '平台审核'
				}, {
					title: '平台收货'
				}, {
					title: '退款'
				}, {
					title: '完成'
				}],
				detail: {},
				refundsend: {}
			};
		},
		onLoad(options) {
			this.id = options.id || ''
			axios.get('/api/v1/data?name=refundsend').then(res => {
				console.log(res)
				if(res.code === 1) {
					this.refundsend = Object.assign(this.refundsend, res.data)
				}
			})
			checkLogin(() => {
				axios.get('/api/v1/user/refund_order/' + this.id).then(res => {
					console.log(res)
					if (res.code === 1) {
						this.refund_step = res.data.refund_step
						this.refund_step_active = res.data.refund_step_active
						this.detail = Object.assign(this.detail, res.data)
						console.log(this.detail)
						this.$nextTick(() => {
							this.loaded = true
						})
					}
				})
			})
		}
	}
</script>

<style lang="scss">
	/deep/.uni-steps__row-title {
		font-size: 12px;
		line-height: 14px;
	}

	.refund_order_desc_cell {
		color: #666;
		font-size: 12px;
		line-height: 16px;
		padding: 10px 0;

		>view {
			display: flex;
			padding: 10rpx 0;
			align-items: center;

			>.label {
				width: 150rpx;
			}

			>text {
				color: #303133;
				margin-right: 30rpx;
			}

			>.copy {
				border-width: 0.5px !important;
				border-color: #e4e7ed !important;
				border-style: solid;
				font-size: 20rpx;
				padding: 0 20rpx;
				border-radius: 999rpx;
			}
		}
	}
</style>