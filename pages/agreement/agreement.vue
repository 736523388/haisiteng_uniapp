<template>
	<view>
		<u-loading-page :loading="!loaded" loading-text="My Hastens" loading-mode="semicircle"></u-loading-page>
		<rich-text style="font-size: 0;" :nodes="content" v-if="loaded && content != null"></rich-text>
		<u-empty mode="page" v-if="loaded && content == null">
		</u-empty>
	</view>
</template>

<script>
	import {
		axios
	} from '@/utils/request.js'
	export default {
		data() {
			return {
				loaded: false,
				content: null
			};
		},
		onLoad(options) {
			console.log(options)
			if (!options.name) {
				this.loaded = true;
			} else {
				axios.get('/api/v1/data?name=' + options.name).then(res => {
					console.log(res)
					if (res.code === 1 && res.data.name) {
						uni.setNavigationBarTitle({
							title: res.data.name,
						})
						this.content = res.data.content
					}
				}).finally(() => {
					this.loaded = true
				})
			}
		}
	}
</script>

<style lang="scss" scoped>
image{
	display: block;
	margin: 0;
}
</style>