<template>
	<view class="config-order bg-active-color" >
		<view class="wait">
			<h3>等待发货</h3>
		</view>
		<Lines></Lines>
		<!-- 商品 -->
		<view class="goods-list">
			<view class="goods-content" v-for="(item,index) in goodsList" :key="index">
				<view class="goods-id">
				订单号：	{{item.order_id}}
				</view>
				<view class="goods-text">
					<view class="goods-name">{{item.goods_name}}</view>
					<view class="goods-size f-color">颜色分类：黑色</view>
					<view class="f-active-color" style="font-size: 24rpx;">7天无理由</view>
				</view>	
				<view class="">
					<view class="">￥{{item.goods_price}}</view>
					<view class="f-color">x{{item.goods_num}}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
    import { state } from '../../server/db/sql'
	export default {
		data() {
			return {
				goodsList:[],
				totalCount:0
			}
		},
		computed:{
			
		},
		onLoad(e){
			$http.request({
				url:"/getShop",
				method:"POST",
			}).then((res)=>{
				this.goodsList = res
			}).catch(()=>{
				uni.showToast({
					title:'请求失败',
					icon:'none'
				})
			})
			
		},
		// 清空移除
		onUnload() {
		},
		components:{
			Lines
		},
		methods: {
			
		}
	}
</script>

<style scoped>
	.wait{
		text-align: center;
		background-color: orange;
	}
.config-order{
	position: absolute;
	left:0;
	top: 0;
	right: 0;
	bottom:0;
	width: 100%;
	height: 100%;
}	
.order-map{
	padding:20rpx;
	background-color: white;
	line-height: 40rpx;
}
.map-title{
	display: flex;
	justify-content: space-between;
}
.map-name{
	font-weight: bold;
}
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
		margin: 20rpx;
	}
	.goods-list{
		margin-top: 20rpx;
		background-color: white;
		padding: 20rpx;
	}
	.order-foot{
		position: fixed;
		bottom: 0;
		left: 0;
		background-color: white;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		width: 100%;
		height: 80rpx;
	}
	.comfirm{
		color: white;
		background-color: aqua;
		padding: 10rpx 30rpx;
	}
	.totle-price{
		padding: 0 20rpx;
	}
</style>
