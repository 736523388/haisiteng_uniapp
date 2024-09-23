<template>
	<view>
		<view class="container-xl padding flex flex-direction justify-between">
			<view>
				<view class="padding-tb-sm text-lg">发票抬头</view>
				<view class="">
					<view style="display: inline-block;">
						<u-button @click="type=1" size="small" type="primary"
							:plain="type ==2">个人</u-button>
					</view>
					<view style="display: inline-block;margin-left:20rpx;">
						<u-button @click="type=2" size="small" type="primary"
							:plain="type ==1">单位</u-button>
					</view>
				</view>
				<view class="flex align-center padding-top-sm padding-bottom-xs" style="width: 650rpx;">
					<view style="width: 180rpx;">{{type==1 ? '个人名称':'单位名称'}}</view>
					<view style="flex-grow: 1;"><input name="name" v-model="name"
							:placeholder="'请填写' + (type==1 ? '您的姓名' : '单位名称')" /></view>
				</view>
				<view v-if="type==2" class="flex align-center padding-top-xs padding-bottom-xs"
					style="width: 650rpx;">
					<view style="width: 180rpx;">纳税人识别号</view>
					<view style="flex-grow: 1;"><input name="licence_no" v-model="licence_no"
							placeholder="请填写纳税人识别码" /></view>
				</view>
				<view class="padding-tb-sm text-lg">发票内容</view>
				<view class="">
					<view style="display: inline-block;">
						<u-button @click="content_type=1" size="small" type="primary"
							:plain="content_type ==2">商品明细</u-button>
					</view>
					<view style="display: inline-block;margin-left:20rpx;">
						<u-button @click="content_type=2" size="small" type="primary"
							:plain="content_type ==1">商品类别</u-button>
					</view>
				</view>
				<view class="padding-tb-sm text-sm">
					{{content_type == 1 ? '发票内容将显示详细商品名称与价格信息' : '发票内容将显示商品所属类别及价格信息'}}，发票金额为实际支付金额，不含优惠扣减金额。
				</view>
			</view>
		</view>
		<view style="position: fixed;bottom: 0;width: 100%;" class="padding">
			<button type="default" @click="confirmInvoice" style="color:#ffffff;background-color:#e43d33;border-color:#e43d33;border-radius: 999rpx;">确定</button>
		</view>
	</view>
	
</template>

<script>
	import {
		axios, checkLogin
	} from '@/utils/request'
	export default {
		data() {
			return {
				order_no: '',
				type: 1,
				name: "",
				licence_no: "",
				content_type: 1
			};
		},
		onLoad(options) {
			this.order_no = options.order_no || ''
			checkLogin(async () => {
				try {
					const ref3 = await axios.get('/api/v1/user/invoice')
					if (ref3.code === 1) {
						this.type = ref3.data.type
						this.content_type = ref3.data.content_type
						this.name = ref3.data.name
						this.licence_no = ref3.data.licence_no
						console.log(this.data)
					}
				} catch (error) {
					console.log(error)
				}
			})
		},
		methods: {
			confirmInvoice(){
				if(this.name == '') {
					uni.showToast({
						title: this.type == 1 ? '请输入姓名' : '请输入企业名称',
						icon: 'none',
						duration: 1200
					})
					return
				}
				if(this.type == 2 && this.licence_no == '') {
					uni.showToast({
						title: '请输入纳税识别码',
						icon: 'none',
						duration: 1200
					})
					return
				}
				axios.post('/api/v1/user/order/apply_invoice', {
					order_no: this.order_no,
					type: this.type,
					name: this.name,
					licence_no: this.licence_no,
					content_type: this.content_type
				}).then(res => {
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
				}).catch(err => {
					uni.showToast({
						title: "提交失败，请重试",
						icon: 'none',
						duration: 1200
					})
				})
			}
		}
	}
</script>

<style lang="scss">
page {
	background-color: #fff;
}
</style>
