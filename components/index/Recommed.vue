<template>
	<view class="recommend bg-color">
		<view class="recommend-item" v-for="(item,index) in dataList" :key="index">
			<!-- 大图 -->
			<image class="recommend-big" :src="item.bigUrl" mode=""></image>
			
			<view class="recommend-small">
				
				<block v-for="(k,i) in item.data" :key="i">
					<image class="item-img" :src="k.imgUrl" mode=""></image>
					<!-- <image class="item-img" src="../../static/img/chao-2.png" mode=""></image>
					<image class="item-img" src="../../static/img/chao-3.png" mode=""></image> -->
				</block>
				
			</view>
		</view>
		
		<!-- <view class="recommend-item">
			<image class="recommend-big" src="../../static/img/banner-3.jpg" mode=""></image>
			<view class="recommend-small">
				<image class="item-img" src="../../static/img/chao-1.png" mode=""></image>
				<image class="item-img" src="../../static/img/chao-2.png" mode=""></image>
				<image class="item-img" src="../../static/img/chao-3.png" mode=""></image>
			</view>
		</view> -->
		
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
	.recommend{
		padding: 20rpx;
		
	}
	.recommend-item{
		display: flex;
		flex-direction: column;
		border-radius: 20rpx;
		border: 2rpx solid #CCCCCC;
		overflow: hidden;
		margin: 20rpx 0;
	}
	.recommend-big{
		width: 100%;
		height: 300rpx;
	}
	.recommend-small{
		width: 100%;
		height: 240rpx;
	}
	.item-img{
		width: 33.333%;
		height: 240rpx;
	}
</style>
