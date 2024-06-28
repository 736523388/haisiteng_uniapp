<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="container-xl bg-white radius-sm margin-top-xs">
				<view class="flex align-center padding-lr padding-top padding-bottom-sm" @click="show=true">
					<view class="refund_reason_input_label">退货原因</view>
					<view style="margin-left: auto;" class="flex align-center" :class="{'text-gray':radiovalue1 == ''}">{{radiovalue1 == '' ? '请选择': radiovalue1}}<u-icon size="24rpx"
							name="arrow-right" color="#333"></u-icon></view>
				</view>
				<view class="flex align-center padding-lr padding-top-sm padding-bottom">
					<view>退货件数</view>
					<view style="margin-left: auto;" class="flex align-center text-gray">
						<u-number-box v-model="goods_number" @change="valChange"
							:min="1" :max="9" integer :button-size="24"></u-number-box>
					</view>
				</view>
			</view>
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="flex align-center justify-end padding-lr padding-top padding-bottom-xs">
					<view style="flex: 1;">申请退款金额</view>
					<view class="flex align-center">
						<view class="text-sm">￥</view><view><input :value="refund_amount" type="digit"/></view><u-icon size="24rpx" name="edit-pen" color="#333"></u-icon>
					</view>
				</view>
				<view class="flex align-center padding-lr padding-bottom">
					<view></view>
					<view style="margin-left: auto;" class="flex align-center text-gray">
						最多可输入商品金额￥{{return_amount_total}}
					</view>
				</view>
			</view>
<!-- 			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="flex align-center padding-lr padding-top padding-bottom-xs">
					<view>寄送地址</view>
					<view style="margin-left: auto;">
						大石坝东原中心7栋19楼
					</view>
				</view>
				<view class="flex align-center padding-lr padding-bottom">
					<view></view>
					<view style="margin-left: auto;" class="flex align-center text-gray">
						晏清 13883865432 重庆市重庆市江北区
					</view>
				</view>
			</view> -->
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="padding-lr padding-top padding-bottom-xs">上传凭证<text class="text-xs margin-left-xs">选填</text></view>
				<view class="padding-sm">
					<view class="padding-sm radius-sm" style="color: #666;background-color: #f8f8f8;">
						<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
							:maxCount="4"></u-upload>
					</view>
				</view>
			</view>
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="padding-lr padding-top padding-bottom-xs">补充描述<text class="text-xs margin-left-xs">选填</text></view>
				<view class="padding-sm">
					<view>
						<u--textarea v-model="content" placeholder="补充描述，有助于平台更好的处理售后问题" count maxlength="200"></u--textarea>
					</view>
				</view>
			</view>
			<view class="padding margin-top-xl">
				<u-button type="error" shape="circle" text="提交"
					@click.native="submit"></u-button>
			</view>
		</view>
		<u-popup :show="show" @close="close" closeable round="20rpx" bgColor="#f8f8f8" :closeOnClickOverlay="false">
			<view class="padding">
<!-- 				<view class="text-center text-lg text-bold">退货原因</view>
				<view class="margin-top-xl padding" style="color: #666;line-height: 1.5;background-color: #f8f8f8;">
					<view>温馨提示：<br><br>1. 消费者因个人原因申请退货，包邮商品需要承担返回运费，非包邮商品需要承担送返两程运费<br>2. 订单一旦取消，无法恢复<br></view>
				</view> -->
				<view class="margin-top-xs text-bold text-lg">选择退货原因</view>
				<view class="text-gray margin-top-xs">请选择真实原因，帮助商家处理申请</view>
				<view class="margin-top padding-lr padding-tb-sm bg-white radius-lg">
					<u-radio-group v-model="radiovalue1" placement="column">
						<u-radio activeColor="#303133" :customStyle="{marginTop: '8px',marginBottom: '8px'}" v-for="(item, index) in reasons" :key="index"
							:label="item.name" :name="item.name" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</view>
<!-- 				<view class="margin-top-sm">
					<u-button :disabled="radiovalue1 ==''" type="error" shape="circle" text="确定"
						@click.native="confirmReasons"></u-button>
				</view> -->
			</view>
		</u-popup>
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
				reasons: [],
				show: false,
				radiovalue1: '',
				loaded: false,
				clickFlag: false,
				goods_number: 1,
				goods_number_total: 9,
				fileList1: [],
				content: '',
				refund_amount: '39.64',
				price_unit: '39.64'
			};
		},
		computed: {
			return_amount_total(){
				return this.price_unit * this.goods_number
			}
		},
		onLoad(options) {
			this.id = options.id || ''
			axios.get('/api/v1/refund_order_reasons').then(res => {
				if (res.code === 1) {
					this.reasons = res.data.reasons_type2.map((item, index) => {
						return {
							name: item
						}
					})
					console.log(this.reasons)
				}
			})
			checkLogin(() => {
				setTimeout(() => {
					this.loaded = true
				}, 600)
			})
		},
		methods: {
			valChange(e) {
				console.log(e)
				this.$nextTick(() => {
					this.refund_amount = this.return_amount_total
				})
				
			},
			submit(){
				console.log(this.radiovalue1)
			},
			// 删除图片
			deletePic(event) {
				this[`fileList${event.name}`].splice(event.index, 1)
			}, // 新增图片
			async afterRead(event) {
				// 当设置 multiple 为 true 时, file 为数组格式，否则为对象格式
				let lists = [].concat(event.file)
				let fileListLen = this[`fileList${event.name}`].length
				lists.map((item) => {
					this[`fileList${event.name}`].push({
						...item,
						status: 'uploading',
						message: '上传中'
					})
				})
				for (let i = 0; i < lists.length; i++) {
					const result = await this.uploadFilePromise(lists[i].url)
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'http://192.168.2.21:7001/upload', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: {
							user: 'test'
						},
						success: (res) => {
							setTimeout(() => {
								resolve(res.data.data)
							}, 1000)
						}
					});
				})
			},
			confirmReasons() {
				this.show = false
			},
			radioChange(n) {
				this.radiovalue1 = n
				this.show = false
			},
			close() {
				this.show = false
			},
		}
	}
</script>
<style>
/deep/.u-textarea{
	background-color: #f8f8f8;
}
</style>
<style lang="scss">
.refund_reason_input_label::after {
	content:"*";
	color:red;
	margin-left: 6rpx;
}
</style>