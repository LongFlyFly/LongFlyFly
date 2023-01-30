<template>
	<view class="my-config">
		
		<view class="config-item" @tap="goPathList">
			<view class="">地址管理</view>
			<view class="config-mark"> > </view>
		</view>
		
		
		<view class="my-exit" @tap="outLogin">退出登录</view>
		
	</view>
</template>

<script>
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			...mapMutations(['loginOut']),
			goPathList(){
				uni.navigateTo({
					url:'../my-path-list/my-path-list'
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
.config-item{
		display: flex;
		justify-content: space-between;
		padding: 20rpx 0 20rpx 20rpx;
		border-bottom: 2rpx solid #CCCCCC;
	}
.my-exit{
	background-color: #00ffff;
	width: 100%;
	line-height: 80rpx;
	color: white;
	text-align: center;
}
.config-mark{
	padding-right: 10rpx;
}
</style>
