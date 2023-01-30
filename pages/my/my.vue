<template>
	<view class="my">
		<!-- 头部 -->
		<view class="my-header">
			<view class="header-main">
				<view class="header-config" @tap="goConfig">
					<image class='config-img' src="../../static/img/sz.png" mode=""></image>
				</view>
				<view class="header-logo" @tap="toLogin">
					<image class='logo-img' :src="loginStatus ? userInfo.imgUrl : '未登录' " mode=""></image>
					<view class="logo-name">{{loginStatus ? userInfo.nickName : "用户名称"}}</view>
				</view>
			</view>
		</view>
		<!-- 订单 -->
		<view class="order">
			<view class="order-title">
				<view class="" @tap="goOrder">我的订单</view>
				<view class="">全部订单</view>
			</view>
			<view class="order-list">
				<view class="order-item">
					<image class="order-img" src="../../static/img/buy.png" mode=""></image>
					<view class="">待付款</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/sendbuy.png" mode=""></image>
					<view class="">待发货</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/shouhuo.png" mode=""></image>
					<view class="">待收货</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/pingjia.png" mode=""></image>
					<view class="">待评价</view>
				</view>
				<view class="order-item">
					<image class="order-img" src="../../static/img/buy1.png" mode=""></image>
					<view class="">退款</view>
				</view>
			</view>
		</view>
		
		<!-- 内容列表 -->
		<view class="my-content">
			
				<view class="my-content-item" @tap="toCollect">
					<view class="">我的收藏</view>
					<view class=""> > </view>
				</view>
				
				<view class="my-content-item">
					<view class="">交易记录</view>
					<view class=""> > </view>
				</view>
				
				<view class="my-content-item"  @click="updateVersion">
					<view class="" >版本更新</view>
					<view class="">已是最新版本 V1.0.1 > </view>
				</view>
				
				<view class="my-content-item"  @tap="outLogin">
					<view class="">退出登录</view>
					<view class=""> > </view>
				</view>
			
		</view>
		<Tabbar cureenPage='my'></Tabbar>
	</view>
</template>

<script>
	import {mapState,mapMutations} from 'vuex'
	import Tabbar from '@/components/common/Tabbar.vue'
	export default {
		data() {
			return {
				
			}
		},
		components:{
			Tabbar
		},
		computed:{
			...mapState({
				loginStatus:state=>state.user.loginStatus,
				userInfo:state=>state.user.userInfo
			})
		},
		onLoad() {
			// 版本更新
			//#ifdef APP-PLUS
			plus.runtime.getProperty(plus.runtime.appid, (info) => {
				this.version ="v"+ info.version
			})
			//#endif
			
		},
		methods: {
			...mapMutations(['loginOut']),
			updateVersion(){
				uni.showToast({
					title: '最新版本',
					icon: "none"
				});
			},
			toCollect(){
				uni.navigateTo({
					url:'../collect/collect'
				})
			},
			goConfig(){
				uni.navigateTo({
					url:'../my-config/my-config'
				})
			},
			goOrder(){
				uni.navigateTo({
					url:'../my-order/my-order'
				})
			},
			toLogin(){
				uni.navigateTo({
					url:'/pages/login/login'
				})
			},
			outLogin(){
				uni.showToast({
					title:"退出成功",
					icon:'none'
				})
				setTimeout(()=>{
					this.loginOut();
					// 关闭所有
					uni.reLaunch({
						url:'/pages/index/index'
					})
				},1000)
			}
		}
	}
</script>

<style scoped>
.my-header{
	background: url(../../static/img/bg.jpg) no-repeat;
	width: 100%;
	height: 400rpx;
}
.header-main{
	position: relative;
	top:20rpx
}
.header-logo{
	position: absolute;
	left:50%;
	margin-left: -60rpx;
	width: 140rpx;
	height: 120rpx;
}
.config-img{
	width: 40rpx;
	height: 40rpx;
}
.logo-img{
	width: 120rpx;
	height: 120rpx;
	border:2rpx solid #b4b4b4;
	border-radius: 50%;
	background-color: white;
}
.header-config{
	position: absolute;
	left:40rpx;
}
.logo-name{
	font-weight: bold;
	color: black;
	text-align: center;
}
.order-title{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
}
.order-list{
	padding: 20rpx;
	display: flex;
	
}
.order-item{
	flex: 1;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.order-img{
	width: 66rpx;
	height: 66rpx;
}
.my-content-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx 0;
	border-bottom: 2rpx solid #949494;
}
.my-content{
	margin: 20rpx 0;
	padding: 0 20rpx;
}
</style>
