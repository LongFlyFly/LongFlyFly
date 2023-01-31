<template>
	<view class="config-order bg-active-color" >
		<Lines></Lines>
		<!-- 地址 -->
		<view class="order-map" @tap="goPathList">
			<template v-if="path">
				<view class="map-title">
					<view class="map-name">收件人：{{path.name}}</view>
					<view class="">{{path.tel}}</view>
				</view>
				<view class="map-city">收获地址：{{path.city}}{{path.details}}</view>
			</template>
			<template v-else>
				<view class="map-title">
					<view class="map-name">请选择地址</view>
				</view>
			</template>
		</view>
		
		<!-- 商品 -->
		<view class="goods-list">
			<view class="goods-content" v-for="(item,index) in goodsList" :key="index">
				<image class="goods-img" :src="item.imgUrl" mode=""></image>
				<view class="goods-text">
					<view class="goods-name">{{item.name}}</view>
					<view class="goods-size f-color">颜色分类：黑色</view>
					<view class="f-active-color" style="font-size: 24rpx;">7天无理由</view>
				</view>	
				<view class="">
					<view class="">￥{{item.pprice}}</view>
					<view class="f-color">x{{item.num}}</view>
				</view>
			</view>
			
		</view>
		
		<!-- 底部提交订单 -->
		<view class="order-foot">
			<view class="totle-price">合计:<text class="f-active-color">￥{{totalCount.pprice}}</text></view>
			<view class="comfirm" @tap="goPayment">提交订单</view>
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	import {mapGetters,mapState,mapMutations} from 'vuex'
    import { state } from '../../server/db/sql'
	export default {
		data() {
			return {
				path:false
			}
		},
		computed:{
			...mapState({
				list:state=>state.cart.list,
				orderNumber:state=>state.order.orderNumber,
				selectedList:state=>state.cart.selectedList
			}),
			...mapGetters(['defaultPath','totalCount']), 
			//根据商品列表筛选,数据的id
			goodsList(){
				return this.item?.map(id=>{
					return this.list.find( v => v.goods_id == id)
				})
			}
		},
		onLoad(e){
			
			$http.request({
				url:"/selectAdderss",
				method:"POST",
			}).then((res)=>{
				this._initAddressList(res)
				// 如果有默认地址的赋值
				if(this.defaultPath.length){
					this.path = this.defaultPath[0];
				}
			}).catch(()=>{
				uni.showToast({
					title:'请求失败',
					icon:'none'
				})
			})
			
			// 选中的商品id
			this.item = JSON.parse(e.detail)
			
			// 如果有自定义事件，则通过on来接收
			uni.$on("selectPathItem",(res)=>{
				this.path = res
			})
		},
		// 清空移除
		onUnload() {
			uni.$off('selectPathItem',()=>{})
		},
		components:{
			Lines
		},
		methods: {
			...mapMutations(['_initAddressList']),
			// 跳转到地址页面
			goPathList(){
				uni.navigateTo({
					url:'/pages/my-path-list/my-path-list?type=selectedPath'
				})
			},
			goPayment(){
				if(!this.path){
					return uni.showToast({
						title:"请选择收货地址",
						icon:"none"
					})
				}
				//创建一个订单
				$http.request({
					url:"/submitOrder",
					method:"POST",
					data:{
						orderId:this.orderNumber,
						shopArr:this.selectedList
					}
				}).then((res)=>{
					if(res.success){
						// 跳转到选择页
						uni.navigateTo({
							url:'/pages/payment/payment?details='+JSON.stringify({
								price:this.totalCount.pprice
							})
						})
					}
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				
			}
		}
	}
</script>

<style scoped>
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
