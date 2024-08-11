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
				<view class="text-sm margin-bottom" style="color: #666;" v-if="detail.last_logs">
					{{detail.last_logs.content || ''}}</view>
				<view class="refund_order_desc_cell u-border-top" v-if="detail.type == 2 && detail.step_status==4">
					<view>
						<view class="label">返件方式</view><text>寄件</text>
						<view><u-button @click.native="inputDialogToggle" type="error" size="mini" shape="circle" plain text="我已寄出"></u-button></view>
					</view>
					<view>
						<view class="label">寄件信息</view><text>{{refundsend.name}} {{refundsend.phone}} </text>
					</view>
					<view>
						<view class="label"></view>
						<text>{{refundsend.province}}{{refundsend.city}}{{refundsend.area}}{{refundsend.content}}</text>
					</view>
				</view>
			</view>
			<view class="container radius-lg bg-white padding margin-top-sm">
				<view class="flex" v-for="(item,index) in detail.goods" :key="item.id">
					<view>
						<image mode="aspectFill" style="height: 150rpx;width: 150rpx;" :src="item.goods_cover">
						</image>
					</view>
					<view class="flex flex-direction" style="height: 150rpx;">
						<view class="padding-tb-xs padding-lr-sm text-sm u-line-2" style="max-height: 76rpx;">
							{{item.goods_name}} 「{{item.goods_spec}}」
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
						<view class="copy" @click="copyOrderNo">复制</view>
					</view>
					<view>
						<view class="label">服务单号</view><text>{{detail.code}}</text>
						<view class="copy" @click="copyCode">复制</view>
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
					<!-- 					<view>
						<view class="label">详细原因</view><text>{{detail.content}}</text>
					</view> -->
					<view v-if="detail.send_datetime">
						<view class="label">寄回服务</view><text>{{detail.send_company}}</text>
					</view>
					<view v-if="detail.send_datetime">
						<view class="label">寄回运单号</view><text>{{detail.send_number}}</text>
					</view>
					<view v-if="detail.step_status == 2 || detail.step_status == 4 || detail.step_status == 5 || detail.step_status == 6 || (detail.step_status > 8 && detail.step_status < 12)">
						<view class="label">退款金额</view><text>￥{{detail.real_refund_amount}}</text>
					</view>
					<view>
						<view class="label">退款方式</view><text>原支付返回</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 输入框示例 -->
		<uni-popup ref="inputDialog" type="center" background-color="#fff" borderRadius="10px">
			<view class="padding bg-white">
				<!-- <view class="margin-bottom-xs">
					<uni-easyinput :errorMessage="send_company_error" v-model="send_company" focus placeholder="请输入物流公司名称"></uni-easyinput>
				</view> -->
				<view class="margin-bottom-xs">
					<uni-data-select
					        v-model="send_company"
					        :localdata="send_company_range"
					      ></uni-data-select>
				</view>
				
				<view class="margin-bottom-sm">
					<uni-easyinput :errorMessage="send_number_error" v-model="send_number" placeholder="请输入物流单号"></uni-easyinput>
				</view>
				<view>
					<u-button text="确认" type="primary" size="small" @click.native="confirm_express"></u-button>
				</view>
				
			</view>
		</uni-popup>
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
				send_company_range: [
					{ value: '顺丰速运', text: "顺丰速运" },
				    { value: '申通快递', text: "申通快递" },
				    { value: '圆通快递', text: "圆通快递" },
					{ value: '韵达快递', text: "韵达快递" },
					{ value: '菜鸟快递', text: "菜鸟快递" },
					{ value: '其他', text: "其他" },
				],
				send_company: '',
				send_company_error: false,
				send_number: '',
				send_number_error: false,
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
				detail: {
					goods: []
				},
				refundsend: {}
			};
		},
		onLoad(options) {
			this.id = options.id || ''
			axios.get('/api/v1/data?name=refundsend').then(res => {
				console.log(res)
				if (res.code === 1) {
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
		},
		methods: {
			confirm_express(){
				if(this.send_company == '') {
					this.send_company_error = true
				} else {
					this.send_company_error = false
				}
				if(this.send_number == '') {
					this.send_number_error = true
				} else {
					this.send_number_error = false
				}
				if(this.send_company == '' || this.send_number == '') {
					return false
				}
				uni.showLoading()
				axios.post('/api/v1/user/refund_order/confirm_express', {
					code: this.detail.code,
					send_company: this.send_company,
					send_number: this.send_number
				}).then(res => {
					uni.hideLoading()
					this.$refs.inputDialog.close()
					uni.showToast({
						title: res.info,
						icon: 'none',
						duration: 1200
					})
					if(res.code === 1) {
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
					}
					
				}).catch(error => {
					uni.hideLoading()
				})
			},
			dialogInputConfirm(val) {
				uni.showLoading({
					title: '3秒后会关闭'
				})

				setTimeout(() => {
					uni.hideLoading()
					console.log(val)
					this.value = val
					// 关闭窗口后，恢复默认内容
					this.$refs.inputDialog.close()
				}, 3000)
			},
			inputDialogToggle() {
				this.$refs.inputDialog.open()
			},
			copyCode() {
				var that = this;
				uni.setClipboardData({
					data: that.detail.code,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1200,
						})
					}
				})
			},
			copyOrderNo() {
				var that = this;
				uni.setClipboardData({
					data: that.detail.order_no,
					success: function(res) {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
							duration: 1200,
						})
					}
				})
			},
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