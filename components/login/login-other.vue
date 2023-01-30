<template>
	<view class="login-other">
		<view class="other-text">
			<view class="">或者用以下方式登录</view>
		</view>
		<view class="other">
			<view class="other-item" @tap="loginOther('qq')">
				<image src="../../static/img/qq.png" mode=""></image>
				<view class="">QQ登录</view>
			</view>
			<view class="other-item" @tap="loginOther('weixin')">
				<image src="../../static/img/wx.png" mode=""></image>
				<view class="">微信登录</view>
			</view>
			<view class="other-item" @tap="loginOther('sinaweibo')">
				<image src="../../static/img/weibo.png" mode=""></image>
				<view class="">微博登录</view>
			</view>
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import {mapMutations} from 'vuex'
export default{
	methods:{
		// 使用vuex中的方法
		...mapMutations(['login']),
		
		// 第三方登录的api
		loginOther(mode){
			uni.login({
				provider:mode,
					// 最主要的是openID
				success:(res)=> {
				
					uni.getUserInfo({
						provider:mode,
						success: (res) => {
							let provider = mode;
							// 用户身份
							let openid = res.userInfo.openId ||res.userInfo.openid
							let nickName = res.userInfo.nickName
							let avatarUrl = res.userInfo.avatarUrl
							
							$http.request({
								url:"/loginother",
								method:"POST",
								data:{
									provider,
									openid,
									nickName,
									avatarUrl
								}
							}).then((res)=>{
								 console.log(res)
									// 存入vuex
									this.login(res)
									
									if(res!= undefined){
										uni.navigateTo({
											url:'/pages/my/my'
										})
									}
							
							}).catch(()=>{
								uni.showToast({
									title:'请求失败',
									icon:'none'
								})
							})
							
						}
					})
				}
			})
		}
	}
}
</script>

<style scoped> 
	/* 其它登录方式的样式 */
	.login-other{
		padding: 100rpx 0;
	}
	.other-text{
		display: flex;
		padding: 50rpx 0;
	}
	.other-text view{
		line-height: 0rpx;
		padding: 0 10rpx;
	}
	.other-text:after{
		flex: 1;
		content: '';
		height: 2rpx;
		background-color: #cccccc;
	}
	.other-text::before{
		flex: 1;
		content: '';
		height: 2rpx;
		background-color: #cccccc;
	}
	.other{
		display: flex;
		justify-content: space-between;
	}
	.other-item{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.other-item image{
		width: 80rpx;
		height: 80rpx;
	}
</style>