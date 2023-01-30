<template>
	<view>
		<ShopList :keyword='keyword'></ShopList>
		
	</view>
</template>

<script>
	import ShopList from '@/components/common/ShopList.vue'
	export default {
		data() {
			return {
				keyword:""
			}
		},
		// 拿到搜索的值
		onLoad(e) {
			// 传值到组件上
			this.keyword=e.keyword
			
			// 只会在app中实现
			// #ifdef APP-PLUS
			var webView = this.$mp.page.$getAppWebview(); 
			webView.setTitleNViewSearchInputText(e.keyword)
			// #endif
			
			
		},
		components:{
			ShopList
		},
		methods: {
			
		}
	}
</script>

<style>

</style>
