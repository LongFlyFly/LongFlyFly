<template>
	<view class="icons">
		<view class="icons-item" v-for="(item,index) in dataList" :key='index'>
			<image class="icons-img" :src="item.imgUrl" mode=""></image>
			<text class="f-color">{{item.name}}</text>
		</view>
		
	</view>
</template>

<script>
	export default{
		props:{
			dataList:Array
		}
	}
</script>

<style scoped>
	.icons{
		display: flex;
		flex-wrap: wrap;
	}
	.icons-img{
		width: 110rpx;
		height: 110rpx;
	}
	.icons-item{
		width: 25%;
		display: flex;
		/* 垂直 */
		flex-direction: column;
		/* 垂直水平居中 */
		align-items: center;
		justify-content: center;
		padding-top:20rpx ;
	}
</style>
