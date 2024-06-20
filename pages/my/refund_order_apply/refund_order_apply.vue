<template>
	<view>
		<view style="line-height: 1.5;">
			<view class="flex align-center padding u-border-top" @click="show=true">
				<view>退款原因：</view>
				<view class="text-gray margin-left-sm">请先选择退款原因</view>
				<view style="margin-left: auto;"><u-icon size="24rpx" name="arrow-right" color="#333"></u-icon></view>
			</view>
			<view class="flex align-center padding u-border-top u-border-top-bottom">
				<view>联系方式：</view>
				<view class="margin-left-sm"><u--text mode="phone" text="13368088740" format="encrypt"></u--text></view>
			</view>
		</view>
		<view class="padding margin-top-xl">
			<u-button type="error" disabled shape="circle" text="申请退款"></u-button>
		</view>

		<view class="margin-top-xl padding" style="color: #666;line-height: 1.5;">
			<view>温馨提示：<br><br>1. 消费者因个人原因申请退货，包邮商品需要承担返回运费，非包邮商品需要承担送饭两程运费<br>2. 订单一旦取消，无法恢复<br></view>
		</view>
		<u-popup :show="show" @close="close" closeable round="20rpx" :closeOnClickOverlay="false">
			<view class="padding">
				<view class="text-center text-lg text-bold">取消原因</view>
				<view class="margin-top-xl padding" style="color: #666;line-height: 1.5;background-color: #f8f8f8;">
					<view>温馨提示：<br><br>1. 消费者因个人原因申请退货，包邮商品需要承担返回运费，非包邮商品需要承担送饭两程运费<br>2. 订单一旦取消，无法恢复<br></view>
				</view>
				<view class="margin-top text-bold">请选择取消订单的原因（必选）：</view>
				<view class="margin-top padding-lr-sm">
					<u-radio-group v-model="radiovalue1" placement="column" @change="groupChange">
						<u-radio :customStyle="{marginBottom: '8px'}" v-for="(item, index) in radiolist1" :key="index"
							:label="item.name" :name="item.name" @change="radioChange">
						</u-radio>
					</u-radio-group>
				</view>
				<view class="margin-top-sm">
					<u-button :disabled="radiovalue1 ==''" type="error" shape="circle" text="确定"></u-button>
				</view>
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
				show: false,
				// 基本案列数据
				radiolist1: [{
						name: '苹果',
						disabled: false
					},
					{
						name: '香蕉',
						disabled: false
					},
					{
						name: '橙子',
						disabled: false
					}, {
						name: '榴莲',
						disabled: false
					}
				],
				// u-radio-group的v-model绑定的值如果设置为某个radio的name，就会被默认选中
				radiovalue1: '',
			};
		},
		methods: {
			groupChange(n) {
				console.log('groupChange', n);
			},
			radioChange(n) {
				console.log('radioChange', n);
			},
			close(){
				this.show = false
			}
		}
	}
</script>

<style lang="scss">

</style>