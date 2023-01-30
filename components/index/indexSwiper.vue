<template>
	<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
		<swiper-item v-for="(item,index) in dataList" :key="index">
			<view class="swiper-item">
				<image class="swiper-img" :src="item.imgUrl" mode=""></image>
			</view>
		</swiper-item>
		<!-- <swiper-item>
			<view class="swiper-item">
				<image class="swiper-img" src="../../static/img/banner-2.jpg" mode=""></image>
			</view>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item">
				<image class="swiper-img" src="../../static/img/banner-3.jpg" mode=""></image>
			</view>
		</swiper-item>
		<swiper-item>
			<view class="swiper-item">
				<image class="swiper-img" src="../../static/img/banner-4.jpg" mode=""></image>
			</view>
		</swiper-item> -->
	</swiper>
</template>

<script>
	export default{
		// 接收数据
		props:{
			dataList:Array
		}
	}
</script>

<style scoped>
	/* swiper默认150px的高度 */
	swiper{
		width: 100%;
		height: 400rpx;
	}
	.swiper-img{
		width: 100%;
		/* 用rpx单位 */
		height: 400rpx;
	}
</style>
