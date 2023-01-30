<template>
	<view class="hot">
		<!-- 传值itewW,bigH来适应不同的选择情况 -->
		<Commodity :dataList="dataList" itemW="250rpx" bigH="220rpx"></Commodity>
	</view>
</template>

<script>
	import Commodity from '../common/Commodity.vue'
	export default{
		props:{
			dataList:Array
		},
		components:{
			Commodity
		}
	}
</script>

<style>
</style>
