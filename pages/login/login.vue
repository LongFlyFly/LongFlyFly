<template>
	<view class="login">
		<!-- 切换屏 -->
		<swiper vertical="true" style="height: 100vh;">
			<swiper-item>
				<scroll-view>
					<view class="login-tel">
						<view class="tel-main" >
							<!-- 关闭按钮 -->
							<view class="close" @tap="goBack">
								<image class="close-img" src="../../static/img/close.png" mode=""></image>
							</view>
							
							<view class="logo">
								<image class="logo-img" src="../../static/img/logo.png" mode=""></image>
							</view>
							
							<view class="tel" @tap="toLoginTel">手机号注册</view>
							<!-- 其它登录方式 -->
							<LoginOther></LoginOther>
							
							<view class="login-go">
								<view>已有账号，去登录</view>
								<image src="../../static/img/down.png" mode=""></image>
							</view>
						</view>
					</view>
				</scroll-view>
			</swiper-item>
			
			<swiper-item>
				<scroll-view scroll-y="true" >
					<view class="login-tel">
						<view class="tel-main">
							<!-- 关闭按钮 -->
							<view class="close close-center" @tap="goBack">
								<image class="close-img" src="../../static/img/close.png" mode=""></image>
							</view>
							<view class="login-go">
								<image class="close-img" src="../../static/img/up.png" mode=""></image>
								<view class="">没有账号去注册</view>
							</view>
							<view ></view>
						</view>
						
						<view class="login-from">
							<view class="login-user">
								<text class="user-text">账号</text>
								<input type="text" v-model="userName" placeholder="请输入手机号">
							</view>
							<view class="login-user">
								<text class="user-text">密码</text>
								<input type="text" v-model="userPwd" placeholder="6-15位数">
							</view>
							<view class="login-quict">
								<view >忘记密码？</view>
								<view >免密登录</view>
							</view>
							<view class="tel" @tap="submit">登录</view>
							<view class="reminder">温馨提示：您可以选择免密登录</view>
							<LoginOther></LoginOther>
							
						</view>
					</view>
				</scroll-view>
			</swiper-item>
		</swiper>
		
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import LoginOther from '@/components/login/login-other.vue'
	import {mapMutations} from 'vuex'
	export default {
		data() {
			return {
				userName:"",
				userPwd:"",
				// 规则
				rules:{
					userName:{
						rule:/\S/,
						msg:"账号不能为空"
					},
					userPwd:{
						rule:/^[0-9a-zA-Z]{6,16}$/,
						msg:"密码应该为6-16位字符"
					}
				}
			}
		},
		components:{
			LoginOther
		},
		methods: {
			// 使用vuex中的方法
			...mapMutations(['login']),
			
			// 关闭当前页面，返回上一步
			goBack(){
				uni.navigateTo({
					url:'/pages/my/my'
				})
			},
			// 点击登录
			submit(){
				if(!this.validate('userName')) return;
				if(!this.validate('userPwd')) return;
				
				uni.showLoading({
					title:"登录中。。。"
				})
				
				// 封装接口
				$http.request({
					url:"/login",
					method:"POST",
					data:{
						userName:this.userName,
						userPwd:this.userPwd
					}
				}).then((res)=>{
					
					if(res.success){
						// 存入vuex
						this.login(res.data)
						
						uni.showToast({
							title:res.msg,
							icon:"none"
						})
						// 关闭展示
						uni.hideLoading();
						if(res.data != undefined){
							uni.navigateTo({
								url:'/pages/my/my'
							})
						}else{
							uni.showToast({
								title:"登录失败，请检查！",
								icon:"none"
							})
						}
					}else{
						uni.showToast({
							title:"账号或密码不存在，请注册！",
							icon:"none"
						})
					}
					
				}).catch(()=>{
					uni.showToast({
						title:'请求失败',
						icon:'none'
					})
				})
			},
			// 判断验证是否符合要求
			validate(key){
				let bool = true
				if(!this.rules[key].rule.test(this[key])){
					uni.showToast({
						title:this.rules[key].msg,
						icon:"none"
					})
					bool = false
					return false
				}
				return bool
			},
			toLoginTel(){
				uni.navigateTo({
					url:"../login-tel/login-tel"
				})
			}
		}
	}
</script>

<style scoped>
.login-tel{
	width: 100vw;
	height: 100vh;
}
.tel-main{
	padding: 0 20rpx;
}
.close{
	padding:120rpx 0;
}
.close-img{
	width: 60rpx;
	height: 60rpx;
}
.logo{
	padding-bottom :100rpx;
	display: flex;
	justify-content: center;
}
.tel{
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color: #ffffff;
	background-color: aqua;
	border-radius: 40rpx;
}

/* 去登陆 */
.login-go{
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
}
.login-go image{
	width: 60rpx;
	height: 60rpx;
}

/* 第二屏 */
.close-center{
	display: flex;
}
.close-center>view{
	flex:1;
}
.login-from{
	padding-top: 100rpx;
}
.login-user{
	font-size: 32rpx;
	padding: 10rpx 0;
	display: flex;
	align-items: center;
	border-bottom: 2rpx solid #f7f7f7;
}
.user-text{
	padding-right: 10rpx;
}
.login-quict{
	display: flex;
	justify-content: space-between;
	padding: 20rpx 0;
}
.reminder{
	color:#cccccc;
	padding: 20rpx 0;
	text-align: center;
}
</style>
