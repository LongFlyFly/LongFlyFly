<template>
	<!-- 此组件的作用是传递不同的值 -->
	<view class="commodity-list">
		<!-- 商品列表 -->
		<Commodity :dataList='dataList'></Commodity>
	</view>
</template>
	
<script>
	import Commodity from './Commodity.vue'
	export default{
		props:{
			dataList:Array
		},
		// data(){
		// 	return{
		// 		commodityList:[
		// 			{id:1,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:2,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 		]
		// 	}
		// },
		
		
		components:{
			Commodity
		}
	}
</script>

<style scoped>
	/* .commodity-list{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	} */
</style>
