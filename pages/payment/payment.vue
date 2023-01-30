<template>
	<view>
		<uniNavBar
			title="确认支付"
			left-text='关闭'
			fixed="true"
			status-bar="true"
			@clickLeft="goBack"
		></uniNavBar>
		<view class="pay-main">
			
			<radio-group name="">
				<label for="">
					<view class="pay-item">
						<image class="pay-img" src="../../static/img/zfb.png" alt="">
						<view>
							<view>支付宝支付</view>
							<view class="pay-txt">推荐支付宝用户使用</view>
						</view>
						<label class="radio">
							<radio value="" color="#ff3333"/><text></text>
						</label>
					</view>
				</label>
				
				<label for="">
					<view class="pay-item">
						<image class="pay-img" src="../../static/img/wx.png" alt="">
						<view>
							<view>微信支付</view>
							<view class="pay-txt">推荐微信用户使用</view>
						</view>
						<label class="radio">
							<radio value="" color="#ff3333"/><text></text>
						</label>
					</view>
				</label>
			</radio-group>
			
		</view>
		
		<!-- 底部去支付 -->
		<view class="pay-foot">
			<view class="total">
				<text class="f-color">合计：</text><text class="total-price">￥{{details.price}}</text>
			</view>
			<view class="go-pay" @tap="goPayment">
				去支付
			</view>
		</view>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni/uni-nav-bar/components/uni-nav-bar/uni-nav-bar.vue'
	export default {
		data() {
			return {
				details:{
					price:0
				}
			}
		},
		components:{
			uniNavBar
		},
		onLoad(e) {
			this.details =JSON.parse(e.details)
		},
		methods: {
			// 返回上一页
			goBack(){
				uni.navigateBack({
					delta:1
				})
			},
			goPayment(){
				uni.navigateTo({
					url:'/pages/payment-success/payment-success'
				})
			}
		}
	}
</script>

<style>
.pay-item{
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 20rpx;
	border-bottom: 2rpx solid #CCCCCC;
}
.pay-txt{
	color: #d6d6d6;
}
.pay-img{
	width: 100rpx;
	height: 100rpx;
}
.total-price{
	color: white;
}
.pay-foot{
	width: 100%;
	position: fixed;
	left: 0;
	bottom: 0;
	height: 100rpx;
	display: flex;
	justify-content: space-between;
	align-items: center;
}
.total{
	padding-left: 100rpx;
	flex:1 ;
	line-height: 100rpx;
	background-color: black;
}
.go-pay{
	color: white;
	background-color: aqua;
	line-height: 100rpx;
	text-align: center;
	width: 220rpx;
}
</style>
