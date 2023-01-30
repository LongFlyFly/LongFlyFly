<template>
	<view class="my-order bg-active-color" >
		<Lines></Lines>
		<view class="order-header">
			<view class="header-item" 
			v-for="(item,index) in tabList" 
			:key="index"
			:class=' tabIndex==index?"active":"" '
			@tap="changeTap(index)"
			>{{item.name}}</view>
		</view>
		
		<block v-for="(tabItem,tabI) in tabList" :key="tabI">
			
		<view class="" v-show="tabI===tabIndex" >
				
			
			<!-- 整个内容块 -->
			<!-- 先要判断是否定义 -->
			<view v-if='tabItem.list !=undefined && tabItem.list.length > 0' class="order-main" :style="'height:' +clentHeight+'px;'">
				
				<!-- 商品 -->
				<view class="" v-for="(k,i) in tabItem.list" :key="i">
					<view class="order-goods" >
							<!-- 当前的状态值 -->
							<view class="goods-status bg-active-color">{{k.status}}</view>
							
							<view class="goods-item" v-for="(item,index) in k.goods_item">
								<OrderList :item='item' :index='index'></OrderList>
							</view>
							
						</view>
					
					<Lines></Lines>
					<!-- 总价 -->
					<view class="total-price">
						订单金额:<text class="f-active-color">￥{{k.totalPrice}}</text>(包含运费)
					</view>
					<Lines></Lines>
					<!-- 支付 -->
					<view class="payment">
						<view class="payment-text f-active-color">支付</view>
					</view>
			  </view>
			</view>
			
			<view v-else class="no-order" :style="'height:' +clentHeight+'px;'" >
				<view class="">您还没有相关订单</view>
				<view class="no-order-home">去首页逛逛</view>
			</view>
			
		</view>
		</block>
		
	</view>
</template>

<script>
	import Lines from  '@/components/common/Lines.vue'
	import OrderList from '@/components/order/order-list.vue'
	export default {
		data() {
			return {
				// 高度
				clentHeight:0,
				// 当前位置
				tabIndex:0,
				// 顶部选项卡
				tabList:[
					{
						name:"全部",
					    list:[
							{
								status:"待付款",
								totalPrice:"3999.00",
								goods_item:[
									{
										imgUrl:"../../static/img/chao-2.png",
										name:"好衣服，就上好意王府，衣服好看",
										attrs:"黑色",
										pprice:"299.00",
										num:"1"
									},
									{
										imgUrl:"../../static/img/chao-2.png",
										name:"好衣服，就上好意王府，衣服好看",
										attrs:"黑色",
										pprice:"299.00",
										num:"2"
									},
								]
							}
						]
					},
					{
						name:"待付款",
						list:[]
					},
					{
						name:"待发货",
						list:[]
					},
					{
						name:"待收获",
						list:[]
					},
					{
						name:"待评价",
						list:[]
					},
				]
			}
		},
		onReady() {
			uni.getSystemInfo({
				success:(res)=>{
					this.clentHeight=res.windowHeight-this.getClientHeight();
				}
			})
		},
		components:{
			Lines,
			OrderList
		},
		methods: {
			// 顶部的切换
			changeTap(index){
				this.tabIndex = index;
			},
			getClientHeight(){
				const res = uni.getSystemInfoSync()
				const system = res.platform;
				if(system==='ios'){
					return 44+res.statusBarHeight;
				}else if(system==='android'){
					return 48+res.statusBarHeight;
				}else{
					return 0;
				}
			},
		}
	}
</script>

<style scoped>
.no-order{
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	}
.no-order-home{
	padding: 6rpx 60rpx;
	border: 2rpx solid  #00ffff;
	color: #00ffff;
	border-radius: 40rpx;
}
.payment{
	display: flex;
	justify-content: flex-end;
	background-color: #ffffff;
	padding: 20rpx;
}
.payment-text{
	border: 2rpx solid #00ffff;
	padding: 6rpx 40rpx;
	border-radius: 30rpx;	
}
.total-price{
		padding: 20rpx;
		display: flex;
		/* 居右 */
		justify-content: flex-end;
		background-color: #ffffff;
}

.goods-status{
	display: flex;
	justify-content: flex-end;
	background-color: white;
	padding: 20rpx;
}
.order-header{
	background-color: white;
	display: flex;
	justify-content: center;
	align-items: center;
	border-bottom: 2rpx solid #d2d2d2;
}
.header-item{
	text-align: center;
	flex: 1;
	line-height: 120rpx;
}
.active{
	border-bottom: 4rpx solid #00ffff;
}
</style>
