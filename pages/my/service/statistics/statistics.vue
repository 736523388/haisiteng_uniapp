<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<view class="bg-white" v-show="loaded">
			<view class="flex align-center bg-white margin-bottom">
				<view style="width: 90%;">
					<u-cell-group>
						<u-cell :border="false" :title="date == '' ? '选择日期区间' : '当前选择：' +date" :isLink="true" arrow-direction="down" @click="show=true"></u-cell>
					</u-cell-group>
				</view>
				<view v-if="date !== ''" @click="clear">
				      <u-icon name="reload" />
				    </view>
			</view>
			
			<view class="bg-white margin-left">用户新增</view>
			<view class="box">
				<view v-for="(item, index) in levels" :key="item.code">
					<view class="text-xl">{{item.count}}</view>
					<view class="text-desc">{{item.name}}</view>
				</view>
			</view>
			<view class="bg-white margin-left">床具销售</view>
			<view class="box">
				<view v-for="(item, index) in beds" :key="item.type">
					<view class="text-xl">{{item.count}}</view>
					<view class="text-desc">{{item.type}}</view>
				</view>
			</view>
			<block v-if="bed_service.length > 0">
				<view class="bg-white margin-left">床具服务</view>
				<view class="box">
					<view v-for="(item, index) in bed_service" :key="item.id">
						<view class="text-xl">{{item.count}}</view>
						<view class="text-desc">{{item.name}}</view>
					</view>
				</view>
			</block>
		</view>
		<u-calendar :show="show" mode="range" :minDate="minDate" :maxDate="maxDate" :defaultDate="defaultDate" :closeOnClickOverlay="true" @close="show=false" :monthNum="12" :allowSameDay="true" @confirm="onDateConfirm"></u-calendar>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	const today = new Date();
	today.setMonth(0); // 一月的索引是0
	today.setDate(1);
	const thisYearFirstDay = today;
	export default {
		data() {
			return {
				loaded: false,
				date: '',
				start_date: '',
				end_date: '',
				levels: [],
				beds: [],
				bed_service: [],
				show: false,
				minDate: thisYearFirstDay.getTime(),
				maxDate: new Date().getTime()
			};
		},
		computed: {
			defaultDate(){
				if(this.start_date != '' && this.end_date != '') {
					return [this.start_date, this.end_date]
				} else {
					return null
				}
			}
		},
		onLoad() {
			this.loadData()
		},
		methods: {
			loadData() {
				axios.get('/api/v1/admin/statistics', {
					params: {
						start_date: this.start_date,
						end_date: this.end_date
					}
				}).then(res => {
					if (res.code === 1) {
						this.levels = res.data.levels
						this.beds = res.data.beds
						this.bed_service = res.data.bed_service
					}
				}).finally(() => {
					this.loaded = true
				})
			},
			onDateConfirm(e){
				console.log(e)
				this.start_date = e[0]
				this.end_date = e[e.length-1]
				this.date = this.start_date + ' ~ ' + this.end_date
				this.show = false
				this.levels = []
				this.beds = []
				this.bed_service = []
				this.loadData()
			},
			clear(){
				this.start_date = ''
				this.end_date = ''
				this.date = ''
				this.show = false
				this.levels = []
				this.beds = []
				this.bed_service = []
				this.loadData()
			}
		}
	}
</script>

<style lang="scss" scoped>
	.box {
		display: flex;
		align-items: center;
		background-color: #fff;
		box-sizing: border-box;
		flex-wrap: wrap;
	}

	.box>view {
		width: 25%;
		text-align: center;
		border-right: 1px solid #ccc;
		padding: 20rpx 0;
	}

	.box>view:nth-child(4n) {
		border-right: none;
	}
</style>