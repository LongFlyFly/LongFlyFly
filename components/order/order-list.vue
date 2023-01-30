<template>
	<view class="goods-content">
	<image class="goods-img" :src="item.imgUrl" mode=""></image>
	<view class="goods-text">
		<view class="goods-name">{{item.name}}</view>
		<view class="goods-size f-color">颜色分类：{{item.attrs}}</view>
		<view class="f-active-color" style="font-size: 24rpx;">7天无理由</view>
	</view>	
	<view class="">
		<view class="">￥{{item.pprice}}</view>
		<view class="f-color">x{{item.num}}</view>
	</view>
	</view>
</template>

<script>
	export default{
		props:{
			item:Object,
			index:Number
		}
	}
</script>

<style>
	.goods-name{
		font-size: 26rpx;
	}
	.goods-text{
		width: 300rpx;
		padding: 0 10rpx;
		font-size: 26rpx;
	}
	.goods-size{
		font-size: 24rpx;
	}
	.goods-img{
		width: 160rpx;
		height: 160rpx;
	}
	.goods-content{
		background-color: #ededed;
		padding: 10rpx 20rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
</style>