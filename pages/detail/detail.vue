<template>
	<view class="details">
	<!-- 商品图 -->
		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000">
			<swiper-item>
				<view class="swiper-item">
					<image class="swiper-img" :src="goodsContent.imgUrl" mode=""></image>
				</view>
			</swiper-item>
		</swiper>
		<!-- 商品和名称 -->
		<view class="details-goods">
			<view class="goods-pprice">￥{{goodsContent.pprice}}</view>
			<!-- <view class="goods-oprice">￥{{goodsContent.oprice}}</view> -->
			<view class="goods-name">{{goodsContent.name}}</view>
		</view>
	<hr>
	<!-- 商品的详情 -->
	<!-- <view>
		<view class=""><image class="details-img" src="../../static/img/tab-1.png" mode=""></image></view>
		<view class=""><image class="details-img" src="../../static/img/tab-2.png" mode=""></image></view>
	</view> -->
	<!-- 商品列表 -->
	<Card cardTitle="看了又看"></Card>
	<CommodityList :dataList="dataList"></CommodityList>
	
	<!-- 底部 -->
	<view class="details-foot">
		<!-- 后期用图片替换 -->
		<view class="iconfont" @click="showCollect(goodsContent)">
<svg t="1675051054769" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="2851" width="30" height="30"><path d="M520.7 98.2L643 345.9l273.4 39.7-197.8 192.9 46.7 272.3-244.6-128.6-244.5 128.6 46.7-272.3L125 385.6l273.5-39.7z" fill="#F0D155" p-id="2852"></path></svg>
		</view>
		<view class="iconfont" @tap="showTel">
<svg t="1675069742747" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5187" width="30" height="30"><path d="M510.69 226.2c-119.35 0-216.08 94.7-216.08 211.55 0 116.83 96.73 211.54 216.08 211.54 119.35 0 216.08-94.71 216.08-211.54 0-116.85-96.73-211.55-216.08-211.55zM261.18 518.94v-195.3c-2.73 0-5.45 0.11-8.13 0.33 44.28-96.12 142.9-163.07 257.66-163.07 114.76 0 213.39 66.95 257.66 163.07-2.68-0.21-5.39-0.33-8.13-0.33v195.3c55.11 0 99.82-43.73 99.82-97.65 0-36.62-20.62-68.53-51.12-85.25-42.89-120.86-160.04-207.68-298.22-207.68-138.18 0-255.32 86.81-298.24 207.68-30.5 16.71-51.12 48.63-51.12 85.26 0 53.92 44.68 97.64 99.82 97.64z m465.13 111.97c-56.46 51.59-132.27 83.18-215.62 83.18-83.2 0-158.88-31.47-215.31-82.89-100.99 50.88-167.29 141.43-167.29 264.45h767.83c-0.01-123.25-67.55-213.92-169.61-264.74z" fill="#f3ab00" p-id="5188"></path></svg>		</view>
		<view class="add-shopcart" @tap="goShopCart">购物车</view>
		<view class="purchase" @tap="showPop">立即购买</view>
	</view>
	
	<view class="pop"  v-show="isShow2" @touchmove.stop.prevent=''>
		<view class="pop-mask" @tap="hidePop"></view>
		<view class="pop-box" :animation="animationData">
			<view class="pop-sub">
				 请拨打电话：13018305773
			</view>
		</view>
	</view>
	
	<!-- 底部弹出层 -->
	<view class="pop" v-show="isShow" @touchmove.stop.prevent=''>
		<!-- 蒙层 -->
		<view class="pop-mask" @tap="hidePop"></view>
		<!-- 内容块 -->
		<view class="pop-box" :animation="animationData">
			<view>
				<image class="pop-img"  :src="goodsContent.imgUrl" mode=""></image>
			</view>
			<view class="pop-num">
				<view class="">购买数量</view>
			    <UniNumberBox min:1 :value="num" @change="changeNumber"></UniNumberBox>
			</view>
			<view class="pop-sub" @tap="addCart">
				确定
			</view>
		</view>
	</view>
	
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Card from '@/components/common/Card.vue'
	import CommodityList from '@/components/common/CommodityList.vue'
	import UniNumberBox from '@/components/uni/uni-number-box/components/uni-number-box/uni-number-box.vue'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				isShow:false,
				isShow2:false,
				animationData:{},
				goodsContent:{},
				
				num:1,
				dataList:[
					{id:9,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/imgextra/i4/26958996/O1CN01ZauIfo2GKDiHk1DLo_!!0-saturn_solar.jpg_460x460Q90.jpg_.webp",name:"复古小群",pprice:"329",oprice:"659",discount:"5.5"},
					{id:10,imgUrl:"https://g-search1.alicdn.com/img/bao/uploaded/i4/i3/2056385669/O1CN01HIr5za1rkS6WctNFY_!!0-item_pic.jpg_460x460Q90.jpg_.webp",name:"连衣裙",pprice:"59",oprice:"99",discount:"5.6"}
				]
			}
		},
		components:{
			Card,
			CommodityList,
			UniNumberBox
		},
		
		onLoad(e) {
			this.getData(e.id)
		},
		
		// 修改返回默认行为
		onBackPress(){
			if(this.isShow){
				this.hidePop()
				return true
			}
		},
		// 点击分享(仅app可用)
		onNavigationBarButtonTap(e) {
			if(e.type==='share'){
				// 看api文档
				uni.share({
					"provider":'weixin',
					"type":0,
					"scene":'WXSceneSession',
					"title":this.goodsContent.name,
					"href":"http://192.168.1.5:8080/#/pages/detail/detail?"+this.goodsContent.id+" ",
					"imageUrl":this.goodsContent.imgUrl,
					success:function(res){
						uni.showTabBar({
							title:"分享成功"
						})
					},
					fail:function(err){
						console.log("fail:"+JSON.stringify(err))
					}
				})
			}
		},
		
		methods: {
			...mapMutations(['addShopCart']),
			//收藏
			showCollect(e){
				// console.log(e)
				this.$store.commit('collects',e);
			},
			// 改变商品数量
			changeNumber(value){
				this.num=value
			},
			// 请求商品
			getData(id){
				$http.request({
					url:"/goods/id",
					data:{
						id:id
					}
				}).then((res)=>{
					this.goodsContent=res[0]
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			},
			showTel(){
				// 使用动画
				 var animation = uni.createAnimation({
				      duration: 200,
				        timingFunction: 'ease',
				    })
					
					animation.translateY(600).step();
					this.animationData = animation.export()
				    this.isShow2=true
				 
				 setTimeout(()=>{
					 animation.translateY(0).step();
					 this.animationData = animation.export()
				 },200)
			},
			showPop(){
				// 使用动画
				 var animation = uni.createAnimation({
				      duration: 200,
				        timingFunction: 'ease',
				    })
					
					animation.translateY(600).step();
					this.animationData = animation.export()
				    this.isShow=true
				 
				 setTimeout(()=>{
					 animation.translateY(0).step();
					 this.animationData = animation.export()
				 },200)
			},
			hidePop(){
				// 使用动画
				 var animation = uni.createAnimation({
				      duration: 200,
				      timingFunction: 'ease',
				    })
					
					animation.translateY(600).step();
					this.animationData = animation.export()
				    this.isShow=true
				    this.isShow2=true
				 setTimeout(()=>{
					 animation.translateY(0).step();
					 this.isShow=false
					 this.isShow2=false
				 },200)
			},
			// 跳转到购物车
			goShopCart(){
				uni.navigateTo({
					url:'../shopcart/shopcart'
				})
			},
			// 加入购物车
			addCart(){
				// 发送请求
				$http.request({
					url:"/addCart",
					method:"POST",
					data:{
						goods_id:this.goodsContent.Id,
						num:this.num
					}
				}).then((res)=>{
					// 隐藏弹框
					this.hidePop()
					// 提示信息
					uni.showToast({
						title:"成功加入购物车",
						icon:"none"
					})
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
				// let goods = this.goodsContent;
				// this.goodsContent['checked']=false;
				// this.goodsContent['num']=this.num;
				// this.addShopCart(goods)
				
			}
		}
	}
</script>

<style scoped>
	.details{
		padding-bottom: 90rpx;
	}
	swiper{
		width:100% ;
		height: 700rpx;
	}
	.swiper-img{
		width:100% ;
		height: 700rpx;
	}
	.details-goods{
		text-align: center;
		font-weight: bold;
		font-size: 36rpx;
		padding: 10rpx 0;
	}
	.details-img{
		width: 100%;
	}
	.details-foot{
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 90rpx;
		display: flex;
		align-items: center;
		justify-content: center;
		background-color: white;
	}
	.details-foot .iconfont{
		width: 60rpx;
		height: 60rpx;
		border-radius: 100%;
		background-color: black;
		color: white;
		text-align: center;
		margin: 0 10rpx;
	}
	.add-shopcart{
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: black;
		color: white;
		border-radius: 40rpx;
	}
	.purchase{
		margin: 0 40rpx;
		padding: 6rpx 30rpx;
		background-color: #00ffff;
		color: white;
		border-radius: 40rpx;
	}
	.pop{
		position: fixed;
		left: 0;
		top:0;
		width: 100%;
		height: 100%;
		z-index: 999;
	}
	.pop-mask{
		position: absolute;
		left: 0;
		top: 0;
		width: 100%;
		height: 100%;
		background-color: rgba(0, 0, 0, 0.3);
	}
	.pop-box{
		position: absolute;
		left: 0;
		bottom: 0;
		width: 100%;
		/* height: 400px; */
		background-color: white;
	}
	.pop-img{
		width: 260rpx;
		height: 260rpx;
	}
	.pop-sub{
		line-height: 80rpx;
		background-color: #00ffff ;
		color: white;
		text-align: center;
	}
	.pop-num{
		padding: 20rpx;
		display: flex;
		justify-content: space-between;
	}
</style>
