<template>
	<view class="commodity" :style="'flex-warp:'+warp+';'">
		<!-- 单个商品组件 -->
		<view class="commodity-item" 
		v-for="(item,index) in dataList"
		:key="index"
		:style="'width:'+itemW+';'"
		@tap="goDetails(item.Id)"
		>
			<!-- 传不同的style的值 -->
			<image class="commodity-img" 
			:src="item.imgUrl"
			 mode=""
			 :style="'height:'+bigH+';'"
			 ></image>
			 
			<view class="commodity-content">
				<text class="commodity-name" :style="'font-size:'+nameSize+';'">{{item.name}}</text>
				<view class="">
					<text class="pprice">￥{{item.pprice}}</text>
					<text class="oprice">￥{{item.oprice}}</text>
				</view>
				<text class="discount">{{item.discount}}折</text>
			</view>
		</view>
		
	</view>
</template>

<script>
	export default{
		// 接收commodityList里面的数据
		props:{
			// 数据
			dataList:Array,
			// 下面推荐的布局
			// 宽度
			itemW:{
				type:String,
				default:"375rpx"
			},
			// 高度
			bigH:{
				type:String,
				default:"375rpx"
			},
			// 是否换行
			warp:{
				type:String,
				default:"warp"
			},
			// 商品文字大小
			nameSize:{
				type:String,
				default:"26rpx",
			}
		},
		methods:{
			goDetails(Id){
				uni.navigateTo({
					url:'../../pages/detail/detail?id='+Id+''
				})
			}	
		}
	}
</script>

<style scoped>
	.commodity{
		display: flex;
		flex-wrap: wrap;
		justify-content: space-between;
	}
	.commodity-item{
		padding-bottom:20rpx ;
	}
	.commodity-img{
		width: 100%;
	}
	.commodity-content{
		text-align: center;
	}
	.commodity-name{
		overflow: hidden;
		/* 超出现实省略号 */
		text-overflow: ellipsis;
		display: -wap-box;
		-webkit-line-clamp:2;
		-webkit-box-orient:vertical;
		color: #09BB07;
		word-break: break-all;
		padding: 10rpx 20rpx;
	}
	.oprice{
		/* 打折划线 */
		text-decoration: line-through;
		font-size: 24rpx;
		color: #999999;
	}
	.discount{
		border-radius: 4rpx;
		border: 1px solid red;
		padding: 2rpx 10rpx;
		font-size: 20rpx;
		color: red;
	}
</style>
