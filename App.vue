<script>
	import {
		axios
	} from '@/utils/request.js'
	
	export default {
		onLaunch: function() {
			console.log('App Launch')
			axios.get("/api/v1/slider?keys=SliderHome").then(res => {
				this.$store.commit('global/update_banner', {
					banner: res.data
				})
			})
			axios.get("/api/v1/common").then(res => {
				this.$store.commit('global/update_common', res.data)
			})
			if (this.$store.getters['user/is_login']) {
				axios.get('/api/v1/user/goods/cart_num').then(res => {
					if (res.code === 1) {
						this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
							number: res.data
						})
					}
				}).catch(err => {
					console.log(err)
				})
			} else {
				this.$store.dispatch('goods_cart/update_goods_cart_number_badge', {
					number: 0
				})
			}

		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "@/static/uview.theme.scss";
	@import "@/uni_modules/uview-ui/index.scss";
	@import "@/static/style/stylesheet.css";
	@import "@/static/colorui/main.css";

	page {
		font-family: Source_Han_Sans_SC_Normal,
			BlinkMacSystemFont,
			'Helvetica Neue',
			Helvetica,
			Segoe UI,
			Arial,
			Roboto,
			'PingFang SC', 'miui', 'Hiragino Sans GB', 'Microsoft Yahei', sans-serif;
		color: $u-main-color;
		font-size: 28rpx;
		background-color: $u-bg-color;
		box-sizing: border-box;
	}
	
	// uni-page-body,html,body {
	// 	height: 100%;
	// }


	.container {
		box-sizing: border-box;
		width: 690rpx;
		margin: 0 auto;
	}
	
	.container-xl {
		width: 710rpx;
		margin: 0 auto;
	}

	.container-bar {
		padding: 10rpx 0;
	}

	.content-img {
		display: block;
		height: auto;
		width: 100%;
	}

	.text-desc {
		color: $u-tips-color !important;
	}

	.page-bar {
		background-color: var(--bar-default-background-color, #000030);
		color: var(--bar-default-color, #fff);
		text-align: center;
		padding: 12rpx 0;

		.page-bar-desc {
			color: #71717a;
			margin-top: 12rpx;
		}
	}
	
	.pos-re{
		position: relative;
	}
	
	.uni-input-placeholder,.uni-textarea-placeholder{
		color: #808080 !important;
		font-size: 28rpx !important;
	}
	.uni-input-input,.uni-textarea-textarea{
		font-size: 28rpx !important;
	}
</style>