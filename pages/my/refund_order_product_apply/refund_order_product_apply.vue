<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view v-if="loaded">
			<view class="container-xl bg-white radius-sm margin-top-xs">
				<view class="flex align-center padding-lr padding-top padding-bottom-sm" @click="show=true">
					<view class="refund_reason_input_label">退货原因</view>
					<view style="margin-left: auto;" class="flex align-center" :class="{'text-gray':radiovalue1 == ''}">
						{{radiovalue1 == '' ? '请选择': radiovalue1}}<u-icon size="24rpx" name="arrow-right"
							color="#333"></u-icon>
					</view>
				</view>
				<view class="flex align-center padding-lr padding-top-sm padding-bottom">
					<view>退货件数</view>
					<view style="margin-left: auto;" class="flex align-center text-gray">
						<u-number-box v-model="goods_number" @change="valChange" :min="1" :max="goods_number_total"
							integer :button-size="24"></u-number-box>
					</view>
				</view>
			</view>
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="flex align-center justify-end padding-lr padding-top padding-bottom-xs">
					<view style="flex: 1;">申请退款金额</view>
					<view class="flex align-center">
						<view class="text-sm">￥</view>
						<view><input v-model="refund_amount" type="digit" /></view><u-icon size="24rpx" name="edit-pen"
							color="#333"></u-icon>
					</view>
				</view>
				<view class="flex align-center padding-lr padding-bottom">
					<view></view>
					<view style="margin-left: auto;" class="flex align-center text-gray">
						最多可输入商品金额￥{{return_amount_total}}
					</view>
				</view>
			</view>
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="padding-lr padding-top padding-bottom-xs">上传凭证<text
						class="text-xs margin-left-xs">选填</text></view>
				<view class="padding-sm">
					<view class="padding-sm radius-sm" style="color: #666;background-color: #f8f8f8;">
						<u-upload :fileList="fileList1" @afterRead="afterRead" @delete="deletePic" name="1" multiple
							:maxCount="4"></u-upload>
					</view>
				</view>
			</view>
			<view class="container-xl bg-white radius-sm margin-top-sm">
				<view class="padding-lr padding-top padding-bottom-xs">补充描述<text
						class="text-xs margin-left-xs">选填</text></view>
				<view class="padding-sm">
					<view>
						<u--textarea v-model="content" placeholder="补充描述，有助于平台更好的处理售后问题" count
							maxlength="200"></u--textarea>
					</view>
				</view>
			</view>
			<view class="padding margin-top-xl">
				<u-button type="error" shape="circle" text="提交" @click.native="submit"></u-button>
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
						<u-radio activeColor="#303133" :customStyle="{marginTop: '8px',marginBottom: '8px'}"
							v-for="(item, index) in reasons" :key="index" :label="item.name" :name="item.name"
							@change="radioChange">
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
	import crypto from 'crypto-js'
	import {
		Base64
	} from 'js-base64'
	import {
		axios,
		checkLogin
	} from '@/utils/request.js'
	const date = new Date();
	date.setHours(date.getHours() + 1);
	const policyText = {
		expiration: date.toISOString(), // 设置policy过期时间。
		conditions: [
			// 限制上传大小。
			["content-length-range", 0, 1024 * 1024 * 1024],
		],
	};
	export default {
		data() {
			return {
				id: '',
				reasons: [],
				goods_name: '',
				goods_cover: '',
				goods_spec: '',
				show: false,
				radiovalue1: '',
				loaded: false,
				clickFlag: false,
				goods_number: 1,
				goods_number_total: 1,
				fileList1: [],
				content: '',
				refund_amount: '0.00',
				price_unit: '0.00',
				sts_params: null,
				order_item_amount_total: 0
			};
		},
		computed: {
			return_amount_total() {
				return this.price_unit * this.goods_number
			}
		},
		onLoad(options) {
			this.id = options.id || ''
			// this.price_unit = options.amount || '0.00'
			// this.goods_number_total = Number(options.number)
			// this.goods_number = this.goods_number_total
			// this.refund_amount = this.return_amount_total
			// this.order_item_amount_total = this.refund_amount
			const getReasons = axios.get('/api/v1/refund_order_reasons')
			const getItem = axios.get('/api/v1/user/order/get_item?order_item_id='+this.id)
			Promise.all([getReasons, getItem]).then(results => {
				console.log(results)
				if(results[0].code === 1 && results[1].code === 1) {
					this.reasons = results[0].data.reasons_type2.map((item, index) => {
						return {
							name: item
						}
					})
					this.goods_name = results[1].data.goods_name
					this.goods_cover = results[1].data.goods_cover
					this.goods_spec = results[1].data.goods_spec_alias
					this.price_unit = results[1].data.price_real
					this.goods_number_total = results[1].data.stock_sales
					this.goods_number = this.goods_number_total
					this.order_item_amount_total = results[1].data.total_real
					this.refund_amount = this.return_amount_total
					this.$nextTick(() => {
						this.loaded = true
					})
				}
			}).catch(error => {})
			// axios.get('/api/v1/refund_order_reasons').then(res => {
			// 	if (res.code === 1) {
			// 		this.reasons = res.data.reasons_type2.map((item, index) => {
			// 			return {
			// 				name: item
			// 			}
			// 		})
			// 		this.loaded = true
			// 	}
			// })

		},
		methods: {
			async getFormDataParams() {
				const credentials = await axios.get('/api/v1/sts/oss')
				const policy = Base64.encode(JSON.stringify(policyText)) // policy必须为base64的string。
				const signature = this.computeSignature(credentials.data.accessKeySecret, policy)
				const formData = {
					OSSAccessKeyId: credentials.data.accessKeyId,
					signature,
					policy,
					'x-oss-security-token': credentials.data.securityToken
				}
				return formData
			},
			computeSignature(accessKeySecret, canonicalString) {
				return crypto.enc.Base64.stringify(crypto.HmacSHA1(canonicalString, accessKeySecret));
			},
			valChange(e) {
				console.log(e)
				this.$nextTick(() => {
					this.refund_amount = this.return_amount_total
				})

			},
			submit() {
				if (this.radiovalue1 == '') {
					uni.showToast({
						title: '请选择退货原因',
						icon: 'none',
						duration: 1200
					})
					return
				}
				console.log(this.refund_amount)
				if (this.refund_amount <= 0) {
					uni.showToast({
						title: '退款金额不能小于0.01元',
						icon: 'none',
						duration: 1200
					})
					return
				}
				if(this.refund_amount > this.order_item_amount_total) {
					uni.showToast({
						title: '退款金额不能超过' + this.order_item_amount_total +'元',
						icon: 'none',
						duration: 1200
					})
					return
				}
				let data_images = ''
				if(this.fileList1.length > 0) {
					const images = []
					this.fileList1.forEach((item,index) => {
						images.push(item.url)
					})
					data_images = images.join('|')
				}
				uni.showLoading()
				axios.post('/api/v1/user/refund_order', {
					order_item_id: this.id,
					reason: this.radiovalue1,
					refund_number: this.goods_number,
					refund_amount: this.refund_amount,
					content: this.content,
					images: data_images
				}).then(res => {
					uni.hideLoading()
					uni.showToast({
						title: res.info,
						icon: 'none',
						duration: 1200
					})
					if (res.code === 1) {
						setTimeout(() => {
							uni.navigateBack()
						}, 1200)
					}
				}).catch(error => {
					uni.hideLoading()
					uni.showToast({
						title: error.message,
						icon: 'none',
						duration: 1200
					})
				})
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
				const sts_params = await this.getFormDataParams()
				for (let i = 0; i < lists.length; i++) {
					const key = 'forska/' + crypto.MD5(crypto.enc.Latin1.parse(lists[i].url)).toString(crypto.enc
						.Hex) + '.png'
					const result = await this.uploadFilePromise(lists[i].url, {
						key,
						...sts_params
					})
					let item = this[`fileList${event.name}`][fileListLen]
					this[`fileList${event.name}`].splice(fileListLen, 1, Object.assign(item, {
						status: 'success',
						message: '',
						url: result
					}))
					fileListLen++
				}
			},
			uploadFilePromise(url, data) {
				return new Promise((resolve, reject) => {
					let a = uni.uploadFile({
						url: 'https://hst-default.oss-cn-chengdu.aliyuncs.com', // 仅为示例，非真实的接口地址
						filePath: url,
						name: 'file',
						formData: data,
						success: (res) => {
							if (res.statusCode === 204) {
								resolve("https://hst-default.oss-cn-chengdu.aliyuncs.com/" + data.key)
							}
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
	/deep/.u-textarea {
		background-color: #f8f8f8;
	}
</style>
<style lang="scss">
	.refund_reason_input_label::after {
		content: "*";
		color: red;
		margin-left: 6rpx;
	}
</style>