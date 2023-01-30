<template>
	<view class="shop">
		<view class="shop-item" v-for="(item,index) in dataList" :key='index'>
			
			<view class="shop-big">
				<image class="shop-big" :src="item.bigUrl" mode=""></image>
			</view>
			
			<!-- 滑块 -->
			<scroll-view scroll-x="true" class="scroll-content">
				<view class="scroll-item">
					<Commodity 
					:dataList="item.data"
					warp="no=warp"
					itemW="200rpx"
					bigH="200rpx"
					nameSize="20rpx"
					></Commodity>
				</view>
			</scroll-view>
			
		</view>
		
	</view>
</template>

<script>
	import Commodity from '../common/Commodity.vue'
	export default{
		props:{
			dataList:Array
		},
		// data(){
		// 	return{
		// 		shopList:[
		// 			{id:1,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:2,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:3,imgUrl:"../../static/img/chao-3.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:4,imgUrl:"../../static/img/chao-4.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:5,imgUrl:"../../static/img/chao-1.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 			{id:6,imgUrl:"../../static/img/chao-2.png",name:"哈哈哈好好好",pprice:"299",oprice:"599",discount:"5.2"},
		// 		]
		// 	}
		// },
		components:{
			Commodity
		}
	}
</script>

<style scoped>
	.shop-big{
		width: 100%;
		height: 350rpx;
	}
	.scroll-item{
		display: inline-block;
	
	}
	.scroll-content{
		width: 100%;
		/* 不换行 */
		white-space: nowrap;
	}
</style>
