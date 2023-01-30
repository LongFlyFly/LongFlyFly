<template>
	<view class="tabbar">
		<view class="tab" 
			v-for="(item,index) in tabbarList" 
			:key="index"
			@tap="navigatorTo(item.pagePath)"
		>
			<image v-if="item.pagePath === cureenPage" :src="item.selectedIconPath" mode=""></image>
			<image v-else :src="item.iconPath" mode=""></image>
			<view class="text">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	export default{
		props:{
			cureenPage:{
				type:String,
				default:'index'
			}
		},
		data(){
			return{
				tabbarList:[
					{
							"pagePath": "index",
							"iconPath":"/static/tabbar/index.png",
							"selectedIconPath":"/static/tabbar/index2.png",
							"text": "首页"
						}, 
						{
							"pagePath": "list",
							"iconPath":"/static/tabbar/list.png",
							"selectedIconPath":"/static/tabbar/list2.png",
							"text": "分类"
						},
						{
							"pagePath": "shopcart",
							"iconPath":"/static/tabbar/car.png",
							"selectedIconPath":"/static/tabbar/car2.png",
							"text": "购物车"
						},
						{
							"pagePath": "my",
							"iconPath":"/static/tabbar/my.png",
							"selectedIconPath":"/static/tabbar/my2.png",
							"text": "我的"
						}
				]
			}
		},
		methods:{
			navigatorTo(e){
				if(e === 'shopcart' || e==='my'){
					this.navigateTo({
						url:`../../pages/${e}/${e}`,
						animationType:"fade-in",
						animationDuration:0
					})
				}else{
					// 点击带关闭
					uni.redirectTo({
						url:`../../pages/${e}/${e}`
					})
				} 
			}
		}
	}
</script>

<style scoped>
	.tabbar{
		border-top: 2rpx solid #555555;
		background-color: #ffffff;
		z-index: 9999;
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 120rpx;
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	image{
		width: 40rpx;
		height: 40rpx;
	}
	.tab{
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
	.text{
		font-size: 24rpx;
		padding: 10rpx 40rpx;
	}
</style>