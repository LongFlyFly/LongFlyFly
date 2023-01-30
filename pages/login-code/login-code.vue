<template>
	<view>
		<Lines></Lines>
		<view class="login-tel">
			<view class="tel-main">
			  <view class="login-from">
				<view class="login-user">
					<text class="user-text">姓名</text>
					<input type="text" focus="true" placeholder="请输入姓名" v-model="userName">
				</view>
				<view class="login-user">
					<text class="user-text">密码</text>
					<input type="text" focus="true" placeholder="请输入密码" v-model="userPwd">
				</view>
				<view class="login-user">
					<text class="user-text">电话</text>
					<input type="text" focus="true" placeholder="请输入电话" v-model="phone">
				</view>
				<view class="login-user">
					<text class="user-text">昵称</text>
					<input type="text" focus="true" placeholder="请输入昵称" v-model="nickName">
				</view>
			</view>	
				<view class="tel" @tap="goIndex">注册</view>
				
			</view>
		</view>
	</view>
</template>

<script>
	import $http from '@/common/api/request.js'
	import Lines from '@/components/common/Lines.vue'
	export default {
		data() {
			return {
				//倒计时时间
				codeNum:60,
				// 显示的时间
				codeMsg:"",
				// 按钮是否禁用
				disabled:false,
				userName:'',
				userPwd:'',
				phone:'',
				nickName:'',
				rules:{
					userName:{
						rule:/\S/,
						msg:"账号不能为空"
					},
					userPwd:{
						rule:/^[0-9a-zA-Z]{6,16}$/,
						msg:"密码应该为6-16位字符"
					},
					phone:{
						rule:/^1[3456789]\d{9}$/,
						msg:"请输入11位手机号"
					}
				}
			}
		},
		components:{
			Lines
		},
		
		methods: {
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
			
			goIndex(){
				if(!this.validate('phone')) return;
				if(!this.validate('userName')) return;
				if(!this.validate('userPwd')) return;
				// 请求数据接口返回验证符
				$http.request({
					url:"/code",
					method:"POST",
					data:{
						userName:this.userName,
						userPwd:this.userPwd,
						phone:this.phone,
						nickName:this.nickName
					}
				}).then((res)=>{
					
					uni.showToast({
						title:"注册成功，请登录！",
						icon:"none"
					})
					uni.hideLoading();
					
					setTimeout(()=>{
						uni.navigateTo({
							url:'/pages/login/login'
						})
					},2000)		
				})
			},
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
.login-from{
	padding: 30rpx 0; 
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
.tel{
	width: 100%;
	height: 80rpx;
	line-height: 80rpx;
	text-align: center;
	color: #ffffff;
	background-color: aqua;
	border-radius: 40rpx;
}
</style>
