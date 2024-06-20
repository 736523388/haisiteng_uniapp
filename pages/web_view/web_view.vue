<template>
	<web-view :src="web_url" allow="*"></web-view>
</template>

<script>
	export default {
		data() {
			return {
				web_url: ''
			};
		},
		onLoad(options) {
			this.web_url = options.url
		}
	}
</script>

<style lang="scss">

</style>